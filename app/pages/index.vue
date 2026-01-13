<script setup lang="ts">
import type { PayjpCheckoutErrorPayload, PayjpCheckoutPayload } from '~/components/payjp-checkout.vue'

  const runtimeConfig = useRuntimeConfig()

  const dataKey = runtimeConfig.public.payjpDataKey

  const onCreated = (payload: PayjpCheckoutPayload) => {
    console.log(payload.token)
  }

  const onFailed = (payload: PayjpCheckoutErrorPayload) => {
    console.log(payload.message)
  }
</script>

<template>
  <PayjpCheckout
    :dataKey="dataKey"
    dataPartial="true"
    :onCreatedHandler="onCreated"
    :onFailedHandler="onFailed" />
</template>
