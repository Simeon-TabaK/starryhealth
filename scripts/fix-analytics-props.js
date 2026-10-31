const fs = require('fs');

// 1. starryhealth/src/app/dashboard/page.tsx
let pageContent = fs.readFileSync('starryhealth/src/app/dashboard/page.tsx', 'utf8');
if (!pageContent.includes('const tenantAnalytics = await getTenantAnalyticsSummary')) {
  pageContent = pageContent.replace(
    '  return (\r\n    <DashboardClient',
    '  const tenantAnalytics = await getTenantAnalyticsSummary(currentUser.slug || currentUser.username || "default", currentUser.id);\r\n\r\n  return (\r\n    <DashboardClient'
  );
  // Also handle LF if file had LF
  if (!pageContent.includes('const tenantAnalytics = await getTenantAnalyticsSummary')) {
    pageContent = pageContent.replace(
      '  return (\n    <DashboardClient',
      '  const tenantAnalytics = await getTenantAnalyticsSummary(currentUser.slug || currentUser.username || "default", currentUser.id);\n\n  return (\n    <DashboardClient'
    );
  }
  fs.writeFileSync('starryhealth/src/app/dashboard/page.tsx', pageContent, 'utf8');
  console.log('page.tsx updated successfully!');
} else {
  console.log('page.tsx already has tenantAnalytics definition');
}

// 2. starryhealth/src/app/dashboard/dashboard-client.tsx
let dashContent = fs.readFileSync('starryhealth/src/app/dashboard/dashboard-client.tsx', 'utf8');
if (!dashContent.includes('tenantAnalytics?: any;')) {
  dashContent = dashContent.replace(
    '  initialTab?: string;\r\n}',
    '  initialTab?: string;\r\n  tenantAnalytics?: any;\r\n}'
  );
  if (!dashContent.includes('tenantAnalytics?: any;')) {
    dashContent = dashContent.replace(
      '  initialTab?: string;\n}',
      '  initialTab?: string;\n  tenantAnalytics?: any;\n}'
    );
  }
  dashContent = dashContent.replace(
    '  initialTab,\r\n}: DashboardClientProps) {',
    '  initialTab,\r\n  tenantAnalytics,\r\n}: DashboardClientProps) {'
  );
  if (!dashContent.includes('tenantAnalytics,')) {
    dashContent = dashContent.replace(
      '  initialTab,\n}: DashboardClientProps) {',
      '  initialTab,\n  tenantAnalytics,\n}: DashboardClientProps) {'
    );
  }
  fs.writeFileSync('starryhealth/src/app/dashboard/dashboard-client.tsx', dashContent, 'utf8');
  console.log('dashboard-client.tsx updated successfully!');
} else {
  console.log('dashboard-client.tsx already has tenantAnalytics');
}

