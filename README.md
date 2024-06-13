# Vue Bottom Sheet <a href="https://www.typescriptlang.org/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg" alt="typescript" width="30" height="30"/> </a>

Preview

![Example](https://github.com/Nosa-Drexx/vue-bottom-sheet/assets/96873980/a3605f4d-7805-45b5-a033-2ea8abbf9512)

## Fork from [@nosadev/vue-bottom-sheet](https://www.npmjs.com/package/@nosadev/vue-bottom-sheet)

![Size](https://img.shields.io/bundlephobia/minzip/@nosadev/vue-bottom-sheet)
![Downloads](https://img.shields.io/npm/dt/@nosadev/vue-bottom-sheet)
![Version](https://img.shields.io/npm/v/@nosadev/vue-bottom-sheet)

A nice clean and touch-friendly bottom sheet component based on [Vue.js](https://vuejs.org/) and [Typescript](https://www.typescriptlang.org/) for Vue 3

<!-- -  [Demo]() -->

## Installation

### NPM

```
npm install @nosadev/vue-bottom-sheet
```

### Yarn

```
yarn add @nosadev/vue-bottom-sheet
```

## Usage `setup` + TS

```vue
<script setup>
import { BottomSheet } from '@nosadev/vue-bottom-sheet'
import { ref } from 'vue'

const showSheet = ref<boolean>(false)

const closeSheet = () => {
  showSheet.value = false
}
const showSheetFn = () => {
  showSheet.value = true
}
</script>

<template>
  <button @click="showSheetFn"> Show Sheet</button>
  <bottom-sheet :showSheet="showSheet" :onClose="closeSheet">
    <div>
      <h1>Hello World</h1>
      <span>Vue 3<span>
    </div>
  </bottom-sheet>
</template>

```

## Usage `Options API` + TS

```vue
<script lang="ts">
import { defineComponent } from 'vue'
import { BottomSheet } from '@nosadev/vue-bottom-sheet'

export default defineComponent({
  components: {
    BottomSheet
  },
  data: () => ({
    showSheet: false
  }),

  methods: {
    hideSheet() {
      this.showSheet = false
    }
  }
})
</script>

<template>
  <main>
    <button @click="showSheet = true">Show sheet</button>
    <BottomSheet :showSheet="showSheet" :onClose="hideSheet" />
  </main>
</template>
```

## Usage in Nuxt 3

For Nuxt 3, wrap component in `<client-only>`

```vue
<template>
  <client-only>
    <button @click="showSheet = true">Show sheet</button>
    <bottom-sheet :showSheet="showSheet" :onClose="hideSheet">
      <h1>Hello World</h1>
      <span>Vue 3<span>
    </bottom-sheet>
  </client-only>
</template>
```

## Props

| Prop                 | Type     | Description                                                                                                                                                                     | Example                                          | Defaults             |
| -------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ | -------------------- |
| showSheet            | Boolean  | Set to true or flase to show or hide the bottom sheet                                                                                                                           | `:showSheet="()=> showSheet = true"`             | false                |
| id                   | String   | Sets custom `data-id` property to customize styles on all layers of the bottom sheet - overide in global style e.g `[data-id='nosa-content'] {background: #f9dde0 !important;}` | `:id="nosa"`                                     | -                    |
| maxHeight            | Number   | Sets the maximum height in `percentage` of the component card with a `maximum` value of `100` and a `minimum` value of `10`                                                     | `:max-width="80"`                                | 80                   |
| maxWidth             | Number   | Sets the maximum width of the component card in `pixels`                                                                                                                        | `:max-height="90"`                               | 576                  |
| onClose              | Function | A Fuction that runs when a supposed close action is triggered (like swapping down or clicking the overlay) close                                                                | `:onClose="()=> showSheet = false"`              | ()=>{}               |
| useDragEffect        | Boolean  | Enables drag / swap effet                                                                                                                                                       | `:useDragEffect="false"`                         | true                 |
| useOnlyHeaderForDrag | Boolean  | Enables drag / swap effet only when user drags the header of the component card                                                                                                 | `:useOnlyHeaderForDrag="true"`                   | false                |
| dragSpeed            | Number   | Sets the Transition animation duartion with a `maximum` value of `10` and a `minimum` value of `1`                                                                              | `dragSpeed="5"`                                  | 3                    |
| background           | String   | Sets component card background                                                                                                                                                  | `:background="#f9dde0"`                          | 'white'              |
| overlayBackground    | String   | Sets overlay background                                                                                                                                                         | `:overlayBackground="transparent"`               | 'rgba(0, 0, 0, 0.5)' |
| topRadius            | Number   | Sets component card top radius value in `pixels`                                                                                                                                | `:topRadius="0"`                                 | '20'                 |
| headerPadding        | Number   | Sets padding for header of component card in `pixels`                                                                                                                           | `:headerPadding="16"`                            | 32                   |
| onSwipeDown          | Function | A Function that runs after Swipe down of component card is complete                                                                                                             | `:onSwipeDown="()=> console.log('siwped down')"` | ()=> {}              |
| closeWithOverlay     | Boolean  | Allows close of bottom sheet with overlay or not                                                                                                                                | `:closeWithOverlay="false"`                      | true                 |

## Events

| Event        | Description                                          | Example          | Returns                                                    |
| ------------ | ---------------------------------------------------- | ---------------- | ---------------------------------------------------------- |
| dragging     | Fire when card component is been dragged             | @dragging=""     | `{event: MouseEvent or TouchEvent, contentHeight: number}` |
| release-drag | Fire when card component is release after drag event | @release-drag="" | `{event: MouseEvent or TouchEvent, contentHeight: number}` |
| opened       | Fire while card component is opened                  | @opened=""       | `true `                                                    |
| closed       | Fire while card component is closed                  | @closed=""       | `true`                                                     |

## Slots

You can use this named slots:

```vue
<template>
  <vue-bottom-sheet ref="myBottomSheet">
    <template #header>
      <span> vue3---vue3 </span>
    </template>
    <template>
      <h2>Vue3 Bottom Sheet 🚀</h2>
    </template>
  </vue-bottom-sheet>
</template>
```
