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
    // console.log(`🔔 Received webhook: ${event.type}`)
    
    switch (event.type) {
      // Essential payment events
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object)
        break
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object)
        break
      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object)
        break
      
      // Subscription events (for future use)
      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object)
        break
      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object)
        break
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object)
        break
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object)
        break
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object)
        break
      
      // Dispute and refund events
      case 'charge.dispute.created':
        await handleChargeDisputeCreated(event.data.object)
        break
      case 'charge.refunded':
        await handleChargeRefunded(event.data.object)
        break
      
      default:
        // console.log(`⚠️ Unhandled event type: ${event.type}`)
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
    // console.log('Handling checkout session completed:', session.id);
    
    // Find the payment record by session ID
    const payment = await Payment.findOne({ stripeSessionId: session.id });
    
    if (!payment) {
      console.error('Payment not found for session:', session.id);
      return;
    }
    
    // console.log('Found payment:', payment._id, 'current status:', payment.status);
    
    // Update payment status
    await payment.markAsPaid(session.payment_intent);
    
    // console.log('Payment marked as paid:', payment._id);
    
  } catch (error) {
    console.error('Error handling checkout session completed:', error);
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

async function handleInvoicePaymentSucceeded(invoice) {
  try {
    // console.log('🔔 Invoice payment succeeded:', invoice.id)
    // Handle successful subscription payments here
    // This would be used for monthly supporter subscriptions
    
  } catch (error) {
    console.error('Error handling invoice payment succeeded:', error)
  }
}

async function handleInvoicePaymentFailed(invoice) {
  try {
    // console.log('❌ Invoice payment failed:', invoice.id)
    // Handle failed subscription payments here
    // You might want to notify the user or retry payment
    
  } catch (error) {
    console.error('Error handling invoice payment failed:', error)
  }
}

async function handleSubscriptionCreated(subscription) {
  try {
    // console.log('🆕 Subscription created:', subscription.id)
    // Handle new subscription creation here
    
  } catch (error) {
    console.error('Error handling subscription created:', error)
  }
}

async function handleSubscriptionUpdated(subscription) {
  try {
    // console.log('🔄 Subscription updated:', subscription.id)
    // Handle subscription updates here
    
  } catch (error) {
    console.error('Error handling subscription updated:', error)
  }
}

async function handleSubscriptionDeleted(subscription) {
  try {
    // console.log('❌ Subscription deleted:', subscription.id)
    // Handle subscription cancellation here
    
  } catch (error) {
    console.error('Error handling subscription deleted:', error)
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

async function handleChargeRefunded(charge) {
  try {
    // console.log('💰 Charge refunded:', charge.id)
    
    // Find payment by charge ID
    const payment = await Payment.findOne({ stripePaymentIntentId: charge.payment_intent })
    
    if (!payment) {
      console.error('Payment not found for refunded charge:', charge.id)
      return
    }
    
    // Mark payment as refunded
    await Payment.findByIdAndUpdate(payment._id, { 
      status: 'refunded',
      refundedAt: new Date(),
      refundAmount: charge.amount_refunded
    })
    
    // console.log('Payment marked as refunded:', payment._id)
    
  } catch (error) {
    console.error('Error handling charge refunded:', error)
  }
}
