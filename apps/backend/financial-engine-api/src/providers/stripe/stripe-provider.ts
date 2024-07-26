import Stripe from "stripe";
import { z } from "zod";
import type { Provider } from "../interface";
import type {
  Account,
  CreateBankAccountRequest,
  DeleteAccountsRequest,
  DeleteBankAccountRequest,
  DeleteStripeAccountRequest,
  GetAccountBalanceRequest,
  GetAccountBalanceResponse,
  GetAccountsRequest,
  GetBankAccountRequest,
  GetInstitutionsRequest,
  GetInstitutionsResponse,
  GetStripeAccountRequest,
  GetStripeTransactionsRequest,
  GetTransactionsRequest,
  LinkTokenCreateAndExchangeRequest,
  LinkTokenCreateAndExchangeResponse,
  ListBankAccountsRequest,
  ProviderParams,
  UpdateBankAccountRequest,
} from "../types";
import { StripeClient } from "./stripe-api";
import { transformStripeBankAccount } from "./transform";
import {
  createBankAccountSchema,
  deleteAccountsRequestSchema,
  deleteBankAccountSchema,
  getAccountBalanceRequestSchema,
  getAccountsRequestSchema,
  getBankAccountSchema,
  getStripeAccountSchema,
  getTransactionsRequestSchema,
  linkTokenCreateAndExchangeSchema,
  listBankAccountsSchema,
  updateBankAccountSchema,
} from "./types";

export class StripeProvider implements Provider {
  #api: StripeClient;

  constructor(params: Omit<ProviderParams, "provider">) {
    this.#api = new StripeClient(params);
  }

  /**
   * Retrieves transactions for a given customer from Stripe.
   *
   * @param {GetTransactionsRequest} params - The parameters for fetching transactions.
   * @returns {Promise<GetTransactionsResponse>} A promise that resolves to the fetched transactions.
   * @throws {Error} If parameter validation fails or if there's an issue with the Stripe API call.
   *
   * @example
   * const transactions = await stripeProvider.getTransactions({
   *   customerId: 'cus_12345',
   *   currency: 'usd',
   *   limit: 20,
   *   latest: true
   * });
   */
  async getTransactions(params: GetTransactionsRequest) {
    try {
      // Validate and parse the input parameters
      const validatedParams = getTransactionsRequestSchema.parse(params);

      const {
        customerId,
        currency,
        type,
        expand,
        ending_before,
        limit,
        starting_after,
        latest = false,
      } = validatedParams;

      const req: GetStripeTransactionsRequest = {
        customerId,
        currency,
        type,
        expand,
        ending_before,
        limit,
        starting_after,
        latest,
      };

      const response = await this.#api.getTransactions(req);

      // Optionally, you can transform the response here if needed
      // const transformedTransactions = response.map(transformStripeTransaction);

      return response;
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Handle validation errors
        const errorMessages = error.errors.map((err) => err.message).join(", ");
        throw new Error(`Invalid parameters: ${errorMessages}`);
      }

      if (error instanceof Error) {
        // Handle other types of errors
        throw new Error(`Error fetching transactions: ${error.message}`);
      }

      // Handle unknown errors
      throw new Error(
        "An unexpected error occurred while fetching transactions",
      );
    }
  }

  /**
   * Checks the health status of the Stripe API connection.
   *
   * @returns {Promise<boolean>} A promise that resolves to true if the API is healthy, false otherwise.
   * @throws {Error} If there's an unexpected error during the health check.
   */
  async getHealthCheck(): Promise<boolean> {
    try {
      return await this.#api.getHealthCheck();
    } catch (error) {
      console.error("Error during Stripe health check:", error);
      return false;
    }
  }

  /**
   * Retrieves account information for a given customer and bank account.
   *
   * @param {GetAccountsRequest} params - The parameters for fetching account information.
   * @param {string} params.customerId - The ID of the customer.
   * @param {string} params.bankAccountId - The ID of the bank account.
   * @returns {Promise<Account[]>} A promise that resolves to an array of Account objects.
   * @throws {Error} If parameter validation fails or if there's an issue with the Stripe API call.
   */
  async getAccounts(params: GetAccountsRequest): Promise<Array<Account>> {
    try {
      // Validate and parse the input parameters
      const validatedParams = getAccountsRequestSchema.parse(params);

      const { customerId, bankAccountId } = validatedParams;

      const req: GetBankAccountRequest = {
        accountId: customerId,
        bankAccountId: bankAccountId,
      };

      const response = await this.#api.getBankAccount(req);

      if (!response.bankAccount) {
        throw new Error("No bank account data returned from Stripe API");
      }

      return [transformStripeBankAccount(response.bankAccount)];
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Handle validation errors
        const errorMessages = error.errors.map((err) => err.message).join(", ");
        throw new Error(`Invalid parameters: ${errorMessages}`);
      }

      if (error instanceof Error) {
        // Handle other types of errors
        throw new Error(`Error fetching account information: ${error.message}`);
      }

      // Handle unknown errors
      throw new Error(
        "An unexpected error occurred while fetching account information",
      );
    }
  }

  /**
   * Retrieves the balance for a specific account and bank account.
   *
   * @param {GetAccountBalanceRequest} params - The parameters for fetching the account balance.
   * @param {string} params.accountId - The ID of the account (usually the customer ID in Stripe).
   * @param {string} params.bankAccountId - The ID of the specific bank account.
   * @returns {Promise<GetAccountBalanceResponse>} A promise that resolves to the account balance.
   * @throws {Error} If parameter validation fails or if there's an issue with the Stripe API calls.
   */
  async getAccountBalance(
    params: GetAccountBalanceRequest,
  ): Promise<GetAccountBalanceResponse> {
    try {
      // Validate and parse the input parameters
      const validatedParams = getAccountBalanceRequestSchema.parse(params);

      const { accountId, bankAccountId } = validatedParams;

      // First, verify the bank account exists
      const bankAccountReq: GetBankAccountRequest = {
        accountId,
        bankAccountId,
      };

      const bankAccountResponse =
        await this.#api.getBankAccount(bankAccountReq);

      if (!bankAccountResponse.bankAccount) {
        throw new Error("Bank account not found");
      }

      // Then, fetch the account balance
      const accountBalanceResponse = await this.#api.listAccountBalances({
        accountId,
      });

      if (!accountBalanceResponse.balance) {
        throw new Error("Account balance not available");
      }

      const { currency, amount } = accountBalanceResponse.balance;

      return {
        currency,
        amount,
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Handle validation errors
        const errorMessages = error.errors.map((err) => err.message).join(", ");
        throw new Error(`Invalid parameters: ${errorMessages}`);
      }

      if (error instanceof Error) {
        // Handle other types of errors
        throw new Error(`Error fetching account balance: ${error.message}`);
      }

      // Handle unknown errors
      throw new Error(
        "An unexpected error occurred while fetching account balance",
      );
    }
  }

  /**
   * Attempts to get institutions, which is not applicable for Stripe.
   *
   * @param {GetInstitutionsRequest} params - The parameters for fetching institutions.
   * @param {string} [params.countryCode] - The country code for which to fetch institutions.
   * @throws {Error} Always throws an error as this operation is not supported for Stripe.
   */
  async getInstitutions(
    params: GetInstitutionsRequest,
  ): Promise<GetInstitutionsResponse> {
    throw new Error("getInstitutions is not applicable for Stripe");
  }

  /**
   * Deletes a Stripe account.
   *
   * @param {DeleteAccountsRequest} params - The parameters for deleting an account.
   * @param {string} params.accountId - The ID of the account to be deleted.
   * @throws {Error} If parameter validation fails or if there's an issue with the Stripe API call.
   */
  async deleteAccounts(params: DeleteAccountsRequest): Promise<void> {
    try {
      // Validate and parse the input parameters
      const validatedParams = deleteAccountsRequestSchema.parse(params);

      const { accountId } = validatedParams;

      const req: DeleteStripeAccountRequest = {
        accountId,
      };

      await this.#api.deleteAccount(req);
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Handle validation errors
        const errorMessages = error.errors.map((err) => err.message).join(", ");
        throw new Error(`Invalid parameters: ${errorMessages}`);
      }

      if (error instanceof Error) {
        // Handle other types of errors
        throw new Error(`Error deleting account: ${error.message}`);
      }

      // Handle unknown errors
      throw new Error(
        "An unexpected error occurred while deleting the account",
      );
    }
  }

  /**
   * Creates a new bank account for a Stripe account.
   * @param {CreateBankAccountRequest} req - The request parameters for creating a bank account.
   * @returns {Promise<any>} A promise that resolves to the created bank account details.
   * @throws {Error} If parameter validation fails or if there's an issue with the Stripe API call.
   */
  async createBankAccount(req: CreateBankAccountRequest) {
    try {
      const validatedReq = createBankAccountSchema.parse(req);

      const payload: CreateBankAccountRequest = {
        accountId: validatedReq.accountId,
        bankAccountData:
          validatedReq.bankAccountData as Stripe.AccountCreateExternalAccountParams,
      };

      return await this.#api.createBankAccount(payload);
    } catch (error) {
      this.handleError(error, "Error creating bank account");
    }
  }

  /**
   * Retrieves details of a specific bank account.
   * @param {GetBankAccountRequest} req - The request parameters for getting a bank account.
   * @returns {Promise<any>} A promise that resolves to the bank account details.
   * @throws {Error} If parameter validation fails or if there's an issue with the Stripe API call.
   */
  async getBankAccount(req: GetBankAccountRequest) {
    try {
      const validatedReq = getBankAccountSchema.parse(req);
      return await this.#api.getBankAccount(validatedReq);
    } catch (error) {
      this.handleError(error, "Error retrieving bank account");
    }
  }

  /**
   * Updates an existing bank account.
   * @param {UpdateBankAccountRequest} req - The request parameters for updating a bank account.
   * @returns {Promise<any>} A promise that resolves to the updated bank account details.
   * @throws {Error} If parameter validation fails or if there's an issue with the Stripe API call.
   */
  async updateBankAccount(req: UpdateBankAccountRequest) {
    try {
      const validatedReq = updateBankAccountSchema.parse(req);
      return await this.#api.updateBankAccount(validatedReq);
    } catch (error) {
      this.handleError(error, "Error updating bank account");
    }
  }

  /**
   * Deletes a bank account.
   * @param {DeleteBankAccountRequest} req - The request parameters for deleting a bank account.
   * @returns {Promise<any>} A promise that resolves to the deletion confirmation.
   * @throws {Error} If parameter validation fails or if there's an issue with the Stripe API call.
   */
  async deleteBankAccount(req: DeleteBankAccountRequest) {
    try {
      const validatedReq = deleteBankAccountSchema.parse(req);
      return await this.#api.deleteBankAccount(validatedReq);
    } catch (error) {
      this.handleError(error, "Error deleting bank account");
    }
  }

  /**
   * Lists bank accounts for a Stripe account.
   * @param {ListBankAccountsRequest} req - The request parameters for listing bank accounts.
   * @returns {Promise<any>} A promise that resolves to the list of bank accounts.
   * @throws {Error} If parameter validation fails or if there's an issue with the Stripe API call.
   */
  async listBankAccounts(req: ListBankAccountsRequest) {
    try {
      const validatedReq = listBankAccountsSchema.parse(req);
      return await this.#api.listBankAccounts(validatedReq);
    } catch (error) {
      this.handleError(error, "Error listing bank accounts");
    }
  }

  /**
   * Retrieves details of a Stripe business account.
   * @param {GetStripeAccountRequest} req - The request parameters for getting a Stripe account.
   * @returns {Promise<any>} A promise that resolves to the Stripe account details.
   * @throws {Error} If parameter validation fails or if there's an issue with the Stripe API call.
   */
  async getBusinessAccount(req: GetStripeAccountRequest) {
    try {
      const validatedReq = getStripeAccountSchema.parse(req);
      return await this.#api.getBusinessAccount(validatedReq);
    } catch (error) {
      this.handleError(error, "Error retrieving business account");
    }
  }

  /**
   * Creates an account link for a Stripe Connect account and returns the link details.
   *
   * @param {LinkTokenCreateAndExchangeRequest} req - The request object for creating an account link.
   * @param {string} req.accountId - The ID of the Stripe Connect account for which to create the link.
   * @param {string} req.refreshUrl - The URL the user will be redirected to if the account link expires.
   * @param {string} req.returnUrl - The URL the user will be redirected to after they complete the account link flow.
   * @param {('account_onboarding'|'account_update')} req.type - The type of account link to create.
   *
   * @returns {Promise<LinkTokenCreateAndExchangeResponse>} A promise that resolves to an object containing the account link details.
   * @throws {Error} If parameter validation fails or if there's an issue with the Stripe API call.
   */
  async itemTokenCreateAndExchange(
    req: LinkTokenCreateAndExchangeRequest,
  ): Promise<LinkTokenCreateAndExchangeResponse> {
    try {
      // Validate and parse the input parameters
      const validatedReq = linkTokenCreateAndExchangeSchema.parse(req);

      const { accountId, refreshUrl, returnUrl, type } = validatedReq;

      // Create the account link
      const res = await this.#api.itemTokenCreateAndExchange(req);

      return {
        url: res.url,
        created: res.created,
        expiresAt: res.expiresAt,
        object: res.object,
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Handle validation errors
        const errorMessages = error.errors.map((err) => err.message).join(", ");
        throw new Error(`Invalid parameters: ${errorMessages}`);
      }

      if (error instanceof Stripe.errors.StripeError) {
        // Handle Stripe API errors
        throw new Error(`Stripe API error: ${error.message}`);
      }

      if (error instanceof Error) {
        // Handle other types of errors
        throw new Error(`Error creating account link: ${error.message}`);
      }

      // Handle unknown errors
      throw new Error(
        "An unexpected error occurred while creating the account link",
      );
    }
  }

  /**
   * Handles errors for all methods.
   * @private
   */
  private handleError(error: unknown, message: string): never {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map((err) => err.message).join(", ");
      throw new Error(`Invalid parameters: ${errorMessages}`);
    }
    if (error instanceof Error) {
      throw new Error(`${message}: ${error.message}`);
    }
    throw new Error(`${message}: An unexpected error occurred`);
  }
}
