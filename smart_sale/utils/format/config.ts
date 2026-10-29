/**
 * Display formatting settings for Smart Sales.
 *
 * These are the business defaults already used across the app (Indian
 * locale, rupees, 3-decimal weights, 2-decimal amounts). Every formatter
 * reads them from here, so change them in one place. No timezone is
 * defined by the business, so date formatters use the device's local time
 * unless a `timeZone` is passed explicitly.
 */
export const APP_LOCALE = "en-IN";
export const APP_CURRENCY = "INR";

export const DECIMALS = {
    /** Gross, net and stone weights in grams. */
    weight: 3,
    /** Pure (fine) weight in grams. */
    pureWeight: 3,
    /** Money amounts. */
    amount: 2,
    /** Metal rates per gram. */
    rate: 2,
    /** Percentages such as touch, wastage and tax. */
    percent: 2,
    /** Piece counts. */
    quantity: 0,
} as const;

/** Display date order used by the app: day-month-year. */
export const DATE_SEPARATOR = "-";
