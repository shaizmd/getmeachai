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
      // Removed sparse: true to avoid duplicate index warning
    },
    
    // Stripe payment intent ID
    stripePaymentIntentId: {
      type: String,
      // Removed sparse: true to avoid duplicate index warning
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
PaymentSchema.methods.markAsPaid = async function(paymentIntentId) {
  this.status = 'paid';
  if (paymentIntentId) {
    this.stripePaymentIntentId = paymentIntentId;
  }
  
  // Save the payment first
  await this.save();
  
  // Update the creator's goal amount
  try {
    // Import Page model dynamically to avoid circular dependency
    const Page = mongoose.models.Page || require('./Page').default;
    const userPage = await Page.findOne({ username: this.to_user });
    
    if (userPage && userPage.goal) {
      // Calculate total amount for this user from all paid payments
      const totalAmount = await this.constructor.aggregate([
        { $match: { to_user: this.to_user, status: 'paid' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]);
      
      const currentAmount = totalAmount.length > 0 ? totalAmount[0].total : 0;
      userPage.goal.currentAmount = currentAmount;
      await userPage.save();
      
      console.log(`Updated goal for ${this.to_user}: ${currentAmount}/${userPage.goal.targetAmount}`);
    }
  } catch (error) {
    console.error('Error updating goal amount:', error);
  }
  
  return this;
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
