// Re-export from the unified tenant module for backwards compatibility
export { getCurrentTenant, getTenantContext } from "./tenant";
export type { TenantContext, TenantUser, TenantConfig } from "./tenant";
