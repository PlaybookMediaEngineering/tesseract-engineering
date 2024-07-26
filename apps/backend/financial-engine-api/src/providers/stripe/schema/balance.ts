import { z } from "zod";

export const stripeBalanceSchema = z.object({
  object: z.literal("balance"),
  available: z.array(
    z.object({
      amount: z.number().int(),
      currency: z.string().length(3),
      source_types: z.object({
        bank_account: z.number().int(),
        card: z.number().int(),
        fpx: z.number().int(),
      }),
    }),
  ),
  pending: z.array(
    z.object({
      amount: z.number().int(),
      currency: z.string().length(3),
      source_types: z.object({
        bank_account: z.number().int(),
        card: z.number().int(),
        fpx: z.number().int(),
      }),
    }),
  ),
  connect_reserved: z.array(
    z.object({
      amount: z.number().int(),
      currency: z.string().length(3),
      source_types: z.object({
        bank_account: z.number().int(),
        card: z.number().int(),
        fpx: z.number().int(),
      }),
    }),
  ),
  instant_available: z.array(
    z.object({
      amount: z.number().int(),
      currency: z.string().length(3),
      source_types: z.object({
        bank_account: z.number().int(),
        card: z.number().int(),
        fpx: z.number().int(),
      }),
    }),
  ),
  issue: z.object({
    available: z.array(
      z.object({
        amount: z.number().int(),
        currency: z.string().length(3),
        source_types: z.object({
          bank_account: z.number().int(),
          card: z.number().int(),
          fpx: z.number().int(),
        }),
      }),
    ),
  }),
  livemode: z.boolean(),
});

export type StripeBalance = z.infer<typeof stripeBalanceSchema>;
