import { z } from "zod";

export const stripeBankAccountSchema = z.object({
  id: z.string(),
  object: z.literal("bank_account"),
  account: z.string(),
  account_holder_name: z.string().nullable(),
  account_holder_type: z.enum(["individual", "company"]).nullable(),
  account_type: z.enum(["checking", "savings", "futsu", "toza"]).nullable(),
  available_payout_methods: z.array(z.enum(["standard", "instant"])),
  bank_name: z.string().nullable(),
  country: z.string(),
  currency: z.string(),
  fingerprint: z.string().nullable(),
  last4: z.string(),
  metadata: z.record(z.unknown()),
  routing_number: z.string().nullable(),
  status: z.enum([
    "new",
    "validated",
    "verified",
    "verification_failed",
    "errored",
  ]),
});

export type StripeBankAccount = z.infer<typeof stripeBankAccountSchema>;
