<template>
  <div id="payjp_dialog"></div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    onCreatedHandler: (payload: any) => {},
    onFailedHandler: (payload: any) => {}
  }>()

  let script: HTMLElement | null | undefined = null

  const runtimeConfig = useRuntimeConfig()

  const dataKey = runtimeConfig.payjpDataKey
  const className="payjp-button"

  onMounted( () => {
    window.payjpCheckoutOnCreated = onCreateToken
    window.payjpCheckoutOnFailed = onCreateTokenFailed
    script = document.createElement('script')
    script.setAttribute('src', 'https://checkout.pay.jp/')
    script.setAttribute('data-on-created', 'payjpCheckoutOnCreated')
    script.setAttribute('data-on-failed', 'payjpCheckoutOnFailed')
    script.setAttribute('data-key', dataKey)
    script.setAttribute('class', className)
    script.setAttribute('data-partial', 'true')
    document.querySelector('#payjp_dialog')?.appendChild(script)
  })
    onBeforeUnmount( () => {
    document.querySelector('#payjp_dialog')?.removeChild(script as Node)
    window.PayjpCheckout = null
    window.payjpCheckoutOnCreated = null
    window.payjpCheckoutOnFailed = null
  })

  const onCreateToken = (response: any) => {
    const payload: any = { token: response.id }
    props.onCreatedHandler(payload)
  }

  const onCreateTokenFailed = (statusCode: any, errorResponse: any ) => {
    const payload = { message: errorResponse.message }
    props.onFailedHandler(payload)
  }
</script>