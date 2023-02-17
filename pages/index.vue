<template>
  <PayjpCheckout :onCreatedHandler="onCreated" :onFailedHandler="onFailed" />
</template>

<script setup lang="ts">
  const onCreated = (payload: any) => {
    console.log(payload.token)
  }

  const onFailed = (payload: any) => {
    console.log(payload.message)
  }
</script>