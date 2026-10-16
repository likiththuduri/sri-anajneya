import React, { useState, useEffect, useCallback } from 'react';
import { 
  CalendarCheck, Search, Filter, RefreshCw, CheckCircle, XCircle, 
  Clock, Package, Phone, User, MessageSquare, AlertCircle, FileText, Check, ChevronRight
} from 'lucide-react';
import { Booking } from '../types';
import { bookingsApi } from '../api/bookings';
import { useToast } from '../context/ToastContext';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

export const AdminBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [adminNotesInput, setAdminNotesInput] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const { showToast } = useToast();

  const loadBookings = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await bookingsApi.getAdminBookings({
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
        search: searchQuery.trim() || undefined,
        size: 50,
      });
      setBookings(response.content || []);
    } catch (err: any) {
      showToast(err.message || 'Failed to load bookings', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, searchQuery, showToast]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadBookings();
    }, 250);
    return () => clearTimeout(timer);
  }, [loadBookings]);

  const handleStatusUpdate = async (id: number, newStatus: string, notes?: string) => {
    setIsUpdating(true);
    try {
      const updated = await bookingsApi.updateBookingStatus(id, {
        status: newStatus,
        adminNotes: notes !== undefined ? notes : adminNotesInput,
      });
      showToast(`Booking ${updated.bookingReference} updated to ${newStatus}`, 'success');
      setSelectedBooking(null);
      loadBookings();
    } catch (err: any) {
      showToast(err.message || `Failed to update status to ${newStatus}`, 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300">PENDING</span>;
      case 'ACCEPTED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300">ACCEPTED</span>;
      case 'READY_FOR_PICKUP':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-300">READY FOR PICKUP</span>;
      case 'COLLECTED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-300">COLLECTED</span>;
      case 'REJECTED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-300">REJECTED</span>;
      case 'CANCELLED':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700 border border-gray-300">CANCELLED</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-agri-100 text-agri-800 flex items-center justify-center shrink-0">
            <CalendarCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900">Advance Product Bookings</h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Review, accept, and manage customer advance reservations for in-store pickup
            </p>
          </div>
        </div>

        <button
          onClick={() => loadBookings()}
          disabled={isLoading}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-50 transition active:scale-95"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Bookings</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Reference, Customer, or Phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-agri-600 focus:border-agri-600 outline-none"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {['ALL', 'PENDING', 'ACCEPTED', 'READY_FOR_PICKUP', 'COLLECTED', 'REJECTED', 'CANCELLED'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${
                statusFilter === status
                  ? 'bg-agri-700 text-white shadow-xs'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {status.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12">
            <LoadingSpinner message="Loading advance bookings..." />
          </div>
        ) : bookings.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <CalendarCheck className="w-12 h-12 text-gray-300 mx-auto" />
            <h3 className="text-sm font-bold text-gray-700">No Bookings Found</h3>
            <p className="text-xs text-gray-400">
              {statusFilter !== 'ALL' ? `No bookings with status "${statusFilter}"` : 'Customer bookings will appear here.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-200 text-[11px] font-black uppercase text-gray-500 tracking-wider">
                  <th className="py-3 px-4">Booking Ref</th>
                  <th className="py-3 px-4">Customer Details</th>
                  <th className="py-3 px-4">Product &amp; Qty</th>
                  <th className="py-3 px-4">Estimated Total</th>
                  <th className="py-3 px-4">Pickup Preference</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs text-gray-700">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50/60 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-agri-950">
                      {b.bookingReference}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-gray-900">{b.customerName}</div>
                      <div className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3 text-gray-400" />
                        <span>{b.customerMobile}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-gray-900">{b.productName}</div>
                      <div className="text-[11px] text-gray-500">
                        {b.brand} • {b.packSize} • <strong className="text-gray-900">{b.quantity} units</strong>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-black text-gray-900">
                      ₹{Number(b.totalAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3.5 px-4">
                      {b.preferredPickupDate ? (
                        <span className="font-semibold text-gray-800">{b.preferredPickupDate}</span>
                      ) : (
                        <span className="text-gray-400 italic">Not specified</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {getStatusBadge(b.status)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedBooking(b);
                          setAdminNotesInput(b.adminNotes || '');
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-agri-100 text-gray-800 hover:text-agri-900 font-bold transition"
                      >
                        <span>Manage</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Booking Management Drawer / Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[92vh] overflow-y-auto border border-gray-200 p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-agri-700 bg-agri-50 px-2 py-0.5 rounded">
                  Manage Booking
                </span>
                <h3 className="text-lg font-black text-gray-900 mt-1 font-mono">
                  {selectedBooking.bookingReference}
                </h3>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            {/* Current details */}
            <div className="bg-gray-50 rounded-2xl p-4 space-y-3 text-xs border border-gray-200/80">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-gray-500 block">Customer Name:</span>
                  <strong className="text-gray-900 text-sm">{selectedBooking.customerName}</strong>
                </div>
                <div>
                  <span className="text-gray-500 block">Customer Phone:</span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <strong className="text-gray-900">{selectedBooking.customerMobile}</strong>
                    <a
                      href={`https://wa.me/91${selectedBooking.customerMobile.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:text-green-700"
                      title="Chat on WhatsApp"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
                <div>
                  <span className="text-gray-500 block">Product:</span>
                  <strong className="text-gray-900">{selectedBooking.productName}</strong>
                </div>
                <div>
                  <span className="text-gray-500 block">Quantity &amp; Total:</span>
                  <strong className="text-gray-900">{selectedBooking.quantity} x {selectedBooking.packSize} = ₹{Number(selectedBooking.totalAmount).toLocaleString('en-IN')}</strong>
                </div>
                <div>
                  <span className="text-gray-500 block">Current Status:</span>
                  <div className="mt-1">{getStatusBadge(selectedBooking.status)}</div>
                </div>
                <div>
                  <span className="text-gray-500 block">Preferred Pickup:</span>
                  <strong className="text-gray-900">{selectedBooking.preferredPickupDate || 'Not specified'}</strong>
                </div>
              </div>

              {selectedBooking.customerNotes && (
                <div className="border-t border-gray-200/80 pt-2">
                  <span className="text-gray-500 block font-semibold">Customer Notes:</span>
                  <p className="text-gray-700 italic mt-0.5">{selectedBooking.customerNotes}</p>
                </div>
              )}
            </div>

            {/* Internal Admin Notes */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-700">
                Internal Admin Notes (Optional):
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Reserved batch #402, confirmed with customer on call"
                value={adminNotesInput}
                onChange={(e) => setAdminNotesInput(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-agri-600 outline-none"
              />
            </div>

            {/* Status Workflow Action Buttons */}
            <div className="space-y-2 pt-2 border-t border-gray-100">
              <span className="text-xs font-bold text-gray-800 block">Update Status:</span>

              {selectedBooking.status === 'PENDING' && (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    disabled={isUpdating}
                    onClick={() => handleStatusUpdate(selectedBooking.id, 'ACCEPTED')}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition active:scale-95 disabled:opacity-50"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Accept (Reserve Stock)</span>
                  </button>

                  <button
                    disabled={isUpdating}
                    onClick={() => handleStatusUpdate(selectedBooking.id, 'REJECTED')}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs transition active:scale-95 disabled:opacity-50"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Reject Booking</span>
                  </button>
                </div>
              )}

              {selectedBooking.status === 'ACCEPTED' && (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    disabled={isUpdating}
                    onClick={() => handleStatusUpdate(selectedBooking.id, 'READY_FOR_PICKUP')}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition active:scale-95 disabled:opacity-50"
                  >
                    <Package className="w-4 h-4" />
                    <span>Mark Ready for Pickup</span>
                  </button>

                  <button
                    disabled={isUpdating}
                    onClick={() => handleStatusUpdate(selectedBooking.id, 'CANCELLED')}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-gray-600 hover:bg-gray-700 text-white font-bold text-xs transition active:scale-95 disabled:opacity-50"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Cancel (Restore Stock)</span>
                  </button>
                </div>
              )}

              {selectedBooking.status === 'READY_FOR_PICKUP' && (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    disabled={isUpdating}
                    onClick={() => handleStatusUpdate(selectedBooking.id, 'COLLECTED')}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-xs transition active:scale-95 disabled:opacity-50"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Mark Collected</span>
                  </button>

                  <button
                    disabled={isUpdating}
                    onClick={() => handleStatusUpdate(selectedBooking.id, 'CANCELLED')}
                    className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-gray-600 hover:bg-gray-700 text-white font-bold text-xs transition active:scale-95 disabled:opacity-50"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Cancel Booking</span>
                  </button>
                </div>
              )}

              {(selectedBooking.status === 'COLLECTED' || selectedBooking.status === 'CANCELLED' || selectedBooking.status === 'REJECTED') && (
                <div className="p-3 bg-gray-100 rounded-xl text-center text-xs text-gray-500 font-semibold">
                  This booking has reached its final completed state ({selectedBooking.status}).
                </div>
              )}
            </div>

            <div className="pt-2">
              <button
                onClick={() => setSelectedBooking(null)}
                className="w-full py-2 px-4 rounded-xl border border-gray-300 font-bold text-xs text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
