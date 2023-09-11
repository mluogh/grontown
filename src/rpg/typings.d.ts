/// <reference types="node" />

declare namespace NodeJS {
  interface ProcessEnv {
    readonly GOOGLE_ANALYTICS_ID: string;
    readonly NODE_ENV: "development" | "production";
    readonly EASTWORLD_API_URL: string;
    readonly URL: string;
    readonly VERSION: string;
  }
}
