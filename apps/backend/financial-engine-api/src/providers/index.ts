import { logger } from "@/utils/logger";
import { withRetry } from "@/utils/retry";
import { GoCardLessProvider } from "./gocardless/gocardless-provider";
import { PlaidProvider } from "./plaid/plaid-provider";
import { StripeProvider } from "./stripe/stripe-provider";
import { TellerProvider } from "./teller/teller-provider";
import type {
  DeleteAccountsRequest,
  GetAccountBalanceRequest,
  GetAccountsRequest,
  GetHealthCheckResponse,
  GetInstitutionsRequest,
  GetTransactionsRequest,
  ProviderParams,
} from "./types";

export class Provider {
  #provider:
    | PlaidProvider
    | TellerProvider
    | GoCardLessProvider
    | StripeProvider
    | null = null;

  constructor(params?: ProviderParams) {
    switch (params?.provider) {
      case "gocardless":
        this.#provider = new GoCardLessProvider(params);
        break;
      case "teller":
        this.#provider = new TellerProvider(params);
        break;
      case "plaid":
        this.#provider = new PlaidProvider(params);
        break;
      case "stripe":
        this.#provider = new StripeProvider(params);
        break;
      default:
    }
  }

  async getHealthCheck(
    params: Omit<ProviderParams, "provider">,
  ): Promise<GetHealthCheckResponse> {
    const teller = new TellerProvider(params);
    const plaid = new PlaidProvider(params);
    const gocardless = new GoCardLessProvider(params);
    const stripe = new StripeProvider(params);

    try {
      const [
        isPlaidHealthy,
        isGocardlessHealthy,
        isTellerHealthy,
        isStripeHealthy,
      ] = await Promise.all([
        plaid.getHealthCheck(),
        gocardless.getHealthCheck(),
        teller.getHealthCheck(),
        stripe.getHealthCheck(),
      ]);

      return {
        plaid: {
          healthy: isPlaidHealthy,
        },
        gocardless: {
          healthy: isGocardlessHealthy,
        },
        teller: {
          healthy: isTellerHealthy,
        },
        stripe: {
          healthy: isStripeHealthy,
        },
      };
    } catch {
      throw Error("Something went wrong");
    }
  }

  async getTransactions(params: GetTransactionsRequest) {
    logger(
      "getTransactions:",
      `provider: ${this.#provider} id: ${params.accountId}`,
    );

    const data = await withRetry(() => this.#provider?.getTransactions(params));

    if (data) {
      return data;
    }

    return [];
  }

  async getAccounts(params: GetAccountsRequest) {
    logger("getAccounts:", `provider: ${this.#provider}`);

    const data = await withRetry(() => this.#provider?.getAccounts(params));

    if (data) {
      return data;
    }

    return [];
  }

  async getAccountBalance(params: GetAccountBalanceRequest) {
    logger(
      "getAccountBalance:",
      `provider: ${this.#provider} id: ${params.accountId}`,
    );

    const data = await withRetry(() =>
      this.#provider?.getAccountBalance(params),
    );

    if (data) {
      return data;
    }

    return null;
  }

  async getInstitutions(params: GetInstitutionsRequest) {
    logger("getInstitutions:", `provider: ${this.#provider}`);

    const data = await withRetry(() => this.#provider?.getInstitutions(params));

    if (data) {
      return data;
    }

    return [];
  }

  async deleteAccounts(params: DeleteAccountsRequest) {
    logger("delete:", `provider: ${this.#provider}`);

    return withRetry(() => this.#provider?.deleteAccounts(params));
  }
}
