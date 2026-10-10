import { useState, useEffect } from 'react';
import {
  Package, Search, CheckCircle2, Clock, Truck, ShieldCheck,
  AlertCircle, PhoneCall, ArrowRight, ExternalFill as _External,
  QrCode, Calendar, MapPin, Sparkles, RefreshCw, X
} from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { getTagPublicUrl } from '@/lib/tagUtils';

export interface OrderItem {
  id: string;
  order_number: string;
  customer_name: string;
  phone: string;
  email: string;
  shipping_name: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  amount: number;
  payment_status: 'pending' | 'paid' | 'refunded' | 'failed' | string;
  shipping_status: 'processing' | 'shipped' | 'delivered' | 'cancelled' | string;
  notes?: string | null;
  created_at: string;
  tag_id?: string;
  pet_name?: string;
}

interface OrderTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialOrderNumber?: string;
  userId?: string | null;
  userEmail?: string | null;
  onNavigate?: (path: string) => void;
}

export function OrderTrackerModal({
  isOpen,
  onClose,
  initialOrderNumber = '',
  userId,
  userEmail,
  onNavigate,
}: OrderTrackerModalProps) {
  const [searchQuery, setSearchQuery] = useState(initialOrderNumber);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async (queryNumber?: string) => {
    setLoading(true);
    setError(null);
    try {
      let fetched: OrderItem[] = [];

      // 1. Try querying Supabase if configured
      if (isSupabaseConfigured) {
        let q = supabase.from('smart_tag_orders').select('*');
        if (queryNumber && queryNumber.trim()) {
          const cleanNum = queryNumber.trim().toUpperCase();
          q = q.or(`order_number.ilike.%${cleanNum}%,phone.ilike.%${cleanNum}%,email.ilike.%${cleanNum}%`);
        } else if (userId) {
          q = q.eq('user_id', userId);
        } else if (userEmail) {
          q = q.eq('email', userEmail);
        }

        const { data, error: sbError } = await q.order('created_at', { ascending: false });
        if (!sbError && data && data.length > 0) {
          fetched = data as OrderItem[];
        }
      }

      // 2. Read local fallback storage to ensure zero dropped orders
      try {
        const local = JSON.parse(localStorage.getItem('petziq_smart_tag_orders') || '[]') as OrderItem[];
        if (local.length > 0) {
          const existingIds = new Set(fetched.map((o) => o.order_number));
          const localFiltered = local.filter((item) => {
            if (existingIds.has(item.order_number)) return false;
            if (queryNumber && queryNumber.trim()) {
              const clean = queryNumber.trim().toLowerCase();
              return (
                item.order_number.toLowerCase().includes(clean) ||
                item.phone?.toLowerCase().includes(clean) ||
                item.email?.toLowerCase().includes(clean)
              );
            }
            if (userId && item.id) return item.user_id === userId || !item.user_id;
            return true;
          });
          fetched = [...fetched, ...localFiltered];
        }
      } catch {
        // ignore
      }

      setOrders(fetched);
      if (fetched.length > 0) {
        if (queryNumber && queryNumber.trim()) {
          const match = fetched.find((o) => o.order_number.toUpperCase().includes(queryNumber.trim().toUpperCase()));
          setSelectedOrder(match || fetched[0]);
        } else {
          setSelectedOrder(fetched[0]);
        }
      } else {
        setSelectedOrder(null);
        if (queryNumber && queryNumber.trim()) {
          setError(`No order found matching "${queryNumber.trim()}". Please check your order code or phone number.`);
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to search for order');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setSearchQuery(initialOrderNumber);
      fetchOrders(initialOrderNumber);
    }
  }, [isOpen, initialOrderNumber, userId, userEmail]);

  if (!isOpen) return null;

  const getStepProgress = (order: OrderItem) => {
    const isPaid = order.payment_status === 'paid';
    const isShipped = order.shipping_status === 'shipped' || order.shipping_status === 'delivered';
    const isDelivered = order.shipping_status === 'delivered';

    return [
      {
        id: 'ordered',
        title: 'Order Placed',
        desc: 'Details received in our system',
        status: 'completed',
        date: new Date(order.created_at).toLocaleDateString(),
      },
      {
        id: 'payment',
        title: 'Payment Verification',
        desc: isPaid ? 'Payment confirmed by Petziq Admin' : 'Admin will call your phone to complete payment',
        status: isPaid ? 'completed' : 'current',
        badge: isPaid ? 'Verified' : 'Call in progress',
      },
      {
        id: 'engraving',
        title: 'Tag Custom Engraving',
        desc: 'QR code engraved & linked to digital profile',
        status: isDelivered || isShipped ? 'completed' : isPaid ? 'current' : 'upcoming',
      },
      {
        id: 'dispatch',
        title: 'Dispatched & Shipping',
        desc: isDelivered ? 'Out for delivery' : isShipped ? 'In transit to your address' : 'Awaiting courier pickup',
        status: isDelivered ? 'completed' : isShipped ? 'current' : 'upcoming',
      },
      {
        id: 'delivered',
        title: 'Delivered',
        desc: 'Attached to your pet’s collar & ready to safeguard',
        status: isDelivered ? 'completed' : 'upcoming',
      },
    ];
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/85 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl my-8 rounded-3xl border border-white/10 bg-ink-900/95 p-6 sm:p-8 shadow-2xl glass flex flex-col max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full p-2 text-ink-400 hover:bg-white/10 hover:text-ink-100 transition z-10"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 border-b border-white/[0.08] pb-5">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-tr from-brand-500 to-ocean-500 text-white shadow-soft">
            <Truck className="h-6 w-6" />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold text-ink-50">Smart Tag Order Tracker</h2>
            <p className="text-xs text-ink-300 mt-0.5">
              Live tracking for custom Smart Tag orders, payments, and delivery
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-5">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              fetchOrders(searchQuery);
            }}
            className="flex gap-2"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter Order # (e.g. PZO-849201) or Phone Number"
                className="input-field pl-10 text-sm font-mono tracking-wide"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary shrink-0 px-5 text-xs font-semibold flex items-center gap-2"
            >
              {loading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
              Track Order
            </button>
          </form>
        </div>

        {/* Main Content Area */}
        <div className="mt-6 flex-1 overflow-y-auto space-y-6 pr-1">
          {error && (
            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200 flex items-center gap-3">
              <AlertCircle className="h-5 w-5 shrink-0 text-amber-400" />
              <p>{error}</p>
            </div>
          )}

          {selectedOrder ? (
            <div className="space-y-6">
              {/* Top Order Card Overview */}
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-ink-400">Order Number</span>
                    <h3 className="font-mono text-xl font-bold text-ink-50 mt-0.5">{selectedOrder.order_number}</h3>
                    <p className="text-xs text-ink-300 mt-1">{selectedOrder.notes || 'Petziq Smart Tag'}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold uppercase ${
                      selectedOrder.payment_status === 'paid'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    }`}>
                      {selectedOrder.payment_status === 'paid' ? (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Payment: Confirmed (₹{selectedOrder.amount})
                        </>
                      ) : (
                        <>
                          <PhoneCall className="h-3.5 w-3.5 animate-pulse" />
                          Payment: Admin Contacting Client (₹{selectedOrder.amount})
                        </>
                      )}
                    </span>

                    <span className="inline-flex items-center gap-1 rounded-full bg-ocean-500/20 border border-ocean-500/40 px-3 py-1 text-xs font-bold uppercase text-ocean-200">
                      <Truck className="h-3.5 w-3.5" />
                      Status: {selectedOrder.shipping_status}
                    </span>
                  </div>
                </div>

                {/* Important notice for pending payment */}
                {selectedOrder.payment_status !== 'paid' && (
                  <div className="mt-4 rounded-xl border border-brand-500/30 bg-brand-500/10 p-3.5 text-xs text-brand-200 flex items-start gap-3">
                    <PhoneCall className="h-4 w-4 shrink-0 text-brand-300 mt-0.5" />
                    <div>
                      <p className="font-semibold text-brand-100">Payment Process in Progress</p>
                      <p className="text-ink-300 mt-0.5">
                        Our Petziq operations manager will call or message your provided phone number (<span className="font-mono font-bold text-white">{selectedOrder.phone}</span>) to verify details and complete the ₹{selectedOrder.amount} UPI/Card payment. Once completed, your tag goes directly into laser engraving!
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Step Tracking Pipeline */}
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
                <h4 className="font-display text-sm font-semibold text-ink-100 mb-5 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-brand-300" />
                  Live Order Stages
                </h4>

                <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-white/[0.1]">
                  {getStepProgress(selectedOrder).map((step, idx) => {
                    const isDone = step.status === 'completed';
                    const isCurrent = step.status === 'current';
                    return (
                      <div key={step.id} className="relative flex items-start gap-4">
                        <span className={`absolute -left-6 top-0.5 grid h-5 w-5 place-items-center rounded-full text-[10px] font-bold transition-all ${
                          isDone
                            ? 'bg-emerald-500 text-white shadow-glow-emerald ring-2 ring-emerald-500/30'
                            : isCurrent
                            ? 'bg-brand-500 text-white shadow-glow-blue animate-pulse ring-2 ring-brand-500/30'
                            : 'bg-ink-800 text-ink-500 border border-white/10'
                        }`}>
                          {isDone ? '✓' : idx + 1}
                        </span>

                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className={`text-sm font-semibold ${
                              isDone ? 'text-emerald-300' : isCurrent ? 'text-brand-300' : 'text-ink-400'
                            }`}>
                              {step.title}
                            </p>
                            {step.badge && (
                              <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] font-medium text-ink-300">
                                {step.badge}
                              </span>
                            )}
                            {step.date && (
                              <span className="text-[11px] text-ink-400 font-mono">
                                {step.date}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-ink-400 mt-0.5 leading-relaxed">{step.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Delivery & Tag Details */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 text-xs space-y-2">
                  <p className="font-semibold text-ink-200 flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-ocean-300" />
                    Delivery Destination
                  </p>
                  <p className="text-ink-100 font-medium">{selectedOrder.shipping_name || selectedOrder.customer_name}</p>
                  <p className="text-ink-300 leading-relaxed">
                    {selectedOrder.address}, {selectedOrder.city}, {selectedOrder.state} - {selectedOrder.postal_code}
                  </p>
                  <p className="text-ink-400 font-mono">Phone: {selectedOrder.phone}</p>
                </div>

                <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 text-xs space-y-2 flex flex-col justify-between">
                  <div>
                    <p className="font-semibold text-ink-200 flex items-center gap-1.5">
                      <QrCode className="h-3.5 w-3.5 text-brand-300" />
                      Smart Tag Profile Status
                    </p>
                    <p className="text-ink-300 text-xs mt-1 leading-relaxed">
                      Your tag is configured with cloud-synced pet safety data. The QR code links directly to your public pet profile.
                    </p>
                  </div>
                  {selectedOrder.tag_id && (
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        if (onNavigate) onNavigate(`/tag/${selectedOrder.tag_id}`);
                      }}
                      className="inline-flex items-center gap-1.5 text-brand-300 hover:text-brand-200 font-semibold text-xs pt-1 transition"
                    >
                      View Live Tag Profile
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Multiple Orders Selector if available */}
              {orders.length > 1 && (
                <div className="pt-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-ink-400 mb-2">
                    Other Orders On Your Account ({orders.length})
                  </p>
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {orders.map((ord) => (
                      <button
                        key={ord.id}
                        type="button"
                        onClick={() => setSelectedOrder(ord)}
                        className={`rounded-xl border px-3 py-2 text-xs text-left transition shrink-0 ${
                          selectedOrder.order_number === ord.order_number
                            ? 'border-brand-500/50 bg-brand-500/10 text-brand-200'
                            : 'border-white/[0.08] bg-white/[0.02] text-ink-400 hover:text-ink-200'
                        }`}
                      >
                        <p className="font-mono font-bold">{ord.order_number}</p>
                        <p className="text-[10px] text-ink-400 capitalize">{ord.shipping_status}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : !loading && (
            <div className="text-center py-12 space-y-3">
              <Package className="h-12 w-12 text-ink-600 mx-auto" />
              <h3 className="font-display text-base font-semibold text-ink-200">No Orders Found</h3>
              <p className="text-xs text-ink-400 max-w-sm mx-auto">
                Enter your order number or phone number above to trace your Petziq Smart Tag order status.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

