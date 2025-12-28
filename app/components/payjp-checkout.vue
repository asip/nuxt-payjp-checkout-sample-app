<script setup lang="ts">
  import { onMounted, onBeforeUnmount } from 'vue'

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

  interface PayjpWindow extends Window {
    payjpCheckoutOnCreated: ((response: CheckoutResponse) => void) | null
    payjpCheckoutOnFailed: ((statusCode: number, errorResponse: CheckoutErrorResponse) => void) | null
    PayjpCheckout: any | null
  }
  declare const window: PayjpWindow

  interface PayjpCheckoutPayload {
    token: string
  }

  interface PayjpCheckoutErrorPayload {
    statusCode: number
    message: string
  }

  interface PayjpCheckoutProps {
    dataKey: string,
    dataPartial?: string,
    dataText?: string,
    dataSubmitText?: string,
    dataTokenName?: string,
    dataPreviousToken?: string,
    dataLang?: string,
    dataNamePlaceholder?: string,
    dataTenant?: string,
    onCreatedHandler: (payload: PayjpCheckoutPayload) => void,
    onFailedHandler: (payload: PayjpCheckoutErrorPayload) => void
  }

  let script: HTMLScriptElement | null | undefined = null
  let element: HTMLElement | null  = null

  const props = defineProps<PayjpCheckoutProps>()

  const handleCheckoutCreated = (response: CheckoutResponse) => {
    const payload: PayjpCheckoutPayload = { token: response.id }
    props.onCreatedHandler(payload)
  }

  const handleCheckoutFailed = (statusCode: number, errorResponse: CheckoutErrorResponse ) => {
    const payload: PayjpCheckoutErrorPayload = { statusCode, message: errorResponse.message }
    props.onFailedHandler(payload)
  }

  onMounted( () => {
    window.payjpCheckoutOnCreated = handleCheckoutCreated
    window.payjpCheckoutOnFailed = handleCheckoutFailed

    script = document.createElement('script')
    script.src = 'https://checkout.pay.jp/'
    script.dataset['onCreated'] = 'payjpCheckoutOnCreated'
    script.dataset['onFailed'] = 'payjpCheckoutOnFailed'
    script.dataset['key'] = props.dataKey
    script.dataset['partial'] = props.dataPartial || 'false'
    if (props.dataText) script.dataset['text'] = props.dataText
    if (props.dataSubmitText) script.dataset['submitText'] = props.dataSubmitText
    if (props.dataTokenName) script.dataset['tokenName'] = props.dataTokenName
    if (props.dataPreviousToken) script.dataset['previousToken'] = props.dataPreviousToken
    if (props.dataLang) script.dataset['lang'] = props.dataLang
    if (props.dataNamePlaceholder) script.dataset['namePlaceholder'] = props.dataNamePlaceholder
    if (props.dataTenant) script.dataset['tenant'] = props.dataTenant
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
</script>

<template>
  <div id="payjp_dialog"></div>
</template>
