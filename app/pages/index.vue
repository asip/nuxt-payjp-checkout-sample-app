<template>
  <PayjpCheckout
    :dataKey="dataKey"
    dataPartial="true"
    :onCreatedHandler="onCreated"
    :onFailedHandler="onFailed" />
</template>

<script setup lang="ts">
  const runtimeConfig = useRuntimeConfig()

  const dataKey = runtimeConfig.public.payjpDataKey

  const onCreated = (payload: any) => {
    console.log(payload.token)
  }

  const onFailed = (payload: any) => {
    console.log(payload.message)
  }
</script>