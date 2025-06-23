import { loadStripe } from '@stripe/stripe-js';

// IMPORTANTE: Reemplaza esta clave con tu CLAVE PUBLICABLE de Stripe.
const STRIPE_PUBLISHABLE_KEY = 'pk_test_51PefYJRuUCVIfpLcfM8UKnAPkG8tYq4aW4r2y9yYy8o5WvV8zU5Yy7V8y5V8y5V8y5V8y5V8y5V8y5V8y';

if (!STRIPE_PUBLISHABLE_KEY) {
  throw new Error('La clave publicable de Stripe no está configurada. Por favor, añádela en src/lib/stripe.js');
}

export const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);