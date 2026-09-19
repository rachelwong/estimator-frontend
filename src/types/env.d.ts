// Types the VITE_* vars this app reads. Without it they resolve through
// vite/client's index signature and come back as `any`.

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_SOCKET_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
