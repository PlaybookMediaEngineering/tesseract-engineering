import type { ColumnType } from "kysely";

import type { NotificationType, Status, SubscriptionPlan } from "./enums";

export type Generated<T> =
  T extends ColumnType<infer S, infer I, infer U>
    ? ColumnType<S, I | undefined, U>
    : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export type Account = {
  id: string;
  userId: string;
  type: string;
  provider: string;
  providerAccountId: string;
  refresh_token: string | null;
  access_token: string | null;
  expires_at: number | null;
  token_type: string | null;
  scope: string | null;
  id_token: string | null;
  session_state: string | null;
  created_at: Generated<Timestamp>;
  updated_at: Generated<Timestamp>;
};
export type Channel = {
  id: string;
  name: string;
  projectId: string;
  createdAt: Generated<Timestamp>;
};
export type Customer = {
  id: string;
  projectId: string;
  userId: string;
  name: string | null;
  email: string | null;
  createdAt: Generated<Timestamp>;
};
export type Event = {
  id: string;
  name: string;
  channelId: string;
  userId: string;
  customerId: string | null;
  icon: string;
  notify: boolean;
  tags: unknown;
  createdAt: Generated<Timestamp>;
};
export type K8sClusterConfig = {
  id: Generated<number>;
  name: string;
  location: string;
  authUserId: string;
  plan: Generated<SubscriptionPlan | null>;
  network: string | null;
  createdAt: Generated<Timestamp>;
  updatedAt: Generated<Timestamp>;
  status: Generated<Status | null>;
  delete: Generated<boolean | null>;
};
export type Metrics = {
  id: string;
  projectId: string;
  logsUsed: Generated<number>;
  logsLimit: Generated<number>;
  channelsUsed: Generated<number>;
  channelsLimit: Generated<number>;
  seatsUsed: Generated<number>;
  projectsUsed: Generated<number>;
};
export type NotificationSetting = {
  id: string;
  userId: string;
  type: Generated<NotificationType>;
  details: unknown;
  enabled: Generated<boolean>;
  createdAt: Generated<Timestamp>;
};
export type Project = {
  id: string;
  name: string;
  userId: string;
  createdAt: Generated<Timestamp>;
};
export type Session = {
  id: string;
  sessionToken: string;
  userId: string;
  expires: Timestamp;
};
export type User = {
  id: string;
  name: string | null;
  email: string | null;
  emailVerified: Timestamp | null;
  apiKey: string | null;
  plan: Generated<string>;
  credits: Generated<number>;
  image: string | null;
  language: Generated<string | null>;
  onboardingEmailSent: Generated<boolean>;
  created_at: Generated<Timestamp>;
  updated_at: Generated<Timestamp>;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  stripe_price_id: string | null;
  stripe_current_period_end: Timestamp | null;
};
export type VerificationToken = {
  identifier: string;
  token: string;
  expires: Timestamp;
};
export type DB = {
  accounts: Account;
  channels: Channel;
  customers: Customer;
  events: Event;
  K8sClusterConfig: K8sClusterConfig;
  metrics: Metrics;
  notification_settings: NotificationSetting;
  projects: Project;
  sessions: Session;
  users: User;
  verification_tokens: VerificationToken;
};
