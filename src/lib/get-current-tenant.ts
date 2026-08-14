import { headers } from "next/headers";
import { getTenantContext, TenantContext } from "./tenant";

export async function getCurrentTenant(searchParamSlug?: string): Promise<TenantContext> {
  if (searchParamSlug) {
    return getTenantContext(searchParamSlug);
  }

  const headerList = await headers();
  const tenantSlug = headerList.get("x-tenant-slug");

  return getTenantContext(tenantSlug);
}
