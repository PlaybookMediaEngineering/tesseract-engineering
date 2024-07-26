import { z } from "zod";

export const creditNoteSchema = z.object({
  id: z.string(),
  object: z.literal("credit_note"),
  amount: z.number().int(),
  amount_shipping: z.number().int(),
  created: z.number().int(),
  currency: z.string().length(3),
  customer: z.string(),
  customer_balance_transaction: z.string().nullable(),
  discount_amount: z.number().int(),
  discount_amounts: z.array(
    z.object({
      amount: z.number().int(),
      discount: z.string(),
    }),
  ),
  invoice: z.string(),
  lines: z.object({
    object: z.literal("list"),
    data: z.array(
      z.object({
        type: z.enum(["invoice_line_item"]),
        amount: z.number().int(),
        description: z.string().nullable(),
        discount_amount: z.number().int(),
        invoice_line_item: z.string(),
        quantity: z.number().nullable(),
        unit_amount: z.number().int().nullable(),
        unit_amount_decimal: z.string().nullable(),
      }),
    ),
    has_more: z.boolean(),
    url: z.string().url(),
  }),
  livemode: z.boolean(),
  memo: z.string().nullable(),
  metadata: z.record(z.string()),
  number: z.string(),
  out_of_band_amount: z.number().int().nullable(),
  pdf: z.string().url(),
  reason: z.enum([
    "duplicate",
    "fraudulent",
    "order_change",
    "product_unsatisfactory",
  ]),
  refund: z.string().nullable(),
  shipping_cost: z
    .object({
      amount_subtotal: z.number().int(),
      amount_tax: z.number().int(),
      amount_total: z.number().int(),
      shipping_rate: z.string(),
    })
    .nullable(),
  status: z.enum(["issued", "void"]),
  subtotal: z.number().int(),
  subtotal_excluding_tax: z.number().int().nullable(),
  tax_amounts: z.array(
    z.object({
      amount: z.number().int(),
      inclusive: z.boolean(),
      tax_rate: z.string(),
    }),
  ),
  total: z.number().int(),
  total_excluding_tax: z.number().int().nullable(),
  type: z.enum(["post_payment", "pre_payment"]),
  voided_at: z.number().int().nullable(),
});

export type CreditNote = z.infer<typeof creditNoteSchema>;
