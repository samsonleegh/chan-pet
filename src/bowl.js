// The bowl by the door: one Stripe Payment Link, PayNow and cards, customer chooses the amount.
// The reference id tells Stripe which companion and which placement the visitor came from. No one is tracked.
export const BOWL_URL = "https://donate.stripe.com/aFa8wP10D65q84U9fecQU01";
export function bowlUrl(companionId, placement) {
  if (!BOWL_URL) return null;
  return `${BOWL_URL}?client_reference_id=${companionId}-${placement}`;
}
