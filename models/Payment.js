// models/Payment.js
import mongoose from 'mongoose'

const PaymentSchema = new mongoose.Schema(
  {
    // Supporter name
    name: { 
      type: String, 
      required: true 
    },
    
    // Creator username (who receives the payment)
    to_user: { 
      type: String, 
      required: true 
    },
    
    // Payment amount
    amount: { 
      type: Number, 
      required: true, 
      min: 0.01 // Minimum $0.01
    },
    
    // Transaction ID (from Stripe)
    trans_id: { 
      type: String, 
      required: true, 
      unique: true
    },
    
    // Message from supporter
    message: { 
      type: String, 
      default: '',
      maxlength: 500 // Limit message length
    },
    
    // Payment status
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending'
    },
    
    // Stripe session ID
    stripeSessionId: {
      type: String,
      sparse: true
    },
    
    // Stripe payment intent ID
    stripePaymentIntentId: {
      type: String,
      sparse: true
    },
    
    // Supporter email (optional)
    email: {
      type: String,
      sparse: true
    }
  },
  {
    collection: 'payments',
    timestamps: true // This will automatically handle createdAt and updatedAt
  }
)

// Helper methods
PaymentSchema.methods.markAsPaid = function(paymentIntentId) {
  this.status = 'paid';
  if (paymentIntentId) {
    this.stripePaymentIntentId = paymentIntentId;
  }
  return this.save();
};

PaymentSchema.methods.markAsFailed = function() {
  this.status = 'failed';
  return this.save();
};

PaymentSchema.methods.markAsRefunded = function() {
  this.status = 'refunded';
  return this.save();
};

// Basic indexes for better query performance
PaymentSchema.index({ to_user: 1 })
PaymentSchema.index({ createdAt: -1 })
PaymentSchema.index({ status: 1 })
PaymentSchema.index({ stripeSessionId: 1 })
PaymentSchema.index({ stripePaymentIntentId: 1 })

export default mongoose.models.Payment || mongoose.model('Payment', PaymentSchema)
