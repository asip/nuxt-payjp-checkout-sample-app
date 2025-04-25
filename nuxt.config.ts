// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: true,

  runtimeConfig: {
    public: {
      payjpDataKey: '',
    }
  },

  compatibilityDate: "2025-04-26"
})