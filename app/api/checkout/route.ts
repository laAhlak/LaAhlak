import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function POST(request: NextRequest) {
  try {
    const { amountEUR, email, sendAmountJOD, feeJOD, exchangeRate, userId, beneficiaryId } = await request.json()

    if (!amountEUR || !email || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields: amountEUR, email, and userId' },
        { status: 400 }
      )
    }

    // Create Stripe Checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'Transfer to Jordan',
              description: `Send ${sendAmountJOD} JOD to Jordan`,
            },
            unit_amount: Math.round(amountEUR * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cancel`,
      customer_email: email,
      metadata: {
        sendAmountJOD: sendAmountJOD.toString(),
        feeJOD: feeJOD.toString(),
        exchangeRate: exchangeRate.toString(),
        userId: userId,
        beneficiaryId: beneficiaryId || '',
      },
    })

    return NextResponse.json({ sessionUrl: session.url })
  } catch (error) {
    console.error('Stripe Checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
