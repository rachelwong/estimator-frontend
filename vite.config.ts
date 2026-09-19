import tailwindcss from '@tailwindcss/vite'
import { cn } from 'cn/vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { defineConfig } from 'vite'

// The "@/..." alias is what shadcn's generated components import themselves by,
// so it has to match the "paths" entry in tsconfig.app.json.
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // Compiles src/lib/cnTables.ts: the Tailwind merge tables subset to the
    // class groups this project actually uses. Importing "cn" directly instead
    // ships the full tables, which is 25 KB of the entry chunk. See
    // src/lib/utils.ts for the other half of the wiring.
    cn({ content: ['src/**/*.{ts,tsx}'], out: 'src/lib/cnTables.ts' }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
})
