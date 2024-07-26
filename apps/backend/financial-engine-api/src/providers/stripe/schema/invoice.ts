import { z } from "zod";

const addressSchema = z.object({
  city: z.string().nullable(),
  country: z.string().nullable(),
  line1: z.string().nullable(),
  line2: z.string().nullable(),
  postal_code: z.string().nullable(),
  state: z.string().nullable(),
});

export const invoiceSchema = z.object({
  id: z.string(),
  object: z.literal("invoice"),
  account_country: z.string(),
  account_name: z.string().nullable(),
  account_tax_ids: z.array(z.string()).nullable(),
  amount_due: z.number().int(),
  amount_paid: z.number().int(),
  amount_remaining: z.number().int(),
  application_fee_amount: z.number().int().nullable(),
  attempt_count: z.number().int(),
  attempted: z.boolean(),
  auto_advance: z.boolean(),
  billing_reason: z.enum([
    "automatic_pending_invoice_item_invoice",
    "manual",
    "quote_accept",
    "subscription",
    "subscription_create",
    "subscription_cycle",
    "subscription_threshold",
    "subscription_update",
    "upcoming",
  ]),
  charge: z.string().nullable(),
  collection_method: z.enum(["charge_automatically", "send_invoice"]),
  created: z.number().int(),
  currency: z.string().length(3),
  custom_fields: z
    .array(
      z.object({
        name: z.string(),
        value: z.string(),
      }),
    )
    .nullable(),
  customer: z.string(),
  customer_address: addressSchema.nullable(),
  customer_email: z.string().email().nullable(),
  customer_name: z.string().nullable(),
  customer_phone: z.string().nullable(),
  customer_shipping: z
    .object({
      address: addressSchema,
      name: z.string(),
      phone: z.string().nullable(),
    })
    .nullable(),
  customer_tax_exempt: z.enum(["exempt", "none", "reverse"]),
  customer_tax_ids: z.array(
    z.object({
      type: z.string(),
      value: z.string(),
    }),
  ),
  default_payment_method: z.string().nullable(),
  default_source: z.string().nullable(),
  default_tax_rates: z.array(
    z.object({
      id: z.string(),
      object: z.literal("tax_rate"),
      active: z.boolean(),
      country: z.string().nullable(),
      created: z.number().int(),
      description: z.string().nullable(),
      display_name: z.string(),
      inclusive: z.boolean(),
      jurisdiction: z.string().nullable(),
      livemode: z.boolean(),
      metadata: z.record(z.string()),
      percentage: z.number(),
      state: z.string().nullable(),
      tax_type: z.string().nullable(),
    }),
  ),
  description: z.string().nullable(),
  discount: z.unknown().nullable(), // You might want to define a more specific schema for discount
  discounts: z.array(z.unknown()).nullable(), // You might want to define a more specific schema for discounts
  due_date: z.number().int().nullable(),
  ending_balance: z.number().int().nullable(),
  footer: z.string().nullable(),
  hosted_invoice_url: z.string().url().nullable(),
  invoice_pdf: z.string().url().nullable(),
  last_finalization_error: z
    .object({
      code: z.string(),
      doc_url: z.string().url(),
      message: z.string(),
      param: z.string().nullable(),
      type: z.string(),
    })
    .nullable(),
  lines: z.object({
    object: z.literal("list"),
    data: z.array(
      z.object({
        id: z.string(),
        object: z.literal("line_item"),
        amount: z.number().int(),
        currency: z.string().length(3),
        description: z.string().nullable(),
        discount_amounts: z.array(z.unknown()).nullable(), // You might want to define a more specific schema
        discountable: z.boolean(),
        discounts: z.array(z.unknown()).nullable(), // You might want to define a more specific schema
        livemode: z.boolean(),
        metadata: z.record(z.string()),
        period: z.object({
          end: z.number().int(),
          start: z.number().int(),
        }),
        plan: z.unknown().nullable(), // You might want to define a more specific schema for plan
        price: z.unknown().nullable(), // You might want to define a more specific schema for price
        proration: z.boolean(),
        quantity: z.number().int().nullable(),
        subscription: z.string().nullable(),
        subscription_item: z.string().nullable(),
        tax_amounts: z.array(
          z.object({
            amount: z.number().int(),
            inclusive: z.boolean(),
            tax_rate: z.string(),
          }),
        ),
        tax_rates: z.array(z.unknown()), // You might want to define a more specific schema for tax_rates
        type: z.enum(["invoiceitem", "subscription"]),
      }),
    ),
    has_more: z.boolean(),
    url: z.string().url(),
  }),
  livemode: z.boolean(),
  metadata: z.record(z.string()),
  next_payment_attempt: z.number().int().nullable(),
  number: z.string(),
  on_behalf_of: z.string().nullable(),
  paid: z.boolean(),
  payment_intent: z.string().nullable(),
  payment_settings: z.object({
    payment_method_options: z.unknown().nullable(), // You might want to define a more specific schema
    payment_method_types: z.array(z.string()).nullable(),
  }),
  period_end: z.number().int(),
  period_start: z.number().int(),
  post_payment_credit_notes_amount: z.number().int(),
  pre_payment_credit_notes_amount: z.number().int(),
  receipt_number: z.string().nullable(),
  starting_balance: z.number().int(),
  statement_descriptor: z.string().nullable(),
  status: z.enum(["draft", "open", "paid", "uncollectible", "void"]),
  status_transitions: z.object({
    finalized_at: z.number().int().nullable(),
    marked_uncollectible_at: z.number().int().nullable(),
    paid_at: z.number().int().nullable(),
    voided_at: z.number().int().nullable(),
  }),
  subscription: z.string().nullable(),
  subtotal: z.number().int(),
  tax: z.number().int().nullable(),
  total: z.number().int(),
  total_discount_amounts: z
    .array(
      z.object({
        amount: z.number().int(),
        discount: z.string(),
      }),
    )
    .nullable(),
  total_tax_amounts: z.array(
    z.object({
      amount: z.number().int(),
      inclusive: z.boolean(),
      tax_rate: z.string(),
    }),
  ),
  transfer_data: z
    .object({
      amount: z.number().int().nullable(),
      destination: z.string(),
    })
    .nullable(),
  webhooks_delivered_at: z.number().int().nullable(),
});

// const rawData = // ... data from API or database
// const parseResult = invoiceSchema.safeParse(rawData);

// if (parseResult.success) {
//     const invoice: Invoice = parseResult.data;
//     // Use the validated and typed invoice data
// } else {
//     console.error("Validation failed:", parseResult.error);
// }
export type Invoice = z.infer<typeof invoiceSchema>;
