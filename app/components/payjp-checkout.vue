<script setup lang="ts">
  import { onMounted, onBeforeUnmount, useId } from 'vue'

  interface PayjpCheckoutResponse {
    // card: any
    // created: number
    id: string
    // livemode: boolean
    // object: string
    // used: boolean
  }

  interface PayjpCheckoutErrorResponse {
    // code: string
    message: string
    // status: number // http (response) status code
    // type: string
  }

  interface PayjpWindow extends Window {
    payjpCheckoutOnCreated: ((response: PayjpCheckoutResponse) => void) | null
    payjpCheckoutOnFailed: ((statusCode: number, errorResponse: PayjpCheckoutErrorResponse) => void) | null
    PayjpCheckout: unknown | null
  }
  declare const window: PayjpWindow

  export interface PayjpCheckoutPayload {
    token: string
  }

  export interface PayjpCheckoutErrorPayload {
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

  const payjpCheckoutId = useId()

  const handleCheckoutCreated = (response: PayjpCheckoutResponse) => {
    const payload: PayjpCheckoutPayload = { token: response.id }
    props.onCreatedHandler(payload)
  }

  const handleCheckoutFailed = (statusCode: number, errorResponse: PayjpCheckoutErrorResponse ) => {
    const payload: PayjpCheckoutErrorPayload = { statusCode, message: errorResponse.message }
    props.onFailedHandler(payload)
  }

  onMounted( () => {
    window.payjpCheckoutOnCreated = handleCheckoutCreated
    window.payjpCheckoutOnFailed = handleCheckoutFailed
    /*
    PAY.JP の checkout から呼ばれる window.alert を無効化
    // カード情報が不正のときに window.alert が payjp の checkout から呼ばれるため
    window.alert = () => {}
    */

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

    element = document.querySelector(`#${payjpCheckoutId}`)
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
  <div :id="payjpCheckoutId"></div>
</template>
