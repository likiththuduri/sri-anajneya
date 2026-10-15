import React, { useEffect, useState } from 'react';
import { ShoppingBag, Search, Phone, MessageSquare, CheckCircle, Clock, XCircle, RefreshCw, Eye } from 'lucide-react';
import { Order } from '../types';
import { ordersApi } from '../api/orders';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { useToast } from '../context/ToastContext';

export const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const { showToast } = useToast();

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const data = await ordersApi.getAdminOrders();
      setOrders(data);
    } catch (err: any) {
      showToast(err?.message || 'Failed to load customer orders', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleUpdateStatus = async (orderId: number, newStatus: string) => {
    try {
      const updated = await ordersApi.updateOrderStatus(orderId, newStatus);
      showToast(`Order ${updated.orderNumber} status changed to ${newStatus}`, 'success');
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(updated);
      }
    } catch (err: any) {
      showToast(err?.message || 'Failed to update order status', 'error');
    }
  };

  const getCustomerWhatsAppUrl = (order: Order) => {
    const text = `Hello ${order.customerName},\nThis is from *SRI ANJANEYA FERTILIZERS, PESTICIDES & SEEDS* regarding your order *${order.orderNumber}* for local pickup. Your items are ready for collection at our store counter.`;
    return `https://wa.me/${order.customerMobile.startsWith('91') ? order.customerMobile : '91' + order.customerMobile}?text=${encodeURIComponent(text)}`;
  };

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;
    const matchesSearch =
      searchFilter === '' ||
      order.orderNumber.toLowerCase().includes(searchFilter.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      order.customerMobile.includes(searchFilter);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            Customer Local Pickup Orders
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Real-time orders submitted by farmers for in-store collection and cash/UPI payment.
          </p>
        </div>

        <button
          onClick={loadOrders}
          className="self-start sm:self-auto p-2.5 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
          title="Refresh orders list"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by order number (SA-...), customer name, mobile..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 text-xs focus:ring-2 focus:ring-agri-500 focus:outline-none"
          />
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 text-xs font-semibold">
          {['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
                statusFilter === st
                  ? 'bg-agri-700 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      {isLoading ? (
        <LoadingSpinner message="Fetching customer orders from MySQL..." />
      ) : (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-600 font-bold uppercase tracking-wider text-[11px] border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4">Order #</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Village / Town</th>
                  <th className="py-3 px-4">Items Count</th>
                  <th className="py-3 px-4">Total (₹)</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/80 transition">
                    <td className="py-3 px-4 font-mono font-bold text-agri-800">
                      {order.orderNumber}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-gray-900">{order.customerName}</div>
                      <a
                        href={`tel:${order.customerMobile}`}
                        className="text-gray-500 hover:text-agri-700 font-medium text-[11px] flex items-center gap-1 mt-0.5"
                      >
                        <Phone className="w-3 h-3 text-agri-600" />
                        <span>{order.customerMobile}</span>
                      </a>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {order.customerVillage || 'Telangana'}
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-700">
                      {order.items?.length || 0} item(s)
                    </td>
                    <td className="py-3 px-4 font-black text-gray-900 text-sm">
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
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          title="View Order Details"
                          className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:text-agri-700 hover:bg-agri-50 transition"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <a
                          href={getCustomerWhatsAppUrl(order)}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Message Farmer on WhatsApp"
                          className="p-1.5 rounded-lg border border-green-200 bg-green-50 text-green-700 hover:bg-green-100 transition"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredOrders.length === 0 && (
              <div className="py-12 text-center text-gray-500 text-xs">
                No orders match your filter criteria.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-agri-700">
                  Local Pickup Slip
                </span>
                <h3 className="text-base font-black text-gray-900">
                  Order {selectedOrder.orderNumber}
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-gray-600 font-bold"
              >
                ✕
              </button>
            </div>

            {/* Customer Details Box */}
            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-1.5 text-xs text-gray-700">
              <div className="flex justify-between">
                <span className="text-gray-500">Customer Name:</span>
                <strong className="text-gray-900">{selectedOrder.customerName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Mobile Number:</span>
                <strong className="text-gray-900">{selectedOrder.customerMobile}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Village / Town:</span>
                <span>{selectedOrder.customerVillage || 'Telangana'}</span>
              </div>
              {selectedOrder.customerNotes && (
                <div className="pt-2 border-t border-gray-200 text-gray-600">
                  <span className="font-bold text-gray-700">Notes: </span>
                  {selectedOrder.customerNotes}
                </div>
              )}
            </div>

            {/* Items */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase text-gray-500">Booked Items:</h4>
              <div className="max-h-48 overflow-y-auto space-y-1 divide-y divide-gray-100 border border-gray-100 rounded-xl p-3">
                {selectedOrder.items?.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-xs pt-1.5 first:pt-0">
                    <div>
                      <span className="font-bold text-gray-900">{item.productName}</span>
                      <span className="text-gray-500 block text-[11px]">
                        Pack: {item.packSize} • Qty: {item.quantity}
                      </span>
                    </div>
                    <span className="font-black text-gray-900">₹{Number(item.subtotal).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-between items-baseline font-black pt-2 border-t border-gray-100">
              <span className="text-sm text-gray-800">Total Amount:</span>
              <span className="text-xl text-agri-950">₹{Number(selectedOrder.totalAmount).toFixed(2)}</span>
            </div>

            {/* Status Modification Buttons */}
            <div className="space-y-2 pt-2">
              <span className="block text-xs font-bold text-gray-500">Update Order Status:</span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleUpdateStatus(selectedOrder.id, 'CONFIRMED')}
                  className={`py-2 rounded-xl font-bold text-xs transition border ${
                    selectedOrder.status === 'CONFIRMED'
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100'
                  }`}
                >
                  Ready for Pickup
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedOrder.id, 'COMPLETED')}
                  className={`py-2 rounded-xl font-bold text-xs transition border ${
                    selectedOrder.status === 'COMPLETED'
                      ? 'bg-green-600 text-white border-green-600'
                      : 'bg-green-50 text-green-800 border-green-200 hover:bg-green-100'
                  }`}
                >
                  Completed
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedOrder.id, 'CANCELLED')}
                  className={`py-2 rounded-xl font-bold text-xs transition border ${
                    selectedOrder.status === 'CANCELLED'
                      ? 'bg-red-600 text-white border-red-600'
                      : 'bg-red-50 text-red-800 border-red-200 hover:bg-red-100'
                  }`}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
