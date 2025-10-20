import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'
import { createTransaction, updateTransactionStatus } from '@/lib/transactions'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        
        // Extract metadata
        const { sendAmountJOD, feeJOD, exchangeRate, userId, beneficiaryId } = session.metadata || {}
        
        if (!sendAmountJOD || !feeJOD || !exchangeRate || !userId) {
          console.error('Missing metadata in checkout session')
          break
        }

        // Calculate total EUR from the session amount
        const totalEUR = session.amount_total ? session.amount_total / 100 : 0
        const totalJOD = parseFloat(sendAmountJOD) + parseFloat(feeJOD)

        // Create transaction using our CRUD function
        const { data: transaction, error } = await createTransaction({
          user_id: userId,
          beneficiary_id: beneficiaryId || undefined,
          send_amount_jod: parseFloat(sendAmountJOD),
          fee_jod: parseFloat(feeJOD),
          total_jod: totalJOD,
          total_eur: totalEUR,
          exchange_rate: parseFloat(exchangeRate),
          status: 'completed',
          stripe_session_id: session.id,
        })

        if (error) {
          console.error('Error creating transaction:', error)
          return NextResponse.json({ error: 'Database error' }, { status: 500 })
        }

        // Log webhook event
        await supabase
          .from('webhook_logs')
          .insert({
            transaction_id: transaction?.[0]?.id,
            event_type: 'checkout.session.completed',
            payload: event.data.object,
          })

        console.log('Transaction created successfully:', session.id)
        break
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session
        
        // Find transaction by stripe_session_id
        const { data: transactions } = await supabase
          .from('transactions')
          .select('id')
          .eq('stripe_session_id', session.id)
          .limit(1)

        if (transactions && transactions.length > 0) {
          // Update transaction status to expired using our CRUD function
          const { error } = await updateTransactionStatus(transactions[0].id, 'expired')
          
          if (error) {
            console.error('Error updating expired transaction:', error)
          }

          // Log webhook event
          await supabase
            .from('webhook_logs')
            .insert({
              transaction_id: transactions[0].id,
              event_type: 'checkout.session.expired',
              payload: event.data.object,
            })
        }
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}
