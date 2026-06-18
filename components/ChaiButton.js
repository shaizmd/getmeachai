'use client'
import { loadStripe } from '@stripe/stripe-js'
import { Heart } from 'lucide-react'

export default function ChaiButton({ amount, message, creatorName, customClassName }) {
  const handleClick = async () => {
    try {
      const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

      if (!publishableKey) {
        alert('Stripe is not configured yet. Add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY and try again.')
        return
      }

      const stripe = await loadStripe(publishableKey)

      if (!stripe) {
        alert('Stripe is not configured correctly. Please check the publishable key and try again.')
        return
      }

      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount || 5, // Default to $5
          message: message || '',
          creatorName: creatorName || 'Creator',
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        console.error('Checkout session error:', data)
        alert(data.error || 'Unable to start checkout. Please try again.')
        return
      }
      
      if (data.error) {
        console.error('Error:', data.error)
        alert('Something went wrong. Please try again.')
        return
      }

      await stripe.redirectToCheckout({ sessionId: data.id })
    } catch (error) {
      console.error('Error:', error)
      alert('Something went wrong. Please try again.')
    }
  }

  return (
    <button
      onClick={handleClick}
      className={customClassName || "bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 cursor-pointer"}
    >
      <Heart className="h-5 w-5" />
      <span>Support with ${amount || 5}</span>
    </button>
  )
}
