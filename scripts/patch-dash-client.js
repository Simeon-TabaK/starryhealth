const fs = require('fs');
let c = fs.readFileSync('starryhealth/src/app/dashboard/dashboard-client.tsx', 'utf8');

if (!c.includes('tenantAnalytics?: any;')) {
  c = c.replace(
    '  initialTab?: string;\r\n}',
    '  initialTab?: string;\r\n  tenantAnalytics?: any;\r\n}'
  );
  c = c.replace(
    '  initialTab,\r\n}: DashboardClientProps) {',
    '  initialTab,\r\n  tenantAnalytics,\r\n}: DashboardClientProps) {'
  );
  c = c.replace(
    '            onNotify={(msg, type, desc) => showToast(msg, (type as any) || "success", desc)}',
    '            onNotify={(msg, type, desc) => showToast(msg, (type as any) || "success", desc)}\r\n            tenantAnalytics={tenantAnalytics}'
  );
  fs.writeFileSync('starryhealth/src/app/dashboard/dashboard-client.tsx', c, 'utf8');
  console.log('Successfully updated dashboard-client.tsx with tenantAnalytics!');
} else {
  console.log('Already updated');
}

