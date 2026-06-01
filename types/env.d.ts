/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_HOST: string;
  readonly VITE_REDIRECT_URL: string;
  readonly VITE_LINKEDIN_SCOPES: string;
  readonly VITE_LINKEDIN_URL: string;
  readonly VITE_RESPONSE_TYPE: string;
  readonly VITE_CLIENT_ID: string;
  readonly VITE_API: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}







