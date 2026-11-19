import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Calendar,
  Clock,
  Users,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  MapPin,
  ShieldCheck,
  ArrowRight,
  Crown,
} from 'lucide-react';
import { createFacilityReservation } from '../services/facilityService';

/**
 * FacilityBookingModal Component
 * Handles real-world luxury hotel facility bookings in two tailored modes:
 *  1. RESERVABLE (Spa, Fine Dining, Beach Club / Yacht) -> Date, Time Slot, Service & Guests
 *  2. INQUIRY (Weddings, Ballroom, Corporate Events)    -> Event Type, Date, Guest Count & Proposal Request
 *
 * Payment follows authentic 5-star hospitality etiquette: settled at venue or charged to guest suite.
 */
export default function FacilityBookingModal({ facility, onClose }) {
  const navigate = useNavigate();

  const isInquiry = facility?.booking_type === 'INQUIRY';
  const timeSlots = Array.isArray(facility?.time_slots) && facility.time_slots.length > 0
    ? facility.time_slots
    : isInquiry
    ? ['Morning Event', 'Afternoon Reception', 'Evening Gala', 'Full-Day Venue']
    : ['09:00 AM', '11:30 AM', '02:30 PM', '05:00 PM', '07:30 PM'];

  const serviceOptions = Array.isArray(facility?.service_options) ? facility.service_options : [];

  const todayIso = new Date().toISOString().split('T')[0];

  // Form state
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [roomBookingRef, setRoomBookingRef] = useState('');
  const [reservationDate, setReservationDate] = useState(todayIso);
  const [timeSlot, setTimeSlot] = useState(timeSlots[0] || '');
  const [serviceOption, setServiceOption] = useState(serviceOptions[0] || '');
  const [guestsCount, setGuestsCount] = useState(isInquiry ? 40 : 2);
  const [specialRequests, setSpecialRequests] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [confirmedReservation, setConfirmedReservation] = useState(null);

  // Auto-fill guest contact details if signed in
  useEffect(() => {
    try {
      const raw = localStorage.getItem('user');
      if (raw) {
        const user = JSON.parse(raw);
        if (user.fullName || user.full_name) setGuestName(user.fullName || user.full_name);
        if (user.email) setGuestEmail(user.email);
        if (user.phone) setGuestPhone(user.phone);
      }
    } catch {
      // Ignore malformed session storage
    }
  }, []);

  // Lock background page scroll while modal is open & support Escape key close
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onClose]);

  if (!facility) return null;

  const basePrice = Number(facility.base_price) || 0;
  const maxGuests = Number(facility.max_guests) || (isInquiry ? 250 : 10);
  const estimatedTotal = !isInquiry && basePrice > 0 ? basePrice * (Number(guestsCount) || 1) : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const response = await createFacilityReservation({
        facility_id: facility.id,
        guest_name: guestName.trim(),
        guest_email: guestEmail.trim(),
        guest_phone: guestPhone.trim(),
        room_booking_ref: roomBookingRef.trim(),
        reservation_date: reservationDate,
        time_slot: timeSlot,
        service_option: serviceOption,
        guests_count: Number(guestsCount) || 1,
        special_requests: specialRequests.trim(),
      });
      setConfirmedReservation(response.reservation);
    } catch (err) {
      setError(err.message || 'Unable to submit your request right now. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#061C2B]/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="facility-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl border border-[#C9A24B]/40 my-auto max-h-[92vh] flex flex-col">
        {/* ================= MODAL HEADER ================= */}
        <div className="bg-[#063B32] text-white p-5 sm:p-6 flex items-start justify-between gap-4 border-b border-[#C9A24B]/30 shrink-0">
          <div className="flex items-center gap-3.5 min-w-0">
            <img
              src={facility.image || facility.image_url}
              alt={facility.title}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover border border-[#C9A24B]/60 shrink-0 hidden xs:block sm:block"
            />
            <div className="min-w-0">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[0.22em] text-[#C9A24B] mb-1">
                {isInquiry ? (
                  <>
                    <Crown className="w-3 h-3" aria-hidden="true" />
                    EVENT PROPOSAL INQUIRY
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3 h-3" aria-hidden="true" />
                    CONCIERGE RESERVATION
                  </>
                )}
              </span>
              <h2
                id="facility-modal-title"
                className="font-serif text-lg sm:text-2xl font-normal text-white leading-snug truncate"
              >
                {facility.title}
              </h2>
              <p className="text-[11px] text-gray-300 flex items-center gap-2 mt-0.5 flex-wrap">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#C9A24B]" aria-hidden="true" />
                  {facility.location}
                </span>
                <span>·</span>
                <span className="text-[#C9A24B] font-semibold">{facility.price_label}</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close reservation modal"
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* ================= MODAL BODY ================= */}
        <div className="p-5 sm:p-7 overflow-y-auto">
          {confirmedReservation ? (
            /* ---------- SUCCESS RECEIPT VIEW ---------- */
            <div className="text-center py-3 space-y-5">
              <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-[#C9A24B] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 text-[#063B32]" aria-hidden="true" />
              </div>

              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-[0.25em] text-[#C9A24B] block mb-1">
                  {isInquiry ? 'PROPOSAL INQUIRY RECEIVED' : 'RESERVATION REQUEST CONFIRMED'}
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl text-[#063B32] font-semibold">
                  Thank You, {confirmedReservation.guest_name}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 mt-1.5 max-w-md mx-auto leading-relaxed">
                  {isInquiry
                    ? 'Our dedicated Events & Lifestyle Concierge team has received your inquiry and will send a tailored proposal within 24 hours.'
                    : 'Your appointment request has been logged with our concierge desk. No upfront card charge is required—settle at the venue or charge to your suite.'}
                </p>
              </div>

              {/* Reference & Details Card */}
              <div className="bg-[#FAF8F5] rounded-2xl border border-[#C9A24B]/35 p-4 sm:p-5 text-left space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#C9A24B]/20">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                    Reference Code
                  </span>
                  <span className="font-mono text-sm font-extrabold text-[#063B32] bg-[#C9A24B]/20 px-3 py-1 rounded-lg">
                    {confirmedReservation.reference_code}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase tracking-wider">Facility</span>
                    <span className="font-semibold text-[#061C2B]">{facility.title}</span>
                  </div>
                  {confirmedReservation.service_option && (
                    <div>
                      <span className="text-gray-400 block text-[10px] uppercase tracking-wider">
                        {isInquiry ? 'Event Type' : 'Selected Experience'}
                      </span>
                      <span className="font-semibold text-[#061C2B]">
                        {confirmedReservation.service_option}
                      </span>
                    </div>
                  )}
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase tracking-wider">
                      Date &amp; Time
                    </span>
                    <span className="font-semibold text-[#061C2B]">
                      {String(confirmedReservation.reservation_date).slice(0, 10)}
                      {confirmedReservation.time_slot ? ` · ${confirmedReservation.time_slot}` : ''}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px] uppercase tracking-wider">
                      Guests
                    </span>
                    <span className="font-semibold text-[#061C2B]">
                      {confirmedReservation.guests_count}{' '}
                      {Number(confirmedReservation.guests_count) === 1 ? 'Guest' : 'Guests'}
                    </span>
                  </div>
                </div>

                {Number(confirmedReservation.estimated_price) > 0 && (
                  <div className="pt-3 border-t border-[#C9A24B]/20 flex items-center justify-between text-xs">
                    <span className="text-gray-600 font-medium">Estimated Venue Charge (Pay at Venue)</span>
                    <span className="font-serif text-lg font-bold text-[#063B32]">
                      ${Number(confirmedReservation.estimated_price).toFixed(2)}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    navigate('/my-bookings');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto bg-[#063B32] text-[#C9A24B] px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider hover:opacity-95 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>View in My Bookings</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto bg-[#FAF8F5] border border-gray-200 text-[#061C2B] px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-gray-100 transition cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* ---------- RESERVATION / INQUIRY FORM ---------- */
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Service / Treatment / Event Type Selector */}
              {serviceOptions.length > 0 && (
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-[#063B32] mb-2">
                    {isInquiry ? 'Select Event / Service Type' : 'Choose Experience / Package'}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {serviceOptions.map((opt) => {
                      const active = serviceOption === opt;
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setServiceOption(opt)}
                          aria-pressed={active}
                          className={`text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                            active
                              ? 'bg-[#063B32] text-[#C9A24B] border-[#063B32] shadow-sm'
                              : 'bg-[#FAF8F5] text-[#061C2B] border-gray-200 hover:border-[#C9A24B]'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Date + Guests Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="facility-date"
                    className="block text-[11px] font-bold uppercase tracking-widest text-gray-600 mb-1.5"
                  >
                    {isInquiry ? 'Preferred Event Date *' : 'Preferred Date *'}
                  </label>
                  <div className="relative">
                    <Calendar
                      className="w-4 h-4 text-[#C9A24B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                      aria-hidden="true"
                    />
                    <input
                      id="facility-date"
                      type="date"
                      required
                      min={todayIso}
                      value={reservationDate}
                      onChange={(e) => setReservationDate(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-gray-200 rounded-xl pl-10 pr-3 py-2.5 text-xs font-semibold text-[#061C2B] focus:outline-none focus:border-[#C9A24B]"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="facility-guests"
                    className="block text-[11px] font-bold uppercase tracking-widest text-gray-600 mb-1.5"
                  >
                    {isInquiry
                      ? `Expected Guests (Max ${maxGuests}) *`
                      : `Number of Guests (Max ${maxGuests}) *`}
                  </label>
                  <div className="relative">
                    <Users
                      className="w-4 h-4 text-[#C9A24B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                      aria-hidden="true"
                    />
                    <input
                      id="facility-guests"
                      type="number"
                      required
                      min={1}
                      max={maxGuests}
                      value={guestsCount}
                      onChange={(e) => setGuestsCount(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-gray-200 rounded-xl pl-10 pr-3 py-2.5 text-xs font-semibold text-[#061C2B] focus:outline-none focus:border-[#C9A24B]"
                    />
                  </div>
                </div>
              </div>

              {/* Interactive Time Slot Pills */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-widest text-gray-600 mb-2">
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#C9A24B]" aria-hidden="true" />
                    {isInquiry ? 'Preferred Session / Timeframe' : 'Select Preferred Time Slot'}
                  </span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {timeSlots.map((slot) => {
                    const active = timeSlot === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setTimeSlot(slot)}
                        aria-pressed={active}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                          active
                            ? 'bg-[#C9A24B] text-[#063B32] border-[#C9A24B] shadow-sm'
                            : 'bg-[#FAF8F5] text-[#061C2B] border-gray-200 hover:border-[#C9A24B]'
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Guest Contact Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-100">
                <div>
                  <label
                    htmlFor="facility-guest-name"
                    className="block text-[11px] font-bold uppercase tracking-widest text-gray-600 mb-1.5"
                  >
                    Full Name *
                  </label>
                  <input
                    id="facility-guest-name"
                    type="text"
                    required
                    placeholder="e.g. Nimal Perera"
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-[#061C2B] focus:outline-none focus:border-[#C9A24B]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="facility-guest-email"
                    className="block text-[11px] font-bold uppercase tracking-widest text-gray-600 mb-1.5"
                  >
                    Email Address *
                  </label>
                  <input
                    id="facility-guest-email"
                    type="email"
                    required
                    placeholder="guest@example.com"
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-[#061C2B] focus:outline-none focus:border-[#C9A24B]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="facility-guest-phone"
                    className="block text-[11px] font-bold uppercase tracking-widest text-gray-600 mb-1.5"
                  >
                    Phone / WhatsApp *
                  </label>
                  <input
                    id="facility-guest-phone"
                    type="tel"
                    required
                    placeholder="+94 77 123 4567"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-[#061C2B] focus:outline-none focus:border-[#C9A24B]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="facility-room-ref"
                    className="block text-[11px] font-bold uppercase tracking-widest text-gray-600 mb-1.5"
                  >
                    In-House Room / Booking Ref (Optional)
                  </label>
                  <input
                    id="facility-room-ref"
                    type="text"
                    placeholder="e.g. SBHR-2026-00012"
                    value={roomBookingRef}
                    onChange={(e) => setRoomBookingRef(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-[#061C2B] focus:outline-none focus:border-[#C9A24B]"
                  />
                </div>
              </div>

              {/* Special Requests */}
              <div>
                <label
                  htmlFor="facility-notes"
                  className="block text-[11px] font-bold uppercase tracking-widest text-gray-600 mb-1.5"
                >
                  {isInquiry ? 'Event Vision & Special Requirements' : 'Dietary / Special Preferences (Optional)'}
                </label>
                <textarea
                  id="facility-notes"
                  rows={2}
                  placeholder={
                    isInquiry
                      ? 'Share your preferred theme, catering preferences, audio/visual needs, or airport transfer requests...'
                      : 'Allergies, therapist preference, anniversary setup, sunset seating...'
                  }
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-[#061C2B] focus:outline-none focus:border-[#C9A24B]"
                />
              </div>

              {/* Transparent Settlement Strip */}
              <div className="bg-[#FAF8F5] border border-[#C9A24B]/30 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-start sm:items-center gap-2 text-xs text-[#063B32]">
                  <ShieldCheck className="w-4 h-4 text-[#C9A24B] shrink-0 mt-0.5 sm:mt-0" aria-hidden="true" />
                  <span>
                    {isInquiry
                      ? 'No obligation — custom proposal delivered within 24 hours.'
                      : 'No upfront payment required. Settle at venue or charge to your suite.'}
                  </span>
                </div>
                {estimatedTotal > 0 && (
                  <div className="text-left sm:text-right shrink-0">
                    <span className="text-[10px] uppercase tracking-wider text-gray-400 block">
                      Estimated Total
                    </span>
                    <span className="font-serif text-lg font-bold text-[#063B32]">
                      ${estimatedTotal.toFixed(0)}
                    </span>
                  </div>
                )}
              </div>

              {/* Validation / API Error Banner */}
              {error && (
                <div
                  role="alert"
                  className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>{error}</span>
                </div>
              )}

              {/* Submit Actions */}
              <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sm:w-auto bg-gradient-to-r from-[#C9A24B] to-[#b49147] text-[#061C2B] px-6 py-3 rounded-xl text-xs font-extrabold uppercase tracking-wider hover:opacity-95 transition shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  <span>
                    {submitting
                      ? 'Submitting...'
                      : isInquiry
                      ? 'Submit Proposal Inquiry'
                      : 'Confirm Reservation Request'}
                  </span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
