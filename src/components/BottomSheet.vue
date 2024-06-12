<script lang="ts">
import { type PropType, defineComponent } from 'vue'
import type { DataType, DraggingPayload } from '@/global'
import { isMouseEvent, isTouchEvent } from '@/utils'

export default defineComponent({
  inheritAttrs: false,
  emits: {
    ['dragging']: (payload: DraggingPayload) => payload,
    ['release-drag']: (payload: DraggingPayload) => payload,
    ['opened']: (value: true) => value,
    ['closed']: (value: true) => value
  },
  props: {
    showSheet: { type: Boolean as PropType<boolean>, default: false },
    maxHeight: {
      type: Number as PropType<number>,
      default: 80,
      validator(val: number) {
        return val >= 10 && val <= 100
      }
    },
    maxWidth: {
      type: Number as PropType<number>,
      default: 576
    },
    onClose: { type: Function as PropType<(...val: any) => void>, default: () => {} },
    closeWithOverlay: {
      type: Boolean as PropType<boolean>,
      default: true
    },
    useDragEffect: {
      type: Boolean as PropType<boolean>,
      default: true
    },
    dragSpeed: {
      type: Number as PropType<number>,
      default: 3,
      validator(val: number) {
        return val >= 1 && val <= 10
      }
    },
    background: {
      type: String as PropType<string>,
      default: 'white'
    },
    overlayBackground: {
      type: String as PropType<string>,
      default: 'rgba(0, 0, 0, 0.5)'
    },
    topRadius: {
      type: Number as PropType<number>,
      default: 20
    },
    headerPadding: {
      type: Number as PropType<number>,
      default: 32
    },
    onSwipeDown: { type: Function as PropType<(...val: any) => void>, default: () => {} }
  },
  data(): DataType {
    return {
      hidePopUp: true,
      startX: 0,
      startY: 0,
      endX: 0,
      endY: 0,
      isSwiping: false,
      currentHeight: 0,
      maxHeightInPx: 0
    }
  },
  mounted() {
    this.currentHeight = Math.min(100, Math.max(10, this.maxHeight))
  },
  watch: {
    showSheet() {
      if (this.showSheet) {
        document.body.style.overflow = 'hidden'
        this.currentHeight = this.maxHeight
        this.hidePopUp = false
      } else {
        this.currentHeight = 0
        setTimeout(() => {
          this.hidePopUp = true
          document.body.style.overflow = 'unset'
          this.$emit('closed', true)
        }, this.dragSpeed * 100)
      }
    },
    hidePopUp() {
      if (!this.hidePopUp) {
        //this.nexttick helps to wait fot the dom to update before performming action in the callback
        this.$nextTick(() => {
          const contentElem = this.$refs.content as HTMLDivElement
          this.$emit('opened', true)
          if (contentElem) {
            //get equivalent height of content in pixels
            this.maxHeightInPx = contentElem.clientHeight
          }
        })
      }
    }
  },
  methods: {
    parentClicked(e: MouseEvent) {
      e.stopPropagation()
      if (!this.closeWithOverlay) return
      const parentElement = e.target as HTMLDivElement
      parentElement === this.$refs.contentPopUp && this.onClose()
    },
    handleStart(event: MouseEvent | TouchEvent) {
      if (this.useDragEffect) this.isSwiping = true

      if (isMouseEvent(event) && event.type === 'mousedown') {
        this.startY = event.clientY
      } else if (isTouchEvent(event) && event.type === 'touchstart') {
        this.startY = event.touches[0].clientY
      }
    },

    handleMove(event: MouseEvent | TouchEvent) {
      if (!this.isSwiping) return
      let currentY = 0
      const contentElem = this.$refs.content as HTMLDivElement
      //remove transition for smooth draging
      if (contentElem) {
        contentElem.style.transition = 'unset'
      }

      if (isMouseEvent(event) && event.type === 'mousemove') {
        currentY = event.clientY
      } else if (isTouchEvent(event) && event.type === 'touchmove') {
        currentY = event.touches[0].clientY
      }

      const deltaY = currentY - this.startY

      const newHeight = this.maxHeightInPx - deltaY
      if (newHeight >= 0 && newHeight <= this.maxHeightInPx) {
        this.$emit('dragging', { event: event, contentHeight: newHeight })
        const reducedCalInpercentage = 100 - (newHeight * 100) / this.maxHeightInPx
        this.currentHeight = this.maxHeight - reducedCalInpercentage
      }
    },

    handleEnd(event: MouseEvent | TouchEvent) {
      if (!this.isSwiping) return
      const contentElem = this.$refs.content as HTMLDivElement

      //add transition back when user relase their mouse or touch for animation effect
      if (contentElem) {
        contentElem.style.transition = `max-height ${this.dragSpeed / 10}s ease-in-out`
      }
      this.isSwiping = false

      this.isSwiping = false

      const heightReduction = this.maxHeight - this.currentHeight
      const reductionPercentage = (heightReduction / this.maxHeight) * 100

      this.$emit('release-drag', { event, contentHeight: this.currentHeight })

      if (reductionPercentage >= 40) {
        this.onClose()
        this.onSwipeDown()
      } else {
        this.currentHeight = this.maxHeight
      }
    }
  }
})
</script>

<template>
  <div
    class="w-100 bottom-sheet-pop-up-container"
    ref="contentPopUp"
    @click="parentClicked"
    v-if="!hidePopUp"
    @mouseup="handleEnd"
    @touchend="handleEnd"
    :style="{ '--overlay-bg': overlayBackground || 'rgba(0, 0, 0, 0.5)' }"
  >
    <div
      class="bottom-sheet-content"
      ref="content"
      :style="{
        maxHeight: `${currentHeight}%`,
        maxWidth: `${maxWidth}px`,
        '--transition-animation-duration': `${dragSpeed / 10 ? (dragSpeed / 10).toFixed(1) : 2}s`,
        '--background': background ? background : 'white',
        '--top-radius': `${topRadius}px`,
        '--dragPosPadding': `${headerPadding}px`
      }"
    >
      <div
        class="bottom-sheet-swipe-down"
        @mousedown="handleStart"
        @mousemove="handleMove"
        @touchstart="handleStart"
        @touchmove="handleMove"
      >
        <slot name="header">
          <span class="bottom-sheet-drag-indicator"></span>
        </slot>
      </div>
      <div class="bottom-sheet-content-container">
        <slot>
          <div
            class="w-100"
            :style="{
              height: '100%',
              background: background ? background : 'white',
              padding: '0rem 1rem'
            }"
          >
            <h1>Vue3 Bottom Sheet 🚀</h1>
            <div>
              What is Lorem Ipsum? Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text ever since the
              1500s, when an unknown printer took a galley of type and scrambled it to make a type
              specimen book. It has survived not only five centuries, but also the leap into
              electronic typesetting, remaining essentially unchanged. It was popularised in the
              1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more
              recently with desktop publishing software like Aldus PageMaker including versions of
              Lorem Ipsum. Why do we use it? It is a long established fact that a reader will be
              distracted by the readable content of a page when looking at its layout. The point of
              using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as
              opposed to using 'Content here, content here', making it look like readable English.
              Many desktop publishing packages and web page editors now use Lorem Ipsum as their
              default model text, and a search for 'lorem ipsum' will uncover many web sites still
              in their infancy. Various versions have evolved over the years, sometimes by accident,
              sometimes on purpose (injected humour and the like).
            </div>
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
*,
*::after,
*::before {
  box-sizing: border-box;
}
html {
  box-sizing: border-box;
  scroll-behavior: smooth;
  margin: 0px;
  padding: 0px;
}
body {
  box-sizing: border-box;
  margin: 0px;
  padding: 0px;
}

.w-100 {
  width: 100%;
}

.bottom-sheet-pop-up-container {
  --dragPosPadding: 32px;
  --dragIconHeight: 0.5rem;
  --transition-animation-duration: 0.2s;
  --background: white;
  --overlay-bg: rgba(0, 0, 0, 0.5);
  --top-radius: 20px;

  box-sizing: border-box;
  scroll-behavior: smooth;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--overlay-bg);
  z-index: 1000;
  overflow: hidden;
  padding-top: 15%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-end;
  align-items: center;
}

.bottom-sheet-content {
  position: relative;
  width: 100%;
  background: transparent;
  border-radius: var(--top-radius) var(--top-radius) 0 0;
  overflow-y: hidden;
  background: var(--background);
  transition: max-height var(--transition-animation-duration) ease-in-out;
  height: fit-content;
}
.bottom-sheet-content-container {
  overflow-y: scroll;
  height: fit-content;
  max-height: calc(100% - (var(--dragPosPadding) * 2 + var(--dragIconHeight)));
}
.bottom-sheet-swipe-down {
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  height: fit-content;
  width: 100%;
  padding: var(--dragPosPadding) 0rem;
  position: sticky;
  top: 0px;
  background: inherit;
  z-index: 9999;
  /* border-bottom: 1px solid $grey; */
  cursor: n-resize;
}

.bottom-sheet-drag-indicator {
  width: 60%;
  border-radius: 2rem;
  height: var(--dragIconHeight);
  background: var(--background);
  filter: brightness(0.8);
}
</style>
