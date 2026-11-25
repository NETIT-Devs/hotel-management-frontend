import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Users,
  BedDouble,
  CheckCircle2,
  Clock,
  XCircle,
  User,
  Mail,
  Phone,
  Edit3,
  ShieldCheck,
  Search,
  ArrowRight,
  X,
  FileText,
  CreditCard,
  Sparkles,
  LogIn,
} from 'lucide-react';
import checkoutHeroImg from '../assets/checkoutPageHero.webp';
import {
  fetchMyFacilityReservations,
  cancelMyFacilityReservation,
} from '../services/facilityService';
import { applyPageSEO } from '../utils/seo';
import { evaluateChildPolicy } from '../utils/childPolicy';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const STATUS_META = {
  PENDING: {
    label: 'Awaiting Confirmation',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
    icon: Clock,
  },
  APPROVED: {
    label: 'Confirmed',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    icon: CheckCircle2,
  },
  REJECTED: {
    label: 'Cancelled',
    badgeClass: 'bg-red-100 text-red-700 border-red-200',
    icon: XCircle,
  },
};

const formatRef = (id) => `SBHR-2026-${String(id || 0).padStart(5, '0')}`;

const formatDateLabel = (val) => {
  if (!val) return '—';
  const d = new Date(val);
  if (Number.isNaN(d.getTime())) return String(val).slice(0, 10);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const calcNights = (checkIn, checkOut) => {
  const t1 = new Date(checkIn).getTime();
  const t2 = new Date(checkOut).getTime();
  if (Number.isNaN(t1) || Number.isNaN(t2)) return 1;
  return Math.max(1, Math.round((t2 - t1) / (1000 * 60 * 60 * 24)));
};

export default function MyBookingsPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [bookings, setBookings] = useState(() => {
    const recent = location.state?.recentBooking;
    return recent ? [recent] : [];
  });
  const [loading, setLoading] = useState(Boolean(localStorage.getItem('token')));
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Profile Edit Modal
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    fullName: user?.fullName || user?.full_name || '',
    phone: user?.phone || '',
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState('');

  // Guest Lookup State (when not logged in)
  const [lookupRef, setLookupRef] = useState('');
  const [lookupEmail, setLookupEmail] = useState('');
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState('');

  // Cancel confirmation state
  const [cancelTarget, setCancelTarget] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  // Customer facility reservations & event inquiries state
  const [facilityReservations, setFacilityReservations] = useState([]);
  const [cancellingFacilityId, setCancellingFacilityId] = useState(null);

  const loadAccountData = async () => {
    const activeToken = localStorage.getItem('token');
    setToken(activeToken);
    if (!activeToken) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const [bookingsRes, profileRes, myFacilityList] = await Promise.all([
        fetch(`${API_BASE}/bookings/my-bookings`, {
          headers: { Authorization: `Bearer ${activeToken}` },
        }),
        fetch(`${API_BASE}/auth/profile`, {
          headers: { Authorization: `Bearer ${activeToken}` },
        }),
        fetchMyFacilityReservations().catch(() => []),
      ]);
      setFacilityReservations(myFacilityList);

      const bookingsData = await bookingsRes.json();
      if (bookingsRes.ok && Array.isArray(bookingsData.bookings)) {
        setBookings(bookingsData.bookings);
      } else if (bookingsRes.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
      } else {
        setError(bookingsData.message || 'Could not load your reservations.');
      }

      if (profileRes.ok) {
        const profileData = await profileRes.json();
        if (profileData.user) {
          setUser(profileData.user);
          localStorage.setItem('user', JSON.stringify(profileData.user));
          setProfileForm({
            fullName: profileData.user.fullName || profileData.user.full_name || '',
            phone: profileData.user.phone || '',
          });
        }
      }
    } catch {
      setError('Network error while loading your reservations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    loadAccountData();
    return applyPageSEO({
      title: 'My Bookings & Concierge Reservations',
      description:
        'View and manage your suite reservations, spa appointments, fine dining tables, and event inquiries at Serenity Bay Hotel & Resort.',
      canonicalPath: '/my-bookings',
    });
  }, []);

  // Cancel a customer facility reservation and refresh list
  const handleCancelFacilityReservation = async (reservationId) => {
    setCancellingFacilityId(reservationId);
    try {
      await cancelMyFacilityReservation(reservationId);
      setFacilityReservations((prev) =>
        prev.map((item) =>
          item.id === reservationId ? { ...item, status: 'CANCELLED' } : item
        )
      );
    } catch (err) {
      setError(err.message || 'Unable to cancel facility reservation.');
    } finally {
      setCancellingFacilityId(null);
    }
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    if (!token) return;
    setProfileSaving(true);
    setProfileMsg('');
    try {
      const res = await fetch(`${API_BASE}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update profile');
      setUser(data.user);
      localStorage.setItem('user', JSON.stringify(data.user));
      window.dispatchEvent(new Event('storage'));
      setProfileMsg('Profile updated successfully.');
      setTimeout(() => {
        setIsEditingProfile(false);
        setProfileMsg('');
      }, 900);
    } catch (err) {
      setProfileMsg(err.message);
    } finally {
      setProfileSaving(false);
    }
  };

  const handleLookupBooking = async (e) => {
    e.preventDefault();
    setLookupLoading(true);
    setLookupError('');
    try {
      const params = new URLSearchParams({
        bookingId: lookupRef.trim(),
        email: lookupEmail.trim(),
      });
      const res = await fetch(`${API_BASE}/bookings/lookup?${params.toString()}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Reservation not found.');
      setBookings([data.booking]);
    } catch (err) {
      setLookupError(err.message);
    } finally {
      setLookupLoading(false);
    }
  };

  const handleConfirmCancel = async () => {
    if (!cancelTarget || !token) return;
    setCancelling(true);
    try {
      const res = await fetch(`${API_BASE}/bookings/${cancelTarget.id}/cancel`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to cancel booking');
      setCancelTarget(null);
      await loadAccountData();
    } catch (err) {
      alert(err.message);
    } finally {
      setCancelling(false);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (statusFilter === 'ALL') return true;
    return String(b.status).toUpperCase() === statusFilter;
  });

  const confirmedCount = bookings.filter((b) => b.status === 'APPROVED').length;
  const pendingCount = bookings.filter((b) => b.status === 'PENDING').length;

  const displayName = user?.fullName || user?.full_name || 'Valued Guest';
  const initials = displayName
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <main className="min-h-screen bg-[#F8F5F0] text-[#061C2B] overflow-x-hidden">
      {/* ================= HERO HEADER ================= */}
      <header
        className="relative h-[450px] md:h-[600px] bg-cover bg-center flex flex-col justify-center px-6 pt-20 md:px-12 md:pt-28"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(6, 59, 50, 0.85) 0%, rgba(6, 59, 50, 0.45) 40%, rgba(6, 59, 50, 0.1) 70%, rgba(6, 59, 50, 0) 90%), url(${checkoutHeroImg})`,
        }}
      >
        <div className="max-w-7xl mx-auto w-full text-left animate-[fadeInUp_1s_ease-out]">
          <span className="text-[#C9A24B] tracking-[0.25em] uppercase text-xs font-bold block mb-2">
            SERENITY BAY GUEST PORTAL
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white font-normal mb-3 md:mb-4">
            {token ? (
              <>Welcome back,<br /><span className="italic text-[#C9A24B]">{displayName}</span></>
            ) : (
              <>My <span className="italic text-[#C9A24B]">Reservations</span> &amp; Guest Portal</>
            )}
          </h1>
          <p className="text-gray-200 text-xs sm:text-sm font-light max-w-xl leading-relaxed">
            View your upcoming coastal escapes, check confirmation status, manage guest details, or review your reservation receipts.
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-12 relative z-20 pb-20 space-y-8">
        {/* ================= LOGGED-IN PROFILE & STATS CARD ================= */}
        {token && user ? (
          <section className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-[#C9A24B]/35">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-[#063B32] text-[#C9A24B] font-serif text-2xl font-bold flex items-center justify-center shadow-md border border-[#C9A24B]/40 shrink-0">
                  {initials || <User className="w-7 h-7" />}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="font-serif text-2xl font-semibold text-[#061C2B]">{displayName}</h2>
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-[#063B32]/10 text-[#063B32] border border-[#063B32]/20">
                      Serenity Member
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-600 mt-1.5">
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-[#C9A24B]" /> {user.email}
                    </span>
                    {user.phone && (
                      <span className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-[#C9A24B]" /> {user.phone}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Quick Stats + Actions */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="px-4 py-2.5 rounded-2xl bg-[#FAF8F5] border border-[#C9A24B]/30 text-center min-w-[90px]">
                  <span className="block font-serif text-xl font-bold text-[#061C2B]">{bookings.length}</span>
                  <span className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Total Stays</span>
                </div>
                <div className="px-4 py-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center min-w-[90px]">
                  <span className="block font-serif text-xl font-bold text-emerald-800">{confirmedCount}</span>
                  <span className="text-[10px] uppercase tracking-wider text-emerald-700 font-semibold">Confirmed</span>
                </div>
                <div className="px-4 py-2.5 rounded-2xl bg-amber-50 border border-amber-200 text-center min-w-[90px]">
                  <span className="block font-serif text-xl font-bold text-amber-800">{pendingCount}</span>
                  <span className="text-[10px] uppercase tracking-wider text-amber-700 font-semibold">Pending</span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsEditingProfile(true)}
                  className="px-4 py-3 rounded-xl border border-[#C9A24B] text-[#063B32] hover:bg-[#FAF8F5] text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5 text-[#C9A24B]" />
                  <span>Edit Profile</span>
                </button>

                <Link
                  to="/availability"
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#C9A24B] to-[#b49147] text-[#061C2B] text-xs font-extrabold uppercase tracking-wider hover:opacity-95 transition shadow-md flex items-center gap-1.5"
                >
                  <span>New Booking</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </section>
        ) : (
          /* ================= GUEST LOOKUP / SIGN IN BANNER ================= */
          <section className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-[#C9A24B]/35">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#C9A24B] block mb-1">
                  TRACK RESERVATION
                </span>
                <h2 className="font-serif text-2xl font-semibold text-[#061C2B] mb-2">
                  Find Your Booking
                </h2>
                <p className="text-xs text-gray-600 leading-relaxed mb-4">
                  Booked without signing in? Enter your Booking Reference and email below, or sign in to view your full stay history and profile.
                </p>
                <Link
                  to="/auth"
                  className="inline-flex items-center gap-2 bg-[#063B32] text-[#C9A24B] px-5 py-2.5 rounded-xl text-xs font-bold hover:opacity-95 transition shadow-sm"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In to My Account</span>
                </Link>
              </div>

              <form onSubmit={handleLookupBooking} className="lg:col-span-7 bg-[#FAF8F5] p-5 rounded-2xl border border-[#C9A24B]/25">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                      Booking Reference *
                    </label>
                    <input
                      type="text"
                      value={lookupRef}
                      onChange={(e) => setLookupRef(e.target.value)}
                      placeholder="e.g. SBHR-2026-00012"
                      required
                      className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#C9A24B]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                      Guest Email *
                    </label>
                    <input
                      type="email"
                      value={lookupEmail}
                      onChange={(e) => setLookupEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#C9A24B]"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={lookupLoading}
                    className="bg-gradient-to-r from-[#C9A24B] to-[#b49147] text-[#061C2B] py-2.5 px-4 rounded-xl text-xs font-extrabold uppercase tracking-wider hover:opacity-95 transition shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Search className="w-4 h-4" />
                    <span>{lookupLoading ? 'Searching...' : 'Find Booking'}</span>
                  </button>
                </div>
                {lookupError && (
                  <p className="text-xs text-red-600 mt-2 font-medium">{lookupError}</p>
                )}
              </form>
            </div>
          </section>
        )}

        {/* ================= RESERVATIONS LIST ================= */}
        <section className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-serif text-2xl font-semibold text-[#063B32]">
                Your Reservations
              </h2>
              <p className="text-xs text-gray-500">
                Real-time status updates from Serenity Bay Reservations Desk
              </p>
            </div>

            {bookings.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                {[
                  { key: 'ALL', label: 'All' },
                  { key: 'PENDING', label: 'Pending' },
                  { key: 'APPROVED', label: 'Confirmed' },
                  { key: 'REJECTED', label: 'Cancelled' },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setStatusFilter(tab.key)}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition cursor-pointer ${statusFilter === tab.key
                        ? 'bg-[#063B32] text-[#C9A24B] shadow-sm'
                        : 'bg-white text-gray-600 border border-gray-200 hover:border-[#C9A24B]'
                      }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl text-xs font-medium">
              {error}
            </div>
          )}

          {loading ? (
            <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-[#C9A24B]/25">
              <p className="text-sm text-gray-500">Loading your reservations...</p>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-[#C9A24B]/25">
              <Sparkles className="w-10 h-10 text-[#C9A24B] mx-auto mb-3" />
              <h3 className="font-serif text-xl font-semibold text-[#061C2B] mb-2">
                No Reservations Found
              </h3>
              <p className="text-xs text-gray-500 max-w-md mx-auto mb-6">
                {bookings.length > 0
                  ? 'No bookings match the selected status filter.'
                  : 'You have not placed any reservations yet. Explore our oceanfront suites and private pool villas to plan your stay.'}
              </p>
              <Link
                to="/rooms"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#C9A24B] to-[#b49147] text-[#061C2B] px-6 py-3 rounded-xl text-xs font-extrabold uppercase tracking-wider shadow-md"
              >
                <span>Explore Rooms &amp; Suites</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-5">
              {filteredBookings.map((b) => {
                const meta = STATUS_META[b.status] || STATUS_META.PENDING;
                const StatusIcon = meta.icon;
                const nights = calcNights(b.check_in, b.check_out);
                const canCancel = token && (b.status === 'PENDING' || b.status === 'APPROVED');

                return (
                  <article
                    key={b.id}
                    className="bg-white rounded-3xl overflow-hidden shadow-md border border-[#C9A24B]/30 grid grid-cols-1 lg:grid-cols-12 hover:shadow-xl transition"
                  >
                    {/* Room Thumbnail */}
                    <div className="lg:col-span-3 relative min-h-[200px] bg-gray-100">
                      <img
                        src={b.image_url || checkoutHeroImg}
                        alt={b.room_name}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-3 left-3 bg-[#061C2B]/85 text-[#C9A24B] text-[10px] font-bold tracking-wider px-3 py-1 rounded-full">
                        {formatRef(b.id)}
                      </span>
                    </div>

                    {/* Booking Summary */}
                    <div className="lg:col-span-6 p-6 flex flex-col justify-between">
                      <div>
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                          <h3 className="font-serif text-2xl font-semibold text-[#061C2B]">
                            {b.room_name}
                          </h3>
                          <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-full border ${meta.badgeClass}`}>
                            <StatusIcon className="w-3.5 h-3.5" />
                            {meta.label}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 py-3 border-y border-gray-100 my-3 text-xs">
                          <div>
                            <span className="text-[10px] uppercase tracking-wider text-gray-400 block">Check-In</span>
                            <span className="font-semibold text-[#061C2B] flex items-center gap-1 mt-0.5">
                              <Calendar className="w-3.5 h-3.5 text-[#C9A24B]" />
                              {formatDateLabel(b.check_in)}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase tracking-wider text-gray-400 block">Check-Out</span>
                            <span className="font-semibold text-[#061C2B] flex items-center gap-1 mt-0.5">
                              <Calendar className="w-3.5 h-3.5 text-[#C9A24B]" />
                              {formatDateLabel(b.check_out)}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase tracking-wider text-gray-400 block">Stay &amp; Guests</span>
                            <span className="font-semibold text-[#061C2B] flex items-center gap-1 mt-0.5">
                              <Users className="w-3.5 h-3.5 text-[#C9A24B]" />
                              {nights}N · {b.rooms_count || 1}R · {b.guests || 2}G
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-600">
                          <span className="bg-[#FAF8F5] px-2.5 py-1 rounded-lg border border-[#C9A24B]/25 font-medium">
                            {b.residency || 'Non-Resident'}
                          </span>
                          <span className="bg-[#FAF8F5] px-2.5 py-1 rounded-lg border border-[#C9A24B]/25 font-medium flex items-center gap-1">
                            <CreditCard className="w-3 h-3 text-[#C9A24B]" />
                            {b.payment_method === 'ONLINE' ? 'Online Payment' : 'Pay at Hotel'}
                          </span>
                          {b.child_ages && (() => {
                            const cp = evaluateChildPolicy({ childAges: b.child_ages, nights, residency: b.residency });
                            if (!cp.agesDisplay) return null;
                            return (
                              <span className="bg-emerald-50 text-[#063B32] px-2.5 py-1 rounded-lg border border-emerald-200 font-semibold">
                                Children ({cp.agesDisplay}){cp.housekeepingSummary ? ` · ${cp.housekeepingSummary}` : ''}
                              </span>
                            );
                          })()}
                          {b.admin_note && (
                            <span className="text-amber-700 font-medium">Note: {b.admin_note}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Price & Actions */}
                    <div className="lg:col-span-3 bg-[#FAF8F5] p-6 border-t lg:border-t-0 lg:border-l border-[#C9A24B]/25 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 block">
                          Total Reservation Amount
                        </span>
                        <span className="font-serif text-3xl font-bold text-[#063B32] block mt-1">
                          ${Number(b.total_price || 0).toLocaleString()}
                        </span>
                        <span className="text-[10px] text-emerald-700 font-medium flex items-center gap-1 mt-1">
                          <ShieldCheck className="w-3 h-3 text-[#C9A24B]" /> Best Rate Guaranteed
                        </span>
                      </div>

                      <div className="mt-5 flex flex-col gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedBooking(b)}
                          className="w-full bg-[#063B32] text-[#C9A24B] py-2.5 px-4 rounded-xl text-xs font-bold hover:opacity-95 transition flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>View Receipt &amp; Details</span>
                        </button>

                        {canCancel && (
                          <button
                            type="button"
                            onClick={() => setCancelTarget(b)}
                            className="w-full bg-white text-red-600 border border-red-200 py-2 px-4 rounded-xl text-xs font-bold hover:bg-red-50 transition cursor-pointer"
                          >
                            Cancel Reservation
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* ================= FACILITY RESERVATIONS & EVENT INQUIRIES ================= */}
        {token && (
          <section className="space-y-4 pt-2" aria-label="Facility Reservations and Event Inquiries">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-[#063B32]">
                  Spa, Dining &amp; Concierge Requests
                </h2>
                <p className="text-xs text-gray-500 font-light">
                  Track your spa appointments, fine dining tables, yacht charters, and bespoke event proposals.
                </p>
              </div>
              <Link
                to="/facilities"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C9A24B] hover:underline self-start sm:self-center"
              >
                <span>Explore Resort Facilities</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </div>

            {facilityReservations.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 text-center border border-[#C9A24B]/25 shadow-sm">
                <Sparkles className="w-7 h-7 text-[#C9A24B] mx-auto mb-2" aria-hidden="true" />
                <p className="font-serif text-lg text-[#063B32] mb-1">
                  No Facility Reservations Yet
                </p>
                <p className="text-xs text-gray-500 mb-4 max-w-md mx-auto">
                  Reserve an Ayurveda spa session, sunset dining table, or private yacht charter directly from our Facilities page.
                </p>
                <Link
                  to="/facilities"
                  className="inline-flex items-center gap-2 bg-[#063B32] text-[#C9A24B] px-5 py-2.5 rounded-xl text-xs font-bold hover:opacity-95 transition"
                >
                  <span>Browse Facilities</span>
                  <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {facilityReservations.map((fr) => {
                  const statusTone =
                    fr.status === 'CONFIRMED'
                      ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                      : fr.status === 'COMPLETED'
                        ? 'bg-blue-100 text-blue-800 border-blue-200'
                        : fr.status === 'CANCELLED'
                          ? 'bg-red-100 text-red-700 border-red-200'
                          : 'bg-amber-100 text-amber-800 border-amber-200';
                  const canCancelFacility = fr.status === 'PENDING' || fr.status === 'CONFIRMED';

                  return (
                    <article
                      key={fr.id}
                      className="bg-white rounded-3xl overflow-hidden border border-[#C9A24B]/30 shadow-md flex flex-col justify-between"
                    >
                      <div className="p-5 sm:p-6 space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="font-mono text-[11px] font-extrabold text-[#063B32] bg-[#FAF8F5] border border-[#C9A24B]/35 px-2.5 py-1 rounded-lg">
                            {fr.reference_code}
                          </span>
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${statusTone}`}
                          >
                            {fr.status}
                          </span>
                        </div>

                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-[#C9A24B] block">
                            {fr.request_type === 'INQUIRY' ? 'EVENT PROPOSAL INQUIRY' : fr.facility_category}
                          </span>
                          <h3 className="font-serif text-xl font-semibold text-[#063B32] leading-snug">
                            {fr.facility_title}
                          </h3>
                          {fr.service_option && (
                            <p className="text-xs text-gray-600 font-medium mt-0.5">{fr.service_option}</p>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100 text-xs">
                          <div>
                            <span className="text-[10px] uppercase tracking-wider text-gray-400 block">Date</span>
                            <span className="font-semibold text-[#061C2B]">
                              {formatDateLabel(fr.reservation_date)}
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase tracking-wider text-gray-400 block">
                              Time / Guests
                            </span>
                            <span className="font-semibold text-[#061C2B]">
                              {fr.time_slot || 'Concierge Scheduled'} · {fr.guests_count}G
                            </span>
                          </div>
                        </div>

                        {fr.admin_notes && (
                          <div className="bg-[#FAF8F5] border border-[#C9A24B]/25 rounded-xl px-3 py-2 text-[11px] text-[#063B32]">
                            <span className="font-bold">Concierge Note:</span> {fr.admin_notes}
                          </div>
                        )}
                      </div>

                      <div className="px-5 sm:px-6 py-3.5 bg-[#FAF8F5] border-t border-[#C9A24B]/20 flex items-center justify-between gap-3">
                        <span className="text-xs font-bold text-[#063B32]">
                          {Number(fr.estimated_price) > 0
                            ? `Est. $${Number(fr.estimated_price).toFixed(0)} (Pay at Venue)`
                            : 'Custom Concierge Quote'}
                        </span>
                        {canCancelFacility && (
                          <button
                            type="button"
                            disabled={cancellingFacilityId === fr.id}
                            onClick={() => handleCancelFacilityReservation(fr.id)}
                            className="text-xs font-bold text-red-600 hover:underline cursor-pointer disabled:opacity-50"
                          >
                            {cancellingFacilityId === fr.id ? 'Cancelling...' : 'Cancel Request'}
                          </button>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        )}
      </div>

      {/* ================= BOOKING RECEIPT / DETAILS MODAL ================= */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-[#FAF8F5] rounded-3xl overflow-hidden shadow-2xl border border-[#C9A24B]/40 p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setSelectedBooking(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-[#061C2B] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C9A24B] block mb-1">
              RESERVATION RECEIPT
            </span>
            <h3 className="font-serif text-2xl font-semibold text-[#063B32] mb-1">
              {selectedBooking.room_name}
            </h3>
            <p className="text-xs text-gray-500 mb-5">
              Reference: <strong className="text-[#061C2B]">{formatRef(selectedBooking.id)}</strong>
            </p>

            <div className="bg-white rounded-2xl p-5 border border-[#e5dfd4] space-y-2.5 text-xs">
              <div className="flex justify-between"><span className="text-gray-500">Status:</span> <strong className="text-[#063B32]">{(STATUS_META[selectedBooking.status] || STATUS_META.PENDING).label}</strong></div>
              <div className="flex justify-between"><span className="text-gray-500">Guest:</span> <span className="font-semibold">{`${selectedBooking.guest_first_name || ''} ${selectedBooking.guest_last_name || ''}`.trim() || displayName}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Email:</span> <span>{selectedBooking.guest_email || user?.email || '—'}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Phone:</span> <span>{selectedBooking.guest_phone || user?.phone || '—'}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Residency:</span> <span>{selectedBooking.residency || 'Non-Resident'}</span></div>
              {selectedBooking.guest_id_number && (
                <div className="flex justify-between"><span className="text-gray-500">ID / Passport:</span> <span>{selectedBooking.guest_id_number}</span></div>
              )}
              <div className="border-t border-gray-100 my-2 pt-2 flex justify-between"><span className="text-gray-500">Check-In:</span> <span className="font-semibold">{formatDateLabel(selectedBooking.check_in)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Check-Out:</span> <span className="font-semibold">{formatDateLabel(selectedBooking.check_out)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Rooms &amp; Guests:</span> <span>{selectedBooking.rooms_count || 1} Room(s) · {selectedBooking.guests || 2} Guest(s)</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Payment Method:</span> <span>{selectedBooking.payment_method === 'ONLINE' ? 'Online Payment' : 'Pay at Hotel'}</span></div>
              {selectedBooking.special_requests && (
                <div className="border-t border-gray-100 pt-2">
                  <span className="text-gray-500 block mb-1">Special Requests:</span>
                  <p className="text-[#061C2B] bg-[#FAF8F5] p-2.5 rounded-lg">{selectedBooking.special_requests}</p>
                </div>
              )}
              <div className="border-t border-gray-200 pt-3 flex justify-between items-baseline">
                <span className="font-bold text-[#061C2B]">Total Amount:</span>
                <span className="font-serif text-2xl font-bold text-[#C9A24B]">${Number(selectedBooking.total_price || 0).toLocaleString()}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedBooking(null)}
              className="w-full mt-5 bg-[#C9A24B] text-[#061C2B] py-3 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              Close Receipt
            </button>
          </div>
        </div>
      )}

      {/* ================= EDIT PROFILE MODAL ================= */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-[#C9A24B]/30">
            <button
              type="button"
              onClick={() => setIsEditingProfile(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-[#061C2B] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-serif text-2xl font-semibold text-[#063B32] mb-1">
              Update Guest Profile
            </h3>
            <p className="text-xs text-gray-500 mb-5">
              Keep your contact details up to date for faster check-in.
            </p>

            <form onSubmit={handleProfileSave} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase text-gray-500 mb-1">Full Name *</label>
                <input
                  type="text"
                  value={profileForm.fullName}
                  onChange={(e) => setProfileForm((p) => ({ ...p, fullName: e.target.value }))}
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#C9A24B]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase text-gray-500 mb-1">Phone Number</label>
                <input
                  type="text"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm((p) => ({ ...p, phone: e.target.value }))}
                  placeholder="+94 77 123 4567"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#C9A24B]"
                />
              </div>

              {profileMsg && (
                <p className="text-xs font-semibold text-[#063B32]">{profileMsg}</p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={profileSaving}
                  className="flex-1 py-2.5 rounded-xl bg-[#063B32] text-[#C9A24B] text-xs font-bold cursor-pointer"
                >
                  {profileSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= CANCEL CONFIRMATION MODAL ================= */}
      {cancelTarget && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 text-center shadow-2xl border border-red-100">
            <XCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
            <h3 className="font-serif text-xl font-semibold text-[#061C2B] mb-2">
              Cancel Reservation?
            </h3>
            <p className="text-xs text-gray-600 mb-5">
              Are you sure you want to cancel <strong>{cancelTarget.room_name}</strong> ({formatRef(cancelTarget.id)})?
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setCancelTarget(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-bold cursor-pointer"
              >
                Keep Stay
              </button>
              <button
                type="button"
                disabled={cancelling}
                onClick={handleConfirmCancel}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-xs font-bold cursor-pointer"
              >
                {cancelling ? 'Cancelling...' : 'Yes, Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </main>
  );
}
