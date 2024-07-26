import { z } from "zod";

const businessProfileSchema = z.object({
  annual_revenue: z.number().nullable(),
  estimated_worker_count: z.number().nullable(),
  mcc: z.string().nullable(),
  name: z.string().nullable(),
  product_description: z.string().nullable(),
  support_address: z.unknown().nullable(),
  support_email: z.string().nullable(),
  support_phone: z.string().nullable(),
  support_url: z.string().nullable(),
  url: z.string().nullable(),
});

const controllerSchema = z.object({
  fees: z.object({
    payer: z.string(),
  }),
  is_controller: z.boolean(),
  losses: z.object({
    payments: z.string(),
  }),
  requirement_collection: z.string(),
  stripe_dashboard: z.object({
    type: z.string(),
  }),
  type: z.string(),
});

const externalAccountsSchema = z.object({
  object: z.literal("list"),
  data: z.array(z.unknown()),
  has_more: z.boolean(),
  total_count: z.number(),
  url: z.string(),
});

const requirementsSchema = z.object({
  alternatives: z.array(z.unknown()),
  current_deadline: z.number().nullable(),
  currently_due: z.array(z.string()),
  disabled_reason: z.string().nullable(),
  errors: z.array(z.unknown()),
  eventually_due: z.array(z.string()),
  past_due: z.array(z.string()),
  pending_verification: z.array(z.unknown()),
});

const settingsSchema = z.object({
  bacs_debit_payments: z.object({
    display_name: z.string().nullable(),
    service_user_number: z.string().nullable(),
  }),
  branding: z.object({
    icon: z.string().nullable(),
    logo: z.string().nullable(),
    primary_color: z.string().nullable(),
    secondary_color: z.string().nullable(),
  }),
  card_issuing: z.object({
    tos_acceptance: z.object({
      date: z.number().nullable(),
      ip: z.string().nullable(),
    }),
  }),
  card_payments: z.object({
    decline_on: z.object({
      avs_failure: z.boolean(),
      cvc_failure: z.boolean(),
    }),
    statement_descriptor_prefix: z.string().nullable(),
    statement_descriptor_prefix_kanji: z.string().nullable(),
    statement_descriptor_prefix_kana: z.string().nullable(),
  }),
  dashboard: z.object({
    display_name: z.string().nullable(),
    timezone: z.string(),
  }),
  invoices: z.object({
    default_account_tax_ids: z.array(z.string()).nullable(),
  }),
  payments: z.object({
    statement_descriptor: z.string().nullable(),
    statement_descriptor_kana: z.string().nullable(),
    statement_descriptor_kanji: z.string().nullable(),
  }),
  payouts: z.object({
    debit_negative_balances: z.boolean(),
    schedule: z.object({
      delay_days: z.number(),
      interval: z.string(),
    }),
    statement_descriptor: z.string().nullable(),
  }),
  sepa_debit_payments: z.record(z.unknown()),
});

const tosAcceptanceSchema = z.object({
  date: z.number().nullable(),
  ip: z.string().nullable(),
  user_agent: z.string().nullable(),
});

export const stripeAccountSchema = z.object({
  id: z.string(),
  object: z.literal("account"),
  business_profile: businessProfileSchema,
  business_type: z.string().nullable(),
  capabilities: z.record(z.unknown()),
  charges_enabled: z.boolean(),
  controller: controllerSchema,
  country: z.string(),
  created: z.number(),
  default_currency: z.string(),
  details_submitted: z.boolean(),
  email: z.string(),
  external_accounts: externalAccountsSchema,
  future_requirements: requirementsSchema,
  login_links: externalAccountsSchema,
  metadata: z.record(z.unknown()),
  payouts_enabled: z.boolean(),
  requirements: requirementsSchema,
  settings: settingsSchema,
  tos_acceptance: tosAcceptanceSchema,
  type: z.string(),
});

export type StripeAccount = z.infer<typeof stripeAccountSchema>;
