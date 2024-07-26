import { z } from "zod";

export const chargeSchema = z.object({
  id: z.string(),
  object: z.literal("charge"),
  amount: z.number().int(),
  amount_captured: z.number().int(),
  amount_refunded: z.number().int(),
  application: z.string().nullable(),
  application_fee: z.string().nullable(),
  application_fee_amount: z.number().int().nullable(),
  balance_transaction: z.string(),
  billing_details: z.object({
    address: z.object({
      city: z.string().nullable(),
      country: z.string().nullable(),
      line1: z.string().nullable(),
      line2: z.string().nullable(),
      postal_code: z.string().nullable(),
      state: z.string().nullable(),
    }),
    email: z.string().email().nullable(),
    name: z.string().nullable(),
    phone: z.string().nullable(),
  }),
  calculated_statement_descriptor: z.string().nullable(),
  captured: z.boolean(),
  created: z.number().int(),
  currency: z.string().length(3),
  customer: z.string().nullable(),
  description: z.string().nullable(),
  destination: z.string().nullable(),
  dispute: z.string().nullable(),
  disputed: z.boolean(),
  failure_code: z.string().nullable(),
  failure_message: z.string().nullable(),
  fraud_details: z.record(z.unknown()).nullable(),
  invoice: z.string().nullable(),
  livemode: z.boolean(),
  metadata: z.record(z.string()),
  on_behalf_of: z.string().nullable(),
  order: z.string().nullable(),
  outcome: z
    .object({
      network_status: z.string(),
      reason: z.string().nullable(),
      risk_level: z.string(),
      risk_score: z.number().int(),
      seller_message: z.string(),
      type: z.string(),
    })
    .nullable(),
  paid: z.boolean(),
  payment_intent: z.string().nullable(),
  payment_method: z.string(),
  payment_method_details: z.object({
    card: z.object({
      brand: z.string(),
      checks: z.object({
        address_line1_check: z.string().nullable(),
        address_postal_code_check: z.string().nullable(),
        cvc_check: z.string().nullable(),
      }),
      country: z.string(),
      exp_month: z.number().int(),
      exp_year: z.number().int(),
      fingerprint: z.string(),
      funding: z.string(),
      installments: z
        .object({
          plan: z.object({
            count: z.number().int(),
            interval: z.string(),
            type: z.string(),
          }),
        })
        .nullable(),
      last4: z.string(),
      network: z.string(),
      three_d_secure: z
        .object({
          result: z.string(),
          version: z.string(),
        })
        .nullable(),
      wallet: z
        .object({
          type: z.string(),
        })
        .nullable(),
    }),
    type: z.string(),
  }),
  receipt_email: z.string().nullable(),
  receipt_number: z.string().nullable(),
  receipt_url: z.string().url(),
  refunded: z.boolean(),
  refunds: z.object({
    object: z.literal("list"),
    data: z.array(
      z.object({
        id: z.string(),
        object: z.literal("refund"),
        amount: z.number().int(),
        balance_transaction: z.string().nullable(),
        charge: z.string(),
        created: z.number().int(),
        currency: z.string().length(3),
        metadata: z.record(z.string()),
        payment_intent: z.string().nullable(),
        reason: z.string().nullable(),
        receipt_number: z.string().nullable(),
        source_transfer_reversal: z.string().nullable(),
        status: z.string(),
        transfer_reversal: z.string().nullable(),
      }),
    ),
    has_more: z.boolean(),
    url: z.string().url(),
  }),
  review: z.string().nullable(),
  shipping: z
    .object({
      address: z.object({
        city: z.string().nullable(),
        country: z.string().nullable(),
        line1: z.string().nullable(),
        line2: z.string().nullable(),
        postal_code: z.string().nullable(),
        state: z.string().nullable(),
      }),
      carrier: z.string().nullable(),
      name: z.string().nullable(),
      phone: z.string().nullable(),
      tracking_number: z.string().nullable(),
    })
    .nullable(),
  source: z
    .object({
      id: z.string(),
      object: z.string(),
    })
    .nullable(),
  source_transfer: z.string().nullable(),
  statement_descriptor: z.string().nullable(),
  statement_descriptor_suffix: z.string().nullable(),
  status: z.enum(["succeeded", "pending", "failed"]),
  transfer_data: z
    .object({
      amount: z.number().int().nullable(),
      destination: z.string(),
    })
    .nullable(),
  transfer_group: z.string().nullable(),
});

export type Charge = z.infer<typeof chargeSchema>;
