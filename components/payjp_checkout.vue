<template>
  <div id="payjp_dialog"></div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    dataKey: string,
    onCreatedHandler: (payload: any) => {},
    onFailedHandler: (payload: any) => {}
  }>()

  let script: HTMLScriptElement | null | undefined = null
  let element: HTMLElement | null  = null

  onMounted( () => {
    window.payjpCheckoutOnCreated = onCreateToken
    window.payjpCheckoutOnFailed = onCreateTokenFailed
    script = document.createElement('script')
    script.src = 'https://checkout.pay.jp/'
    script.dataset['onCreated'] = 'payjpCheckoutOnCreated'
    script.dataset['onFailed'] = 'payjpCheckoutOnFailed'
    script.dataset['key'] = props.dataKey
    script.classList.add('payjp-button')
    script.dataset['partial'] = 'true'
    element = document.querySelector('#payjp_dialog')
    element?.appendChild(script)
  })

  onBeforeUnmount( () => {
    element?.removeChild(script as Node)
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