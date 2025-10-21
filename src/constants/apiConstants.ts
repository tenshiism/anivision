import { APIConfig } from '@types/api';

export const DEFAULT_API_CONFIG: APIConfig = {
  url: 'https://api.openai.com/v1/chat/completions',
  apiKey: '',
  model: 'gpt-4o',
  maxTokens: 500,
  temperature: 0.1,
  timeout: 30000,
};

export const API_ENDPOINTS = {
  CHAT_COMPLETIONS: '/chat/completions',
  MODELS: '/models',
};

export const RETRY_CONFIG = {
  MAX_RETRIES: 3,
  BASE_DELAY: 1000,
  MAX_DELAY: 10000,
};

export const CIRCUIT_BREAKER_CONFIG = {
  THRESHOLD: 5,
  TIMEOUT: 60000,
};
