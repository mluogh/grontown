/// <reference types="node" />

declare namespace NodeJS {
  interface ProcessEnv {
    readonly REACT_APP_GOOGLE_ANALYTICS_ID: string;
    readonly NODE_ENV: "development" | "production";
    readonly URL: string;
    readonly VERSION: string;
  }
}
