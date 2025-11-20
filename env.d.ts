declare namespace NodeJS {
  interface ProcessEnv {
    SERVER_ORIGIN?: string;
    NEXT_PUBLIC_SITE_URL?: string;
    NODE_ENV?: 'development' | 'production' | '';
  }
}
