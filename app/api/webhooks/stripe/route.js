// app/api/webhooks/stripe/route.js
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import dbConnect from '@/lib/mongodb'
import Payment from '@/models/Payment'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(req) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')
  
  let event
  
  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 })
  }
  
  await dbConnect()
  
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object)
        break
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object)
        break
      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object)
        break
      case 'charge.dispute.created':
        await handleChargeDisputeCreated(event.data.object)
        break
      default:
        // Unhandled event type
        break
    }
    
    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}

async function handleCheckoutSessionCompleted(session) {
  try {
    // Find the payment record by session ID
    const payment = await Payment.findOne({ stripeSessionId: session.id })
    
    if (!payment) {
      console.error('Payment not found for session:', session.id)
      return
    }
    
    // Update payment status
    await payment.markAsPaid(session.payment_intent)
    
  } catch (error) {
    console.error('Error handling checkout session completed:', error)
  }
}

async function handlePaymentIntentSucceeded(paymentIntent) {
  try {
    // Find payment by payment intent ID
    const payment = await Payment.findOne({ stripePaymentIntentId: paymentIntent.id })
    
    if (!payment) {
      console.error('Payment not found for payment intent:', paymentIntent.id)
      return
    }
    
    // Ensure payment is marked as paid
    if (payment.status !== 'paid') {
      await payment.markAsPaid(paymentIntent.id)
    }
    
  } catch (error) {
    console.error('Error handling payment intent succeeded:', error)
  }
}

async function handlePaymentIntentFailed(paymentIntent) {
  try {
    // Find payment by payment intent ID
    const payment = await Payment.findOne({ stripePaymentIntentId: paymentIntent.id })
    
    if (!payment) {
      console.error('Payment not found for payment intent:', paymentIntent.id)
      return
    }
    
    // Mark payment as failed
    await payment.markAsFailed()
    
  } catch (error) {
    console.error('Error handling payment intent failed:', error)
  }
}

async function handleChargeDisputeCreated(dispute) {
  try {
    // Find payment by charge ID
    const payment = await Payment.findOne({ stripePaymentIntentId: dispute.payment_intent })
    
    if (!payment) {
      console.error('Payment not found for dispute:', dispute.id)
      return
    }
    
    // You might want to mark this payment as disputed or handle it differently
    // Additional logic for handling disputes can be added here
    
  } catch (error) {
    console.error('Error handling charge dispute created:', error)
  }
}
