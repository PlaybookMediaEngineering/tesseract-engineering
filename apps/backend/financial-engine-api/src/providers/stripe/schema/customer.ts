import { z } from "zod";

const addressSchema = z.object({
  city: z.string().nullable(),
  country: z.string().nullable(),
  line1: z.string().nullable(),
  line2: z.string().nullable(),
  postal_code: z.string().nullable(),
  state: z.string().nullable(),
});

const shippingSchema = z.object({
  address: addressSchema,
  name: z.string().nullable(),
  phone: z.string().nullable(),
});

export const customerSchema = z.object({
  id: z.string(),
  object: z.literal("customer"),
  address: addressSchema.nullable(),
  balance: z.number().int(),
  created: z.number().int(),
  currency: z.string().length(3).nullable(),
  default_source: z.string().nullable(),
  delinquent: z.boolean().nullable(),
  description: z.string().nullable(),
  discount: z.unknown().nullable(), // You might want to define a more specific schema for discount
  email: z.string().email().nullable(),
  invoice_prefix: z.string(),
  invoice_settings: z.object({
    custom_fields: z
      .array(
        z.object({
          name: z.string(),
          value: z.string(),
        }),
      )
      .nullable(),
    default_payment_method: z.string().nullable(),
    footer: z.string().nullable(),
  }),
  livemode: z.boolean(),
  metadata: z.record(z.string()),
  name: z.string().nullable(),
  next_invoice_sequence: z.number().int(),
  phone: z.string().nullable(),
  preferred_locales: z.array(z.string()),
  shipping: shippingSchema.nullable(),
  tax_exempt: z.enum(["none", "exempt", "reverse"]).nullable(),
  test_clock: z.string().nullable(),
});

export type Customer = z.infer<typeof customerSchema>;

export const customerDeletedSchema = z.object({
  id: z.string(),
  object: z.literal("customer"),
  deleted: z.literal(true),
});

export type DeletedCustomer = z.infer<typeof customerDeletedSchema>;
