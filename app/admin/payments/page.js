'use client';

import { useState, useEffect } from 'react';

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);

  const fetchPayments = async () => {
    try {
      const response = await fetch('/api/admin/payments');
      const data = await response.json();
      
      if (data.success) {
        setPayments(data.payments);
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsPaid = async (paymentId) => {
    setProcessing(paymentId);
    try {
      const response = await fetch('/api/admin/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentId,
          action: 'mark_paid'
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        // Remove from pending list
        setPayments(payments.filter(p => p.id !== paymentId));
        alert('Payment marked as paid successfully!');
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error marking payment as paid:', error);
      alert('Failed to mark payment as paid');
    } finally {
      setProcessing(null);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading payments...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin - Pending Payments</h1>
          <p className="text-gray-600">
            Total pending payments: {payments.length}
          </p>
          <button
            onClick={fetchPayments}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Refresh
          </button>
        </div>

        {payments.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-500 text-lg">No pending payments found! 🎉</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {payments.map((payment) => (
              <div key={payment.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3">
                      <h3 className="text-xl font-semibold text-gray-900">
                        ₹{payment.amount}
                      </h3>
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                        Pending
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p><strong>From:</strong> {payment.name}</p>
                        <p><strong>Email:</strong> {payment.email}</p>
                        <p><strong>To:</strong> @{payment.to_user}</p>
                      </div>
                      <div>
                        <p><strong>Session ID:</strong> {payment.sessionId}</p>
                        <p><strong>Created:</strong> {new Date(payment.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                    
                    {payment.message && (
                      <div className="mt-4 p-3 bg-gray-50 rounded">
                        <p className="text-gray-700"><strong>Message:</strong> {payment.message}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="ml-6">
                    <button
                      onClick={() => markAsPaid(payment.id)}
                      disabled={processing === payment.id}
                      className={`px-6 py-2 rounded-lg font-medium ${
                        processing === payment.id
                          ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                          : 'bg-green-500 text-white hover:bg-green-600'
                      }`}
                    >
                      {processing === payment.id ? 'Processing...' : 'Mark as Paid'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
