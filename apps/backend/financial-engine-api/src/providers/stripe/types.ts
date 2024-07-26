import { z } from "zod";

/**
 * Schema for validating the getTransactions request parameters.
 */
export const getTransactionsRequestSchema = z.object({
  customerId: z.string().nonempty("Customer ID is required"),
  currency: z.string().optional(),
  type: z.string().optional(),
  expand: z.array(z.string()).optional(),
  ending_before: z.string().optional(),
  limit: z.number().int().positive().max(100).optional(),
  starting_after: z.string().optional(),
  latest: z.boolean().optional(),
});

// Zod schema for GetAccountsRequest validation
export const getAccountsRequestSchema = z.object({
  customerId: z.string().nonempty("Customer ID is required"),
  bankAccountId: z.string().nonempty("Bank Account ID is required"),
});

// Zod schema for GetAccountBalanceRequest validation
export const getAccountBalanceRequestSchema = z.object({
  accountId: z.string().nonempty("Account ID is required"),
  bankAccountId: z.string().nonempty("Bank Account ID is required"),
});

// Zod schema for DeleteAccountsRequest validation
export const deleteAccountsRequestSchema = z.object({
  accountId: z.string().nonempty("Account ID is required"),
});

// Zod schemas for request validation
export const createBankAccountSchema = z.object({
  accountId: z.string().nonempty("Account ID is required"),
  bankAccountData: z.object({}),
});

export const getBankAccountSchema = z.object({
  accountId: z.string().nonempty("Account ID is required"),
  bankAccountId: z.string().nonempty("Bank Account ID is required"),
});

export const updateBankAccountSchema = z.object({
  accountId: z.string().nonempty("Account ID is required"),
  bankAccountId: z.string().nonempty("Bank Account ID is required"),
  updateData: z.object({
    // Add specific fields for update data
  }),
});

export const deleteBankAccountSchema = getBankAccountSchema;

export const listBankAccountsSchema = z.object({
  accountId: z.string().nonempty("Account ID is required"),
  limit: z.number().int().positive().optional(),
});

export const getStripeAccountSchema = z.object({
  accountId: z.string().nonempty("Account ID is required"),
  expand: z.array(z.string()).optional(),
});

export const linkTokenCreateAndExchangeSchema = z.object({
  accountId: z.string().nonempty("Account ID is required"),
  refreshUrl: z.string().url("Refresh URL must be a valid URL"),
  returnUrl: z.string().url("Return URL must be a valid URL"),
  type: z.enum(["account_onboarding", "account_update"], {
    errorMap: () => ({
      message: 'Type must be either "account_onboarding" or "account_update"',
    }),
  }),
});
