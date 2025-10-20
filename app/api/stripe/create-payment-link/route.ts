import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getSupabaseClient } from '@/lib/supabaseLazy'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, recipient, note, userId } = body

    // Validate required fields
    if (!amount || !recipient || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Calculate total amount with 4% fee
    const feeAmount = amount * 0.04
    const totalAmount = amount + feeAmount

    // Convert to cents (Stripe uses cents)
    const amountInCents = Math.round(totalAmount * 100)

    // Calculate JOD equivalent for reference (1 EUR = 0.85 JOD)
    const EUR_TO_JOD = 0.85
    const jodAmount = totalAmount * EUR_TO_JOD

    // Create a checkout session instead of payment link
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Transfer to ${recipient}`,
              description: note || `Transfer €${amount} (${jodAmount.toFixed(2)} JOD) to ${recipient}`,
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/send`,
      metadata: {
        userId,
        recipient,
        originalAmount: amount.toString(),
        feeAmount: feeAmount.toString(),
        totalAmount: totalAmount.toString(),
        jodAmount: jodAmount.toFixed(2),
        exchangeRate: EUR_TO_JOD.toString(),
        note: note || '',
      },
      billing_address_collection: 'required',
      phone_number_collection: {
        enabled: true,
      },
    })

    // Create transaction record in database
    const supabase = getSupabaseClient()
    const { data: transaction, error: transactionError } = await supabase
      .from('transactions')
      .insert([
        {
          user_id: userId,
          send_amount_eur: amount,
          fee_eur: feeAmount,
          total_eur: totalAmount,
          send_amount_jod_equivalent: amount * EUR_TO_JOD,
          total_jod_equivalent: jodAmount,
          eur_to_jod_rate: EUR_TO_JOD,
          status: 'pending',
          recipient_name: recipient,
          note: note || '',
          stripe_session_id: session.id,
        },
      ])
      .select()

    if (transactionError) {
      console.error('Error creating transaction:', transactionError)
      return NextResponse.json(
        { error: 'Failed to create transaction record' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      paymentLink: session.url,
      transactionId: transaction[0].id,
      amount: totalAmount,
      fee: feeAmount,
    })
  } catch (error) {
    console.error('Error creating payment link:', error)
    return NextResponse.json(
      { error: 'Failed to create payment link' },
      { status: 500 }
    )
  }
}
