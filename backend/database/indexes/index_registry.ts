/**
 * Declarative Index Registry for Digital Twin AI Database Layer.
 * Documents all Equality-Sort-Range (ESR) indexes, Unique constraints, and Time-To-Live (TTL) indexes
 * deployed across MongoDB Atlas collections.
 */
export interface IndexSpecification {
  collection: string;
  name: string;
  fields: Record<string, 1 | -1 | 'text' | '2dsphere'>;
  options: {
    unique?: boolean;
    expireAfterSeconds?: number;
    background?: boolean;
    partialFilterExpression?: Record<string, any>;
  };
  esrRationale: string;
}

export const indexRegistry: IndexSpecification[] = [
  {
    collection: 'users',
    name: 'email_1',
    fields: { email: 1 },
    options: { unique: true, background: true },
    esrRationale: 'Equality lookup for user authentication and identity verification.',
  },
  {
    collection: 'users',
    name: 'idx_users_goal_deadline',
    fields: { 'active_goals.category': 1, 'active_goals.target_date': 1 },
    options: { background: true },
    esrRationale: 'Equality on goal category, Sort/Range on deadline date for notification engine.',
  },
  {
    collection: 'financial_records',
    name: 'idx_finance_user_date',
    fields: { user_id: 1, transaction_date: -1 },
    options: { background: true },
    esrRationale: 'Equality on user_id, Sort on transaction_date descending for dashboard ledger.',
  },
  {
    collection: 'financial_records',
    name: 'idx_finance_user_cat_date',
    fields: { user_id: 1, category: 1, transaction_date: -1 },
    options: { background: true },
    esrRationale: 'Equality on user_id + category, Sort on transaction_date for spending breakdown donut chart.',
  },
  {
    collection: 'study_activities',
    name: 'idx_study_user_subj_date',
    fields: { user_id: 1, subject: 1, session_date: -1 },
    options: { background: true },
    esrRationale: 'Equality on user_id + subject, Sort on session_date for academic mark prediction regression.',
  },
  {
    collection: 'habit_tracking',
    name: 'idx_habit_user_date_unique',
    fields: { user_id: 1, log_date: 1 },
    options: { unique: true, background: true },
    esrRationale: 'CRITICAL UNIQUE INDEX: Enforces exactly 1 biometric habit check-in per user per calendar day.',
  },
  {
    collection: 'simulations',
    name: 'idx_sim_user_domain_date',
    fields: { user_id: 1, domain: 1, generated_at: -1 },
    options: { background: true },
    esrRationale: 'Equality on user_id + domain, Sort on generated_at for What-If history retrieval.',
  },
  {
    collection: 'recommendations',
    name: 'idx_rec_action_center',
    fields: { user_id: 1, status: 1, priority: 1, generated_at: -1 },
    options: { background: true },
    esrRationale: 'Equality on user_id + status (UNREAD), Sort on priority + generated_at for Action Center feed.',
  },
  {
    collection: 'chat_history',
    name: 'idx_chat_user_last_msg',
    fields: { user_id: 1, last_message_at: -1 },
    options: { background: true },
    esrRationale: 'Equality on user_id, Sort on last_message_at for conversation sidebar ordering.',
  },
  {
    collection: 'analytics_logs',
    name: 'idx_analytics_ttl_90d',
    fields: { timestamp: 1 },
    options: { expireAfterSeconds: 7776000, background: true },
    esrRationale: 'AUTOMATIC TTL INDEX: Purges system telemetry and error logs older than 90 days.',
  },
  {
    collection: 'dashboard_cache',
    name: 'idx_cache_ttl_15m',
    fields: { generated_at: 1 },
    options: { expireAfterSeconds: 900, background: true },
    esrRationale: 'AUTOMATIC TTL INDEX: Purges ephemeral UI aggregation payloads after 15 minutes.',
  },
  {
    collection: 'dashboard_cache',
    name: 'idx_cache_user_key_unique',
    fields: { user_id: 1, cache_key: 1 },
    options: { unique: true, background: true },
    esrRationale: 'Enforces 1 active cache entry per user per dashboard widget key.',
  },
];
