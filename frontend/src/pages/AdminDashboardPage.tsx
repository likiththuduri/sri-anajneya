import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ShoppingBag, AlertTriangle, Layers, Clock, TrendingUp, Plus, ArrowRight, CheckCircle2 } from 'lucide-react';
import { DashboardSummary } from '../types';
import { settingsApi } from '../api/settings';
import { ordersApi } from '../api/orders';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { useToast } from '../context/ToastContext';

export const AdminDashboardPage: React.FC = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();

  const loadDashboard = async () => {
    try {
      const data = await settingsApi.getDashboardSummary();
      setSummary(data);
    } catch (err: any) {
      console.error('Failed to load dashboard metrics', err);
      showToast(err?.message || 'Failed to load dashboard metrics', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleUpdateStatus = async (orderId: number, newStatus: string) => {
    try {
      await ordersApi.updateOrderStatus(orderId, newStatus);
      showToast(`Order status updated to ${newStatus}`, 'success');
      loadDashboard();
    } catch (err: any) {
      showToast(err?.message || 'Failed to update order status', 'error');
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading store analytics and order metrics..." />;
  }

  const statCards = [
    {
      title: 'Total Inventory Products',
      value: summary?.totalProducts || 0,
      subtext: `${summary?.activeProducts || 0} active in catalog`,
      icon: Package,
      color: 'bg-emerald-500 text-white',
      borderColor: 'border-emerald-200',
    },
    {
      title: 'Out of Stock Items',
      value: summary?.outOfStockProducts || 0,
      subtext: 'Requires immediate reordering',
      icon: AlertTriangle,
      color: 'bg-amber-500 text-white',
      borderColor: 'border-amber-200',
    },
    {
      title: 'Total Customer Orders',
      value: summary?.totalOrders || 0,
      subtext: `${summary?.pendingOrders || 0} pending counter pickup`,
      icon: ShoppingBag,
      color: 'bg-blue-500 text-white',
      borderColor: 'border-blue-200',
    },
    {
      title: 'Total Order Value (₹)',
      value: `₹${(summary?.totalRevenue || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
      subtext: 'Local pickup store sales',
      icon: TrendingUp,
      color: 'bg-agri-700 text-white',
      borderColor: 'border-agri-200',
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-agri-700">
            SRI ANJANEYA FERTILIZERS, PESTICIDES &amp; SEEDS
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mt-0.5">
            Admin Store Dashboard
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Real-time synchronization with centralized MySQL database and Cloudinary image storage.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/products"
            className="inline-flex items-center gap-2 bg-agri-700 hover:bg-agri-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow transition"
          >
            <Plus className="w-4 h-4" />
            <span>Manage Products</span>
          </Link>
          <Link
            to="/admin/orders"
            className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-800 border border-gray-300 text-xs font-bold px-4 py-2.5 rounded-xl shadow-sm transition"
          >
            <ShoppingBag className="w-4 h-4 text-agri-700" />
            <span>View Orders</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className={`bg-white rounded-2xl border ${card.borderColor} p-5 shadow-sm space-y-3`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-500">{card.title}</span>
                <div className={`p-2.5 rounded-xl ${card.color} shadow-sm`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div>
                <div className="text-2xl font-black text-gray-900">{card.value}</div>
                <div className="text-xs text-gray-400 mt-1">{card.subtext}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div>
            <h3 className="font-extrabold text-base text-gray-900">Recent Customer Orders</h3>
            <p className="text-xs text-gray-500">Latest local pickup orders submitted by farmers</p>
          </div>
          <Link
            to="/admin/orders"
            className="text-xs font-bold text-agri-700 hover:text-agri-800 flex items-center gap-1"
          >
            <span>View All Orders</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {summary?.recentOrders && summary.recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-600 font-bold uppercase tracking-wider text-[11px] border-b border-gray-100">
                <tr>
                  <th className="py-3 px-4">Order #</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Mobile</th>
                  <th className="py-3 px-4">Items</th>
                  <th className="py-3 px-4">Total Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Quick Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {summary.recentOrders.slice(0, 5).map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/80 transition">
                    <td className="py-3 px-4 font-mono font-bold text-agri-800">
                      {order.orderNumber}
                    </td>
                    <td className="py-3 px-4 font-bold text-gray-900">
                      {order.customerName}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {order.customerMobile}
                    </td>
                    <td className="py-3 px-4 text-gray-500 max-w-xs truncate">
                      {order.items?.map((it) => `${it.productName} (x${it.quantity})`).join(', ')}
                    </td>
                    <td className="py-3 px-4 font-extrabold text-gray-900">
                      ₹{Number(order.totalAmount).toFixed(2)}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          order.status === 'COMPLETED'
                            ? 'bg-green-100 text-green-800'
                            : order.status === 'CONFIRMED'
                            ? 'bg-blue-100 text-blue-800'
                            : order.status === 'CANCELLED'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      {order.status === 'PENDING' && (
                        <button
                          onClick={() => handleUpdateStatus(order.id, 'CONFIRMED')}
                          className="px-2.5 py-1 rounded-lg bg-agri-50 hover:bg-agri-100 text-agri-800 font-bold text-[11px] border border-agri-200 transition"
                        >
                          Mark Ready
                        </button>
                      )}
                      {order.status === 'CONFIRMED' && (
                        <button
                          onClick={() => handleUpdateStatus(order.id, 'COMPLETED')}
                          className="px-2.5 py-1 rounded-lg bg-green-50 hover:bg-green-100 text-green-800 font-bold text-[11px] border border-green-200 transition"
                        >
                          Collected
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-8 text-center text-gray-400 text-xs">
            No orders recorded yet. As customers book products, orders will appear here.
          </div>
        )}
      </div>
    </div>
  );
};
