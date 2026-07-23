/*
 * Public API Surface of auth
 */

// ─── Entry / Config ──────────────────────────────────────────────────────────
export * from './lib/auth';

// ─── Abstract ────────────────────────────────────────────────────────────────
export * from './lib/abstract/auth.abstract';

// ─── Services ────────────────────────────────────────────────────────────────
export * from './lib/services/auth.service';
export * from './lib/adapter/auth-adapter.service';

// ─── Models — Requests ───────────────────────────────────────────────────────
export * from './lib/models/requests/index';

// ─── Models — Responses ──────────────────────────────────────────────────────
export * from './lib/models/responses/auth.response';
export * from './lib/models/responses/auth-user.response';
export * from './lib/models/responses/otp.response';
export * from './lib/models/responses/message.response';
export * from './lib/models/responses/forgot-password.response';

// ─── Models — Enums ──────────────────────────────────────────────────────────
export * from './lib/models/enums/role.enum';

// ─── Tokens ──────────────────────────────────────────────────────────────────
export * from './lib/tokens/api-url.token';

// ─── Interfaces ──────────────────────────────────────────────────────────────
export * from './lib/interfaces/adaptor.interface';

// ─── Utils ───────────────────────────────────────────────────────────────────
export * from './lib/utils/password.validator';

// ─── API ─────────────────────────────────────────────────────────────────────
export * from './lib/api/auth-api';
