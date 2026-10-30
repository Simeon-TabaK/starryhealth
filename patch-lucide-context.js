const fs = require('fs');
const path = require('path');

const p = path.join(__dirname, 'node_modules', 'lucide-react', 'dist', 'cjs', 'lucide-react.js');
if (fs.existsSync(p)) {
  let s = fs.readFileSync(p, 'utf8');
  if (s.includes('const LucideContext = react.createContext({});')) {
    s = s.replace(
      'const LucideContext = react.createContext({});',
      'const LucideContext = (react.createContext ? react.createContext({}) : { Provider: ({ children }) => children });'
    );
    fs.writeFileSync(p, s, 'utf8');
    console.log('[PATCH] Patched LucideContext in lucide-react for React 19 RSC');
  }
}
