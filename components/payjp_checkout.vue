<template>
  <div id="payjp_dialog"></div>
</template>

<script setup lang="ts">
  import { onMounted, onBeforeUnmount } from 'vue'

  interface Window {
    payjpCheckoutOnCreated: ((response: any) => void) | null
    payjpCheckoutOnFailed: ((statusCode: any, errorResponse: any) => void) | null
    PayjpCheckout: any | null
  }

  declare var window: Window

  interface CheckoutResponse {
    // card: any
    // created: number
    id: string
    // livemode: boolean
    // object: string
    // used: boolean
  }

  interface CheckoutErrorResponse {
    // code: string
    message: string
    // status: number // http (response) status code
    // type: string
  }

  interface PayjpCheckoutPayload {
    token: string
  }

  interface PayjpCheckoutErrorPayload {
    statusCode: number
    message: string
  }

  const props = defineProps<{
    dataKey: string,
    dataPartial?: string,
    dataText?: string,
    dataSubmitText?: string,
    dataTokenName?: string,
    dataPreviousToken?: string,
    dataLang?: string,
    dataNamePlaceholder?: string,
    dataTenant?: string,
    onCreatedHandler: (payload: any) => void,
    onFailedHandler: (payload: any) => void
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
    props.dataPartial ? (script.dataset['partial'] = props.dataPartial) : (script.dataset['partial'] = 'false')
    props.dataText && (script.dataset['text'] = props.dataText)
    props.dataSubmitText && (script.dataset['submitText'] = props.dataSubmitText)
    props.dataTokenName && (script.dataset['tokenName'] = props.dataTokenName)
    props.dataPreviousToken && (script.dataset['previousToken'] = props.dataPreviousToken)
    props.dataLang && (script.dataset['lang'] = props.dataLang)
    props.dataNamePlaceholder && (script.dataset['namePlaceholder'] = props.dataNamePlaceholder)
    props.dataTenant && (script.dataset['tenant'] = props.dataTenant)
    script.classList.add('payjp-button')

    element = document.querySelector('#payjp_dialog')
    element?.appendChild(script)
  })

  onBeforeUnmount( () => {
    element?.removeChild(script as Node)
    window.payjpCheckoutOnCreated = null
    window.payjpCheckoutOnFailed = null
    window.PayjpCheckout = null
  })

  const onCreateToken = (response: CheckoutResponse) => {
    const payload: PayjpCheckoutPayload = { token: response.id }
    props.onCreatedHandler(payload)
  }

  const onCreateTokenFailed = (statusCode: number, errorResponse: CheckoutErrorResponse ) => {
    const payload: PayjpCheckoutErrorPayload = { statusCode, message: errorResponse.message }
    props.onFailedHandler(payload)
  }
</script>