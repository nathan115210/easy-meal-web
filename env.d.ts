declare module '*.scss' {
  const content: Record<string, string>;
  export default content;
}

declare namespace NodeJS {
  interface ProcessEnv {
    SERVER_ORIGIN?: string;
    NEXT_PUBLIC_SITE_URL?: string;
    NODE_ENV?: 'development' | 'production' | '';
  }
}
