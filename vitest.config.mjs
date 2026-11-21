export default {
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    reporters: ['default'],
    alias: {
      '@': new URL('.', import.meta.url).pathname.replace('vitest.config.mjs', '.'),
    },
  },
};