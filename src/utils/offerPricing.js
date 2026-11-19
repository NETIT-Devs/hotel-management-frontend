/**
 * Offer Pricing & Eligibility Utilities
 * Centralizes real-world luxury hotel offer pricing rules across
 * Offers, Live Availability, and Checkout pages.
 */

/**
 * Safely parses a currency string or numeric value (e.g., "$350", "350.00", 350) into a finite number.
 *
 * @param {string|number|null|undefined} value - Raw price input
 * @returns {number} Parsed positive number or 0
 */
export function parsePriceValue(value) {
    if (value === undefined || value === null || value === '') return 0;
    const numeric = Number(String(value).replace(/[^0-9.]/g, ''));
    return Number.isFinite(numeric) ? numeric : 0;
}

/**
 * Extracts a percentage discount value from an offer badge label (e.g., "20% OFF" -> 20).
 *
 * @param {string|null|undefined} discountLabel - Promotional discount label
 * @returns {number|null} Percentage between 1 and 95, or null if not percentage-based
 */
export function extractDiscountPercent(discountLabel) {
    if (!discountLabel) return null;
    const match = String(discountLabel).match(/(\d+(?:\.\d+)?)\s*%/);
    if (!match) return null;
    const pct = Number(match[1]);
    return pct > 0 && pct <= 95 ? pct : null;
}

/**
 * Determines whether a specific room category is eligible for the active special offer.
 * - Room-specific offers (offer.room_id set) apply strictly to that matching room.
 * - Property-wide offers (no room_id assigned) apply across all active room categories.
 *
 * @param {object} room - Live availability room object
 * @param {object|null} offer - Active promotional offer object
 * @returns {boolean} True when the offer applies to the given room
 */
export function isRoomEligibleForOffer(room, offer) {
    if (!room || !offer) return false;
    if (offer.room_id !== undefined && offer.room_id !== null && String(offer.room_id) !== '') {
        return Number(room.id) === Number(offer.room_id);
    }
    return true;
}

/**
 * Computes nightly rate breakdown for a room with Residency and Active Special Offer rules applied.
 *
 * @param {object} params
 * @param {object} params.room - Live availability room object
 * @param {object|null} params.offer - Currently active special offer (if any)
 * @param {boolean} params.isResident - Whether the guest selected Sri Lankan Resident rates
 * @returns {{
 *   isOfferApplied: boolean,
 *   preOfferNightlyRate: number,
 *   finalNightlyRate: number,
 *   perNightSavings: number,
 *   discountLabel: string
 * }}
 */
export function calculateOfferRoomPricing({ room, offer, isResident }) {
    const standardRate = Number(room.price_per_night) || parsePriceValue(room.price) || 280;
    const residentRate =
        Number(room.resident_price_per_night) > 0
            ? Number(room.resident_price_per_night)
            : Math.round(standardRate * 0.75);

    const baseNightlyRate = isResident ? residentRate : standardRate;

    if (!isRoomEligibleForOffer(room, offer)) {
        return {
            isOfferApplied: false,
            preOfferNightlyRate: baseNightlyRate,
            finalNightlyRate: baseNightlyRate,
            perNightSavings: 0,
            discountLabel: ''
        };
    }

    const offerOrig = parsePriceValue(offer.originalPrice || offer.original_price);
    const offerDisc = parsePriceValue(offer.discountedPrice || offer.discounted_price);
    const labelPercent = extractDiscountPercent(offer.discount);

    let finalNightlyRate = baseNightlyRate;

    // 1. Exact room-linked offer with explicit original & discounted prices (Non-Resident)
    const isExactRoomOffer =
        !isResident &&
        offer.room_id &&
        Number(offer.room_id) === Number(room.id) &&
        offerDisc > 0 &&
        offerDisc < baseNightlyRate;

    if (isExactRoomOffer) {
        finalNightlyRate = Math.round(offerDisc);
    } else if (labelPercent !== null) {
        // 2. Apply explicit percentage discount from offer label (e.g., "20% OFF")
        finalNightlyRate = Math.max(1, Math.round(baseNightlyRate * (1 - labelPercent / 100)));
    } else if (offerOrig > 0 && offerDisc > 0 && offerDisc < offerOrig) {
        // 3. Fallback: derive proportional discount ratio from offer original/discounted prices
        const ratio = offerDisc / offerOrig;
        finalNightlyRate = Math.max(1, Math.round(baseNightlyRate * ratio));
    }

    const perNightSavings = Math.max(0, baseNightlyRate - finalNightlyRate);
    const computedPct =
        perNightSavings > 0 ? Math.round((perNightSavings / baseNightlyRate) * 100) : 0;

    return {
        isOfferApplied: perNightSavings > 0,
        preOfferNightlyRate: baseNightlyRate,
        finalNightlyRate,
        perNightSavings,
        discountLabel: offer.discount || (computedPct > 0 ? `${computedPct}% OFF` : 'SPECIAL OFFER')
    };
}

/**
 * Builds the normalized room payload passed via React Router state into CheckoutPage.
 * Preserves live room details while attaching offer discount metadata when eligible.
 *
 * @param {object} params
 * @param {object} params.room - Selected room object
 * @param {object|null} params.offer - Active offer object
 * @param {object} params.pricing - Output of calculateOfferRoomPricing()
 * @returns {object} Normalized room object ready for CheckoutPage
 */
export function buildCheckoutRoomPayload({ room, offer, pricing }) {
    const basePayload = {
        ...room,
        room_id: room.id,
        price: `$${pricing.finalNightlyRate}`,
        price_per_night: pricing.finalNightlyRate
    };

    if (!pricing.isOfferApplied || !offer) {
        return basePayload;
    }

    return {
        ...basePayload,
        originalPrice: `$${pricing.preOfferNightlyRate}`,
        discountedPrice: `$${pricing.finalNightlyRate}`,
        discount: pricing.discountLabel,
        saveAmount: `Save $${pricing.perNightSavings}/night`,
        offerId: offer.id,
        offerTitle: offer.title,
        offerCategory: offer.category || 'Special Offer'
    };
}
