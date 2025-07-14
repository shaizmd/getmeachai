'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { 
  Wallet, 
  DollarSign, 
  Download, 
  CreditCard, 
  AlertCircle,
  CheckCircle,
  Clock,
  RefreshCw,
  TrendingUp,
  Filter,
  Search,
  Eye,
  Edit,
  Settings,
  User,
  Shield,
  Lock,
  Mail,
  Calendar,
  Target
} from 'lucide-react';
import useDocumentTitle from '@/hooks/useDocumentTitle';

export default function AdminPayments() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [adminData, setAdminData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [selectedPayments, setSelectedPayments] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [withdrawalHistory, setWithdrawalHistory] = useState([]);
  const [processingWithdrawal, setProcessingWithdrawal] = useState(false);

  // Dynamic title based on active tab
  const getPageTitle = () => {
    const tabTitles = {
      overview: 'Overview - Admin Panel',
      payments: 'Payments - Admin Panel',
      withdrawals: 'Withdrawals - Admin Panel',
      account: 'Account Settings - Admin Panel'
    };
    return tabTitles[activeTab] || 'Admin Panel - Manage Payments & Withdrawals';
  };

  useDocumentTitle(getPageTitle(), [activeTab]);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/signin');
      return;
    }
  }, [session, status, router]);

  // Fetch admin data
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await fetch('/api/admin/account');
        if (response.ok) {
          const data = await response.json();
          setAdminData(data);
        } else {
          const errorData = await response.json();
          console.error('Failed to fetch admin data:', errorData);
          
          // Handle specific error cases
          if (response.status === 403) {
            // Access denied - user doesn't have a page
            setAdminData({ 
              error: 'access_denied', 
              message: errorData.message || 'You do not have access to this admin panel.',
              details: errorData.error
            });
          } else {
            setAdminData({ 
              error: 'fetch_failed', 
              message: 'Failed to load admin data. Please try again later.' 
            });
          }
        }
      } catch (error) {
        console.error('Error fetching admin data:', error);
        setAdminData({ 
          error: 'network_error', 
          message: 'Network error. Please check your connection and try again.' 
        });
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchAdminData();
    }
  }, [session]);

  // Handle withdrawal request
  const handleWithdrawal = async () => {
    if (!withdrawalAmount || parseFloat(withdrawalAmount) <= 0) {
      alert('Please enter a valid withdrawal amount');
      return;
    }

    if (parseFloat(withdrawalAmount) > adminData.availableBalance) {
      alert('Insufficient balance for withdrawal');
      return;
    }

    setProcessingWithdrawal(true);
    try {
      const response = await fetch('/api/admin/withdraw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(withdrawalAmount),
        }),
      });

      if (response.ok) {
        alert('Withdrawal request submitted successfully!');
        setWithdrawalAmount('');
        // Refresh data
        window.location.reload();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Error processing withdrawal:', error);
      alert('Failed to process withdrawal request');
    } finally {
      setProcessingWithdrawal(false);
    }
  };

  // Filter payments
  const filteredPayments = adminData?.payments?.filter(payment => {
    const matchesStatus = filterStatus === 'all' || payment.status === filterStatus;
    const matchesSearch = payment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.message.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  }) || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!adminData || adminData.error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          
          {adminData?.error === 'access_denied' ? (
            <>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h2>
              <p className="text-gray-600 mb-6">
                {adminData.message || 'You do not have access to this admin panel.'}
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> You can only access the admin panel for your own creator page. 
                  If you don't have a page yet, please create one first.
                </p>
              </div>
              <button
                onClick={() => router.push('/create-page')}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors mr-3"
              >
                Create Page
              </button>
              <button
                onClick={() => router.push('/dashboard')}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Go to Dashboard
              </button>
            </>
          ) : (
            <>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Admin Panel Error</h2>
              <p className="text-gray-600 mb-6">
                {adminData?.message || 'Unable to load admin panel. Please try again later.'}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors mr-3"
              >
                Retry
              </button>
              <button
                onClick={() => router.push('/dashboard')}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Go to Dashboard
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'pending':
        return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      case 'failed':
        return 'text-red-700 bg-red-50 border-red-200';
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 space-y-3 sm:space-y-0">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Admin Panel</h1>
              <p className="text-sm text-gray-600">@{adminData.username}</p>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 sm:px-4 rounded-lg text-sm font-medium transition-colors"
              >
                Dashboard
              </button>
              <button
                onClick={() => router.push(`/${adminData.username}`)}
                className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 sm:px-4 rounded-lg text-sm font-medium transition-colors"
              >
                View Page
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6 sm:mb-8">
          <nav className="-mb-px flex space-x-4 sm:space-x-8 overflow-x-auto">
            {['overview', 'payments', 'withdrawals', 'account'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-1 border-b-2 font-medium text-sm capitalize whitespace-nowrap ${
                  activeTab === tab
                    ? 'border-orange-500 text-orange-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Balance Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-600">Available Balance</p>
                    <p className="text-2xl sm:text-3xl font-bold text-green-600 truncate">${adminData.availableBalance.toFixed(2)}</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full flex-shrink-0">
                    <Wallet className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <button
                    onClick={() => setActiveTab('withdrawals')}
                    className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
                  >
                    Withdraw Funds
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                    <p className="text-2xl sm:text-3xl font-bold text-blue-600 truncate">${adminData.totalEarnings.toFixed(2)}</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-full flex-shrink-0">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-2">All time earnings</p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 sm:col-span-2 lg:col-span-1">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-600">Pending Payments</p>
                    <p className="text-2xl sm:text-3xl font-bold text-orange-600">{adminData.pendingCount}</p>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-full flex-shrink-0">
                    <Clock className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-2">Awaiting confirmation</p>
              </div>
            </div>

            {/* Goal Progress */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Current Goal</h3>
                <Target className="h-5 w-5 text-gray-400" />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">{adminData.goal.title}</span>
                  <span className="text-sm font-medium">${adminData.goal.currentAmount} / ${adminData.goal.targetAmount}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-orange-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (adminData.goal.currentAmount / adminData.goal.targetAmount) * 100)}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-500">{adminData.goal.description}</p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {adminData.payments.slice(0, 5).map((payment, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {payment.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{payment.name}</p>
                        <p className="text-xs text-gray-500">{new Date(payment.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-semibold text-gray-900">${payment.amount}</span>
                      {getStatusIcon(payment.status)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Payments Tab */}
        {activeTab === 'payments' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search payments..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="all">All Status</option>
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            </div>

            {/* Payments Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Supporter</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Amount</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Message</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Date</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Transaction ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPayments.map((payment) => (
                      <tr key={payment._id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                              {payment.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{payment.name}</p>
                              <p className="text-xs text-gray-500">{payment.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm font-semibold text-gray-900">${payment.amount}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-gray-600 max-w-xs truncate block">
                            {payment.message || 'No message'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(payment.status)}`}>
                            {getStatusIcon(payment.status)}
                            <span className="ml-1 capitalize">{payment.status}</span>
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-gray-600">
                            {new Date(payment.createdAt).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-xs text-gray-500 font-mono">
                            {payment.trans_id}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Mobile Card View */}
              <div className="lg:hidden">
                <div className="divide-y divide-gray-200">
                  {filteredPayments.map((payment) => (
                    <div key={payment._id} className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-pink-400 rounded-full flex items-center justify-center text-white text-sm font-bold">
                            {payment.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{payment.name}</p>
                            <p className="text-xs text-gray-500">{payment.email}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-semibold text-gray-900">${payment.amount}</p>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(payment.status)}`}>
                            {getStatusIcon(payment.status)}
                            <span className="ml-1 capitalize">{payment.status}</span>
                          </span>
                        </div>
                      </div>
                      {payment.message && (
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-sm text-gray-700">{payment.message}</p>
                        </div>
                      )}
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>{new Date(payment.createdAt).toLocaleDateString()}</span>
                        <span className="font-mono">{payment.trans_id}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {filteredPayments.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No payments found matching your criteria
                </div>
              )}
            </div>
          </div>
        )}

        {/* Withdrawals Tab */}
        {activeTab === 'withdrawals' && (
          <div className="space-y-6">
            {/* Withdrawal Form */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Request Withdrawal</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Available Balance: ${adminData.availableBalance.toFixed(2)}
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <input
                      type="number"
                      placeholder="Enter amount"
                      value={withdrawalAmount}
                      onChange={(e) => setWithdrawalAmount(e.target.value)}
                      max={adminData.availableBalance}
                      min="0.01"
                      step="0.01"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm sm:text-base"
                    />
                  </div>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-yellow-800">
                      Withdrawals typically take 3-5 business days to process. A 5% platform fee will be deducted.
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={handleWithdrawal}
                  disabled={processingWithdrawal || !withdrawalAmount || parseFloat(withdrawalAmount) <= 0}
                  className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base"
                >
                  {processingWithdrawal ? 'Processing...' : 'Request Withdrawal'}
                </button>
              </div>
            </div>

            {/* Withdrawal History Placeholder */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Withdrawal History</h3>
              <div className="text-center py-8 text-gray-500">
                <Download className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No withdrawal history available</p>
                <p className="text-sm">Your withdrawal requests will appear here</p>
              </div>
            </div>
          </div>
        )}

        {/* Account Tab */}
        {activeTab === 'account' && (
          <div className="space-y-6">
            {/* Account Information */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                  <div className="flex items-center">
                    <User className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                    <span className="text-sm text-gray-900 truncate">@{adminData.username}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                    <span className="text-sm text-gray-900 truncate">{adminData.email}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <span className="text-sm text-gray-900 capitalize">{adminData.category}</span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Page Created</label>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                    <span className="text-sm text-gray-900">{new Date(adminData.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Page Settings */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Page Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Page Status</label>
                    <p className="text-sm text-gray-500">Control whether your page is visible to supporters</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    adminData.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {adminData.isActive ? 'Active' : 'Inactive'}
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Goal Progress</label>
                    <p className="text-sm text-gray-500">Current progress towards your goal</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {Math.round((adminData.goal.currentAmount / adminData.goal.targetAmount) * 100)}%
                    </div>
                    <div className="text-xs text-gray-500">
                      ${adminData.goal.currentAmount} / ${adminData.goal.targetAmount}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => router.push('/edit-page')}
                  className="flex items-center justify-center px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Page
                </button>
                <button
                  onClick={() => router.push(`/${adminData.username}`)}
                  className="flex items-center justify-center px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Public Page
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
