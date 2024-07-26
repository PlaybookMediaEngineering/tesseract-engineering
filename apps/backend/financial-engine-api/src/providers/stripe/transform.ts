import { Stripe } from "stripe";
import type { Account, Transaction } from "../types";
import type { StripeBankAccount } from "./schema/bank-account";
import type { StripeTransaction } from "./schema/transaction";

export const mapTransactionMethod = (
  type: StripeTransaction["type"],
): string => {
  switch (type) {
    case "charge":
    case "payment":
      return "payment";
    case "refund":
    case "payment_refund":
      return "refund";
    case "transfer":
      return "transfer";
    case "payout":
      return "payout";
    case "adjustment":
      return "adjustment";
    case "stripe_fee":
    case "application_fee":
      return "fee";
    default:
      return "other";
  }
};

export const transformStripeTransaction = (
  stripeTransaction: StripeTransaction,
): Transaction => {
  return {
    id: stripeTransaction.id,
    amount: Math.abs(stripeTransaction.amount) / 100, // Convert cents to dollars and make positive
    currency: stripeTransaction.currency,
    date: new Date(stripeTransaction.created * 1000).toISOString(), // Convert Unix timestamp to ISO string
    status: "posted", // Stripe balance transactions are always posted
    balance: Math.abs(stripeTransaction.net) / 100, // Stripe doesn't provide a balance for individual transactions
    category: stripeTransaction.reporting_category || null,
    method: mapTransactionMethod(stripeTransaction.type),
    name: stripeTransaction.description || stripeTransaction.type,
    description: stripeTransaction.description,
    currency_rate: stripeTransaction.exchange_rate,
    currency_source: null, // Stripe doesn't provide this information
  };
};

export const transformStripeBankAccount = (
  stripeBankAccount: StripeBankAccount,
): Account => {
  return {
    id: stripeBankAccount.id,
    name: stripeBankAccount.bank_name || stripeBankAccount.last4,
    currency: stripeBankAccount.currency,
    provider: "stripe",
    institution: {
      id: "", // NOTE: we place the routing number as institution id
      name: stripeBankAccount.bank_name || stripeBankAccount.last4,
      logo: null,
      provider: "stripe",
    },
    type: "depository", // NOTE: Business accounts can only be depository at least on stripe as they are used to collect funds and payout funds
    enrollment_id: null,
    routing_number: stripeBankAccount.routing_number || null,
  };
};
