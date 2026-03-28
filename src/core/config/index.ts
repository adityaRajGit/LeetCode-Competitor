/**
 * Environment Configuration Module
 * 
 * Provides type-safe access to environment variables.
 * All client-side environment variables must be prefixed with VITE_
 */

export const config = {
  app: {
    title: import.meta.env.VITE_APP_TITLE || 'LeetCode Competitor',
    version: import.meta.env.VITE_APP_VERSION || '0.1.0',
  },
  // Add more configuration sections as needed
} as const

export type AppConfig = typeof config
