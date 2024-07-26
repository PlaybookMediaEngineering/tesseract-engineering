import type {
  Balance,
  CreateBankAccountRequest,
  CreateBankAccountResponse,
  DeleteBankAccountRequest,
  DeleteBankAccountResponse,
  DeleteStripeAccountRequest,
  DeleteStripeAccountResponse,
  GetBankAccountRequest,
  GetBankAccountResponse,
  GetStripeAccountRequest,
  GetStripeAccountResponse,
  GetStripeTransactionsRequest,
  GetTransactionsResponse,
  LinkTokenCreateAndExchangeRequest,
  LinkTokenCreateAndExchangeResponse,
  ListAccountBalanceRequest,
  ListAccountBalanceResponse,
  ListBankAccountsRequest,
  ListBankAccountsResponse,
  ProviderParams,
  UpdateBankAccountRequest,
  UpdateBankAccountResponse,
} from "@/providers/types";
import Stripe from "stripe";
import type { StripeTransaction } from "./schema/transaction";

import { z } from "zod";
import { stripeBalanceSchema } from "./schema/balance";
import { stripeBankAccountSchema } from "./schema/bank-account";
import { stripeAccountSchema } from "./schema/business-account";
import { stripeTransactionSchema } from "./schema/transaction";
import { transformStripeTransaction } from "./transform";

export class StripeClient {
  #client: Stripe;
  #secretKey: string;

  constructor(params: Omit<ProviderParams, "provider">) {
    this.#secretKey = params.envs.STRIPE_SECRET_KEY;

    this.#client = new Stripe(this.#secretKey, {
      apiVersion: params.envs.STRIPE_API_VERSION as Stripe.LatestApiVersion,
    });
  }

  async getHealthCheck() {
    return true;
  }

  async getCustomer(customerId: string) {
    return this.#client.customers.retrieve(customerId);
  }

  async createCustomer(params: Stripe.CustomerCreateParams) {
    return this.#client.customers.create(params);
  }

  async updateCustomer(
    customerId: string,
    params: Stripe.CustomerUpdateParams,
  ) {
    return this.#client.customers.update(customerId, params);
  }

  /**
   * Creates an account link for a Stripe Connect account and returns the link details.
   *
   * @param req - The request object for creating an account link.
   * @param req.accountId - The ID of the Stripe Connect account for which to create the link.
   * @param req.refreshUrl - The URL the user will be redirected to if the account link expires.
   * @param req.returnUrl - The URL the user will be redirected to after they complete the account link flow.
   * @param req.type - The type of account link to create. Can be 'account_onboarding' or 'account_update'.
   *
   * @returns A promise that resolves to an object containing the account link details.
   * @property {string} url - The URL of the account link.
   * @property {number} created - The timestamp when the link was created.
   * @property {number} expiresAt - The timestamp when the link will expire.
   * @property {string} object - The type of the returned object (always 'account_link').
   *
   * @throws {Error} If there's an error creating the account link.
   *
   * @example
   * try {
   *   const linkDetails = await stripeClient.itemTokenCreateAndExchange({
   *     accountId: 'acct_123456789',
   *     refreshUrl: 'https://example.com/refresh',
   *     returnUrl: 'https://example.com/return',
   *     type: 'account_onboarding'
   *   });
   *   console.log('Account link created:', linkDetails.url);
   * } catch (error) {
   *   console.error('Error creating account link:', error.message);
   * }
   */
  // ref: https://docs.stripe.com/connect/custom/hosted-onboarding
  async itemTokenCreateAndExchange(
    req: LinkTokenCreateAndExchangeRequest,
  ): Promise<LinkTokenCreateAndExchangeResponse> {
    // get the records from the request object
    const { accountId, refreshUrl, returnUrl, type } = req;

    const params: Stripe.AccountLinkCreateParams = {
      account: accountId,
      refresh_url: refreshUrl,
      return_url: returnUrl,
      type: type,
    };

    // create the item token
    const res = await this.#client.accountLinks.create(params);

    return {
      url: res.url,
      created: res.created,
      expiresAt: res.expires_at,
      object: res.object,
    };
  }

  /**
   * Deletes a Stripe account.
   *
   * @param req - The request object for deleting a Stripe account.
   * @param req.accountId - The ID of the Stripe account to be deleted.
   *
   * @returns A promise that resolves to an object containing a boolean indicating if the account was successfully deleted.
   *
   * @throws {Error} If the account deletion fails or if there's a Stripe API error.
   *
   * @example
   * try {
   *   const result = await stripeClient.deleteAccount({ accountId: 'acct_123456789' });
   *   console.log('Account deleted:', result.account);
   * } catch (error) {
   *   console.error('Error deleting account:', error.message);
   * }
   */
  async deleteAccount(
    req: DeleteStripeAccountRequest,
  ): Promise<DeleteStripeAccountResponse> {
    const { accountId } = req;

    try {
      const res = await this.#client.accounts.del(accountId);

      if (res.deleted) {
        return { account: res.deleted };
      }

      throw new Error("Account deletion failed.");
    } catch (error) {
      if (error instanceof Stripe.errors.StripeError) {
        throw new Error(`Stripe API error: ${error.message}`);
      }
      throw error;
    }
  }

  async createBankAccount(
    req: CreateBankAccountRequest,
  ): Promise<CreateBankAccountResponse> {
    const { accountId, bankAccountData } = req;

    try {
      const newBankAccount = await this.#client.accounts.createExternalAccount(
        accountId,
        bankAccountData,
      );

      const validatedBankAccount =
        stripeBankAccountSchema.parse(newBankAccount);
      return { bankAccount: validatedBankAccount };
    } catch (error) {
      if (error instanceof Stripe.errors.StripeError) {
        throw new Error(`Stripe API error: ${error.message}`);
      }
      throw error;
    }
  }

  async getBankAccount(
    req: GetBankAccountRequest,
  ): Promise<GetBankAccountResponse> {
    const { accountId, bankAccountId } = req;

    try {
      const bankAccount = (await this.#client.accounts.retrieveExternalAccount(
        accountId,
        bankAccountId,
      )) as Stripe.BankAccount;

      const validatedBankAccount = stripeBankAccountSchema.parse(bankAccount);
      return { bankAccount: validatedBankAccount };
    } catch (error) {
      if (error instanceof Stripe.errors.StripeError) {
        throw new Error(`Stripe API error: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Retrieves the balance for a given Stripe account.
   *
   * @param {ListAccountBalanceRequest} req - The request object containing the account ID.
   * @returns {Promise<ListAccountBalanceResponse>} A promise that resolves to the account balance.
   * @throws {Error} If there's an issue retrieving the balance or if the response doesn't match the expected schema.
   */
  async listAccountBalances(
    req: ListAccountBalanceRequest,
  ): Promise<ListAccountBalanceResponse> {
    const { accountId } = req;

    try {
      const options: Stripe.RequestOptions = {
        stripeAccount: accountId,
      };

      const accountBalance = await this.#client.balance.retrieve(options);

      const res = stripeBalanceSchema.parse(accountBalance);

      const balance: Balance = {
        amount: res.available[0].amount,
        currency: res.available[0].currency,
      };

      return { balance }; // Add the 'balance' property to the return object
    } catch (error) {
      if (error instanceof Stripe.errors.StripeError) {
        throw new Error(`Stripe API error: ${error.message}`);
      }
      throw error;
    }
  }

  async updateBankAccount(
    req: UpdateBankAccountRequest,
  ): Promise<UpdateBankAccountResponse> {
    const { accountId, bankAccountId, updateData } = req;

    try {
      const updatedBankAccount =
        (await this.#client.accounts.updateExternalAccount(
          accountId,
          bankAccountId,
          updateData,
        )) as Stripe.BankAccount;

      const validatedBankAccount =
        stripeBankAccountSchema.parse(updatedBankAccount);
      return { bankAccount: validatedBankAccount };
    } catch (error) {
      if (error instanceof Stripe.errors.StripeError) {
        throw new Error(`Stripe API error: ${error.message}`);
      }
      throw error;
    }
  }

  async deleteBankAccount(
    req: DeleteBankAccountRequest,
  ): Promise<DeleteBankAccountResponse> {
    const { accountId, bankAccountId } = req;

    try {
      const res = await this.#client.accounts.deleteExternalAccount(
        accountId,
        bankAccountId,
      );

      return { account: res.deleted };
    } catch (error) {
      if (error instanceof Stripe.errors.StripeError) {
        throw new Error(`Stripe API error: ${error.message}`);
      }
      throw error;
    }
  }

  async listBankAccounts(
    req: ListBankAccountsRequest,
  ): Promise<ListBankAccountsResponse> {
    const { accountId, limit = 10 } = req;

    try {
      const bankAccounts = await this.#client.accounts.listExternalAccounts(
        accountId,
        { object: "bank_account", limit },
      );

      const validatedBankAccounts = z
        .array(stripeBankAccountSchema)
        .parse(bankAccounts.data);
      return { bankAccounts: validatedBankAccounts };
    } catch (error) {
      if (error instanceof Stripe.errors.StripeError) {
        throw new Error(`Stripe API error: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Retrieves a Stripe account by its ID and validates the response.
   *
   * @param req - The request parameters for retrieving the account.
   * @returns A promise that resolves to the validated Stripe account.
   * @throws Will throw an error if the Stripe API request fails or if the response doesn't match the expected schema.
   *
   * @example
   * const accountResponse = await stripeClient.getAccount({
   *   accountId: 'acct_123456789',
   *   expand: ['business_profile', 'capabilities']
   * });
   * console.log(accountResponse.account);
   */
  async getBusinessAccount(
    req: GetStripeAccountRequest,
  ): Promise<GetStripeAccountResponse> {
    const { accountId, expand } = req;

    try {
      const params: Stripe.AccountRetrieveParams = {
        expand: expand,
      };

      const currentAccount = await this.#client.accounts.retrieve(
        accountId,
        params,
      );

      const validationResult = stripeAccountSchema.safeParse(currentAccount);

      if (!validationResult.success) {
        throw new Error(
          `Account validation failed: ${validationResult.error.message}`,
        );
      }

      return { account: validationResult.data };
    } catch (error) {
      if (error instanceof Stripe.errors.StripeError) {
        throw new Error(`Stripe API error: ${error.message}`);
      }
      throw error; // Re-throw if it's not a Stripe error
    }
  }

  /**
   * Retrieves and transforms balance transactions for a given customer from Stripe.
   *
   * @param params - The parameters for the transaction request.
   * @param params.customerId - The ID of the customer whose transactions to retrieve.
   * @param params.limit - The maximum number of transactions to retrieve per request (default: 500).
   * @param params.starting_after - A cursor for use in pagination, referring to the ID of the last retrieved transaction.
   * @param params.ending_before - A cursor for use in pagination, referring to the ID of the first retrieved transaction.
   * @param params.created - A filter on the list based on the object created field.
   * @param params.latest - If true, retrieves only the most recent transactions (default: false).
   *
   * @returns A promise that resolves to an array of transformed transactions.
   *
   * @throws Will throw an error if the Stripe API request fails.
   *
   * @example
   * // Get all transactions
   * const allTransactions = await stripeClient.getTransactions({
   *   customerId: 'cus_12345',
   *   limit: 100,
   *   created: { gte: 1609459200 } // Transactions created on or after Jan 1, 2021
   * });
   *
   * // Get only the latest transactions
   * const latestTransactions = await stripeClient.getTransactions({
   *   customerId: 'cus_12345',
   *   limit: 10,
   *   latest: true
   * });
   */
  async getTransactions(
    params: GetStripeTransactionsRequest,
  ): Promise<GetTransactionsResponse> {
    const { customerId, latest = false, ...otherParams } = params;
    let allTransactions: StripeTransaction[] = [];
    let hasMore = true;
    const currentParams: Stripe.BalanceTransactionListParams = {
      ...otherParams,
      limit: params.limit || 500,
    };

    if (latest) {
      // If getting latest transactions, set created parameter to fetch transactions from now
      currentParams.starting_after = new Date().toISOString();
    }

    while (hasMore) {
      const response = await this.#client.customers.listBalanceTransactions(
        customerId,
        otherParams,
      );

      // Validate and transform each transaction
      const validatedTransactions = response.data
        .map((transaction) => stripeTransactionSchema.safeParse(transaction))
        .filter(
          (result): result is z.SafeParseSuccess<StripeTransaction> =>
            result.success,
        )
        .map((result) => result.data);

      allTransactions = allTransactions.concat(validatedTransactions);
      hasMore = response.has_more;

      if (hasMore && response.data.length > 0) {
        currentParams.starting_after =
          response.data[response.data.length - 1].id;
      } else {
        hasMore = false;
      }
    }

    return allTransactions.map(transformStripeTransaction);
  }
}
