import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getSupabaseClient } from '@/lib/supabaseLazy'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    const supabase = getSupabaseClient()

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        
        // Find transaction by session ID
        const { data: transaction, error: findError } = await supabase
          .from('transactions')
          .select('*')
          .eq('stripe_session_id', session.id)
          .single()

        if (findError || !transaction) {
          console.error('Transaction not found:', findError)
          break
        }

        // Update transaction status
        const { error: updateError } = await supabase
          .from('transactions')
          .update({
            status: 'completed',
            stripe_session_id: session.id,
            updated_at: new Date().toISOString(),
          })
          .eq('id', transaction.id)

        if (updateError) {
          console.error('Error updating transaction:', updateError)
        }

        console.log('Payment completed for transaction:', transaction.id)
        break
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session
        
        // Update transaction status to expired
        const { error: updateError } = await supabase
          .from('transactions')
          .update({
            status: 'expired',
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_session_id', session.id)

        if (updateError) {
          console.error('Error updating expired transaction:', updateError)
        }

        console.log('Payment session expired for session:', session.id)
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        
        // Find and update transaction status
        const { error: updateError } = await supabase
          .from('transactions')
          .update({
            status: 'failed',
            updated_at: new Date().toISOString(),
          })
          .eq('stripe_session_id', paymentIntent.id)

        if (updateError) {
          console.error('Error updating failed transaction:', updateError)
        }

        console.log('Payment failed for session:', paymentIntent.id)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
