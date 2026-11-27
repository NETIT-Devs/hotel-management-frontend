import React, { useEffect, useState } from 'react';
import {
  X,
  Star,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Calendar,
  BedDouble,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import {
  verifyReviewEligibility,
  submitGuestReview,
} from '../services/reviewService';

const RATING_LABELS = {
  1: 'Poor',
  2: 'Fair',
  3: 'Good',
  4: 'Very Good',
  5: 'Exceptional',
};

const CATEGORY_FIELDS = [
  { key: 'cleanliness_rating', label: 'Cleanliness' },
  { key: 'service_rating', label: 'Hospitality & Service' },
  { key: 'location_rating', label: 'Location & Views' },
  { key: 'rooms_rating', label: 'Room Comfort' },
];

const formatStayDate = (val) => {
  if (!val) return '';
  const d = new Date(val);
  if (Number.isNaN(d.getTime())) return String(val).slice(0, 10);
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

/**
 * Interactive 1-5 Star Rating Selector
 */
function StarPicker({ value, onChange, size = 'md' }) {
  const [hovered, setHovered] = useState(0);
  const active = hovered || value;
  const iconClass = size === 'lg' ? 'w-7 h-7 sm:w-8 sm:h-8' : 'w-4 h-4 sm:w-5 sm:h-5';

  return (
    <div className="flex items-center gap-1" onMouseLeave={() => setHovered(0)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onMouseEnter={() => setHovered(star)}
          onClick={() => onChange(star)}
          aria-label={`Rate ${star} out of 5 stars`}
          className="p-0.5 transition-transform hover:scale-110 focus:outline-none cursor-pointer"
        >
          <Star
            className={`${iconClass} transition-colors ${
              star <= active
                ? 'text-[#C9A24B] fill-[#C9A24B]'
                : 'text-gray-300 fill-transparent'
            }`}
          />
        </button>
      ))}
    </div>
  );
}

/**
 * Verified Stay Review Modal
 * - Supports pre-verified booking passed from MyBookingsPage (`initialBooking`)
 * - Or standalone 2-step verification (Booking Reference + Email) when opened from /reviews
 */
export default function ReviewModal({
  isOpen,
  onClose,
  initialBooking = null,
  guestEmail = '',
  onSuccess,
}) {
  const [step, setStep] = useState('verify'); // 'verify' | 'form' | 'success'
  const [verifiedBooking, setVerifiedBooking] = useState(null);

  // Step 1: Verification fields
  const [bookingRef, setBookingRef] = useState('');
  const [verifyEmail, setVerifyEmail] = useState(guestEmail || '');
  const [verifying, setVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState('');

  // Step 2: Review form fields
  const [overallRating, setOverallRating] = useState(5);
  const [categories, setCategories] = useState({
    cleanliness_rating: 0,
    service_rating: 0,
    location_rating: 0,
    rooms_rating: 0,
  });
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [guestCountry, setGuestCountry] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Reset modal state whenever opened or initialBooking changes
  useEffect(() => {
    if (!isOpen) return;

    setVerifyError('');
    setSubmitError('');
    setSuccessMsg('');
    setOverallRating(5);
    setCategories({
      cleanliness_rating: 0,
      service_rating: 0,
      location_rating: 0,
      rooms_rating: 0,
    });
    setTitle('');
    setComment('');
    setGuestCountry('');

    if (initialBooking) {
      setVerifiedBooking({
        id: initialBooking.id,
        room_id: initialBooking.room_id,
        room_name: initialBooking.room_name,
        check_in: initialBooking.check_in,
        check_out: initialBooking.check_out,
        guest_name:
          `${initialBooking.guest_first_name || ''} ${initialBooking.guest_last_name || ''}`.trim() ||
          'Verified Guest',
      });
      setVerifyEmail(initialBooking.guest_email || guestEmail || '');
      setStep('form');
    } else {
      setVerifiedBooking(null);
      setBookingRef('');
      setVerifyEmail(guestEmail || '');
      setStep('verify');
    }
  }, [isOpen, initialBooking, guestEmail]);

  if (!isOpen) return null;

  const isLoggedIn = Boolean(localStorage.getItem('token'));

  const handleVerifyBooking = async (e) => {
    e.preventDefault();
    setVerifyError('');
    setVerifying(true);
    try {
      const data = await verifyReviewEligibility({
        bookingId: bookingRef.trim(),
        email: verifyEmail.trim(),
      });
      setVerifiedBooking(data.booking);
      setStep('form');
    } catch (err) {
      setVerifyError(err.message);
    } finally {
      setVerifying(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setSubmitError('');

    if (overallRating < 1 || overallRating > 5) {
      setSubmitError('Please select an overall star rating.');
      return;
    }
    if (title.trim().length < 3) {
      setSubmitError('Please add a short headline for your review.');
      return;
    }
    if (comment.trim().length < 10) {
      setSubmitError('Please share at least 10 characters about your experience.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        bookingId: verifiedBooking.id,
        email: verifyEmail.trim() || initialBooking?.guest_email || '',
        overall_rating: overallRating,
        cleanliness_rating: categories.cleanliness_rating || null,
        service_rating: categories.service_rating || null,
        location_rating: categories.location_rating || null,
        rooms_rating: categories.rooms_rating || null,
        title: title.trim(),
        comment: comment.trim(),
        guest_country: guestCountry.trim() || null,
      };

      const res = await submitGuestReview(payload);
      setSuccessMsg(
        res.message ||
          'Thank you! Your review has been submitted for approval.'
      );
      setStep('success');
      if (onSuccess) onSuccess(verifiedBooking.id, res);
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#061C2B]/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5"
      role="dialog"
      aria-modal="true"
      aria-labelledby="review-modal-title"
    >
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-[#C9A24B]/30 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="bg-[#061C2B] text-white px-5 py-4 sm:px-7 sm:py-5 flex items-center justify-between shrink-0">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#C9A24B] flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Guest Review
            </span>
            <h2
              id="review-modal-title"
              className="font-serif text-xl sm:text-2xl font-normal mt-0.5"
            >
              {step === 'verify'
                ? 'Verify Your Stay'
                : step === 'success'
                ? 'Thank You for Sharing'
                : 'Share Your Experience'}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close review modal"
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 sm:p-7 overflow-y-auto">
          {/* ================= STEP 1: VERIFY BOOKING ================= */}
          {step === 'verify' && (
            <form onSubmit={handleVerifyBooking} className="space-y-4">
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                To keep our reviews authentic, only guests who have completed a stay at
                Serenity Bay can submit a review. Enter your booking reference below to begin.
              </p>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                  Booking Reference ID *
                </label>
                <input
                  type="text"
                  value={bookingRef}
                  onChange={(e) => setBookingRef(e.target.value)}
                  placeholder="e.g. SBHR-2026-00012"
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#C9A24B]"
                />
              </div>

              {!isLoggedIn && (
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                    Reservation Email Address *
                  </label>
                  <input
                    type="email"
                    value={verifyEmail}
                    onChange={(e) => setVerifyEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#C9A24B]"
                  />
                </div>
              )}

              {verifyError && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl p-3">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{verifyError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={verifying}
                className="w-full bg-gradient-to-r from-[#C9A24B] to-[#b49147] text-[#061C2B] py-3 rounded-xl text-xs font-extrabold uppercase tracking-wider hover:opacity-95 transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{verifying ? 'Verifying Stay...' : 'Verify & Continue'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* ================= STEP 2: REVIEW FORM ================= */}
          {step === 'form' && verifiedBooking && (
            <form onSubmit={handleSubmitReview} className="space-y-5">
              {/* Auto-filled Stay Summary Pill */}
              <div className="bg-[#FAF8F5] border border-[#C9A24B]/30 rounded-2xl p-3.5 sm:p-4 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#061C2B] text-[#C9A24B] flex items-center justify-center shrink-0">
                    <BedDouble className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#061C2B]">
                      {verifiedBooking.room_name}
                    </p>
                    <p className="text-[11px] text-gray-500 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Stayed {formatStayDate(verifiedBooking.check_out || verifiedBooking.check_in)}
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full">
                  <ShieldCheck className="w-3 h-3" />
                  Verified Stay
                </span>
              </div>

              {/* Overall Star Rating */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                    Overall Rating *
                  </label>
                  <span className="text-xs font-semibold text-[#C9A24B]">
                    {RATING_LABELS[overallRating] || ''}
                  </span>
                </div>
                <StarPicker
                  value={overallRating}
                  onChange={setOverallRating}
                  size="lg"
                />
              </div>

              {/* Optional Category Ratings */}
              <div className="bg-gray-50 rounded-2xl p-3.5 sm:p-4 border border-gray-100">
                <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-3">
                  Rate Specific Aspects (Optional)
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {CATEGORY_FIELDS.map(({ key, label }) => (
                    <div
                      key={key}
                      className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-gray-100"
                    >
                      <span className="text-xs font-medium text-gray-700">{label}</span>
                      <StarPicker
                        value={categories[key]}
                        onChange={(val) =>
                          setCategories((prev) => ({ ...prev, [key]: val }))
                        }
                        size="sm"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Headline */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                  Review Headline *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={160}
                  placeholder="e.g. Peaceful coastal escape with unforgettable service"
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#C9A24B]"
                />
              </div>

              {/* Comment */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                  Your Experience *
                </label>
                <textarea
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  maxLength={2000}
                  placeholder="Tell future guests about your suite, dining, views, and staff hospitality..."
                  required
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#C9A24B] resize-none"
                />
              </div>

              {/* Optional Country */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 mb-1.5">
                  Country / Location (Optional)
                </label>
                <input
                  type="text"
                  value={guestCountry}
                  onChange={(e) => setGuestCountry(e.target.value)}
                  maxLength={80}
                  placeholder="e.g. United Kingdom, Colombo"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#C9A24B]"
                />
              </div>

              {submitError && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl p-3">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{submitError}</span>
                </div>
              )}

              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  className="sm:w-1/3 py-3 rounded-xl border border-gray-200 text-xs font-bold uppercase tracking-wider text-gray-600 hover:bg-gray-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="sm:w-2/3 bg-gradient-to-r from-[#C9A24B] to-[#b49147] text-[#061C2B] py-3 rounded-xl text-xs font-extrabold uppercase tracking-wider hover:opacity-95 transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{submitting ? 'Submitting...' : 'Submit Verified Review'}</span>
                </button>
              </div>
            </form>
          )}

          {/* ================= STEP 3: SUCCESS ================= */}
          {step === 'success' && (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <h3 className="font-serif text-2xl text-[#061C2B]">
                Review Submitted
              </h3>
              <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
                {successMsg}
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-2 bg-gradient-to-r from-[#C9A24B] to-[#b49147] text-[#061C2B] px-8 py-3 rounded-xl text-xs font-extrabold uppercase tracking-wider hover:opacity-95 transition shadow-md cursor-pointer"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
