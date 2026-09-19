import tailwindcss from '@tailwindcss/vite'
import { cn } from 'cn/vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { defineConfig, loadEnv } from 'vite'

const REQUIRED_BUILD_ENV = ['VITE_API_BASE_URL', 'VITE_SOCKET_URL']

// The "@/..." alias is what shadcn's generated components import themselves by,
// so it has to match the "paths" entry in tsconfig.app.json.
export default defineConfig(({ command, mode }) => {
  // A build with either URL missing ships "undefined/sessions" and only fails
  // in the browser, so fail here instead. On Vercel the URLs must also be
  // https://; locally they're http://localhost:3001, which stays allowed.
  if (command === 'build') {
    const env = loadEnv(mode, process.cwd(), 'VITE_')
    for (const key of REQUIRED_BUILD_ENV) {
      const value = env[key]
      if (!value) throw new Error(`${key} must be set for a build`)
      if (process.env.VERCEL && !value.startsWith('https://'))
        throw new Error(`${key} must be https:// (got ${value})`)
    }
  }

  return {
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
  }
})
