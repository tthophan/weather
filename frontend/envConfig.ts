import { loadEnvConfig } from "@next/env";

const projectDir = process.cwd();
loadEnvConfig(projectDir);

export default {
  environment: process.env.NEXT_PUBLIC_ENVIRONMENT,
  apiUrl: process.env.NEXT_PUBLIC_API_URL,
};
