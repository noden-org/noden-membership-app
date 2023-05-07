export type MoonclerkSubscriptionStatus = 'active' | 'canceled' | 'unpaid';

// created from https://github.com/moonclerk/developer/blob/main/api/v1/customers.md
export type MoonclerkCustomer = {
  id: number;
  account_balance: number;
  name: string;
  email: string;
  payment_source?: {
    type: 'card';
    last4: string;
    exp_month: number;
    exp_year: number;
    brand: string;
    bank_name: string;
  };
  card_last4: string;
  card_type: string;
  card_exp_month: number;
  card_exp_year: number;
  custom_id: string;
  customer_reference: string;
  delinquent: boolean;
  management_url: string;
  custom_fields: {
    [name: string]: {
      id: number;
      type: string;
      response: string;
    };
  };
  form_id: number;
  checkout: {
    amount_due: number;
    coupon_amount: number;
    coupon_code?: string;
    date: string;
    fee: number;
    subtotal: number;
    token: string;
    total: number;
    trial_period_days?: number;
    upfront_amount: number;
  };
  subscription: {
    id: number;
    subscription_reference: string;
    status: MoonclerkSubscriptionStatus;
    start: string;
    first_payment_attempt: string;
    next_payment_attempt: string;
    current_period_start: string;
    current_period_end: string;
    trial_start?: string;
    trial_end?: string;
    trial_period_days?: number;
    expires_at?: string;
    canceled_at?: string;
    ended_at?: string;
    plan: {
      id: number;
      plan_reference: string;
      amount: number;
      amount_description: string;
      currency: string;
      interval: string;
      interval_count: number;
    };
  };
};
