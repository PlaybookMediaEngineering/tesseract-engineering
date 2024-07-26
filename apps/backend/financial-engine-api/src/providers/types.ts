import type { AccountType } from "@/utils/account";
import type { Stripe } from "stripe";
import type stripe from "stripe";

import type { StripeBankAccount } from "./stripe/schema/bank-account";
import type { StripeAccount } from "./stripe/schema/business-account";

export type Providers = "teller" | "plaid" | "gocardless" | "stripe";

export type ProviderParams = {
  provider: Providers;
  kv: KVNamespace;
  environment?: "development" | "sandbox" | "production";
  fetcher?: Fetcher | null; // Teller
  envs: {
    GOCARDLESS_SECRET_KEY: string;
    GOCARDLESS_SECRET_ID: string;
    PLAID_CLIENT_ID: string;
    PLAID_SECRET: string;
    PLAID_ENVIRONMENT: string;
    STRIPE_SECRET_KEY: string;
    STRIPE_API_VERSION: string;
  };
};

export type Transaction = {
  id: string;
  amount: number;
  currency: string;
  date: string;
  status: "posted" | "pending";
  balance: number | null;
  category: string | null;
  method: string;
  name: string;
  description: string | null;
  currency_rate: number | null;
  currency_source: string | null;
};

export type Institution = {
  id: string;
  name: string;
  logo: string | null;
  provider: Providers;
};

export type Account = {
  id: string;
  name: string;
  currency: string;
  provider: Providers;
  institution: Institution | null;
  type: AccountType;
  enrollment_id: string | null; // Teller
  routing_number: string | null; // Stripe
};

export type Balance = {
  amount: number;
  currency: string;
};

export type GetTransactionsRequest = {
  accountId: string;
  latest?: boolean;
  accessToken?: string; // Teller & Plaid
  accountType: AccountType;
  customerId?: string; // Stripe
  currency?: string; // Stripe
  type?: string; // Stripe
  expand?: Array<string>; // Stripe
  ending_before?: string; // Stripe
  limit?: number; // Stripe
  starting_after?: string; // Stripe
};

export type GetAccountsRequest = {
  id?: string; // GoCardLess
  countryCode?: string; // GoCardLess
  accessToken?: string; // Teller & Plaid
  institutionId?: string; // Plaid
  customerId?: string; // Stripe
  bankAccountId?: string; // Stripe
};

export type GetAccountBalanceRequest = {
  accountId: string;
  accessToken?: string; // Teller & Plaid
  bankAccountId?: string; // Stripe
};

export type GetAccountBalanceResponse = {
  currency: string;
  amount: number;
};

export type DeleteAccountsRequest = {
  accountId?: string; // GoCardLess
  accessToken?: string; // Teller & Plaid
};

export type GetTransactionsResponse = Transaction[];

export type GetAccountsResponse = Account[];

export type GetInstitutionsResponse = {
  id: string;
  name: string;
  logo: string | null;
  provider: Providers;
}[];

export type GetInstitutionsRequest = {
  countryCode?: string;
};

export type HealthCheckResponse = {
  healthy: boolean;
};

export type GetHealthCheckResponse = {
  teller: HealthCheckResponse;
  gocardless: HealthCheckResponse;
  plaid: HealthCheckResponse;
  stripe: HealthCheckResponse;
};

export interface GetStripeTransactionsRequest {
  customerId: string;
  currency?: string;
  type?: string;
  expand?: Array<string>;
  ending_before?: string;
  limit?: number;
  starting_after?: string;
  latest: boolean;
}

/**
 * Request parameters for retrieving a Stripe account.
 */
export interface GetStripeAccountRequest {
  /** The ID of the account to retrieve. */
  accountId: string;
  /**
   * Specifies which fields in the response should be expanded.
   * @see https://stripe.com/docs/api/expanding_objects
   */
  expand?: string[];
}

/**
 * Response type for the getAccounts method.
 */
export interface GetStripeAccountResponse {
  /** The retrieved and validated Stripe account. */
  account: StripeAccount;
}

export interface DeleteStripeAccountRequest {
  accountId: string;
}

export interface DeleteStripeAccountResponse {
  account: boolean;
}

export interface LinkTokenCreateAndExchangeRequest {
  accountId: string;
  refreshUrl: string;
  returnUrl: string;
  type: stripe.AccountLinkCreateParams.Type;
}

export interface LinkTokenCreateAndExchangeResponse {
  url: string;
  created: number;
  expiresAt: number;
  object: string;
}

// Types for request and response objects
export type CreateBankAccountRequest = {
  accountId: string;
  bankAccountData: Stripe.AccountCreateExternalAccountParams;
};

export type CreateBankAccountResponse = {
  bankAccount: StripeBankAccount;
};

export type GetBankAccountRequest = {
  accountId: string;
  bankAccountId: string;
};

export type GetBankAccountResponse = {
  bankAccount: StripeBankAccount;
};

export type UpdateBankAccountRequest = {
  accountId: string;
  bankAccountId: string;
  updateData: Stripe.AccountUpdateExternalAccountParams;
};

export type UpdateBankAccountResponse = {
  bankAccount: StripeBankAccount;
};

export type DeleteBankAccountRequest = {
  accountId: string;
  bankAccountId: string;
};

export type DeleteBankAccountResponse = {
  account: boolean;
};

export type ListBankAccountsRequest = {
  accountId: string;
  limit?: number;
};

export type ListBankAccountsResponse = {
  bankAccounts: StripeBankAccount[];
};

export type ListAccountBalanceRequest = {
  accountId: string;
};

export type ListAccountBalanceResponse = {
  balance: Balance;
};
