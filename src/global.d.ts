declare module '@/global' {
  export type DataType = {
    hidePopUp: boolean
    startX: number
    startY: number
    endX: number
    endY: number
    isSwiping: boolean
    currentHeight: number
    maxHeightInPx: number
  }

  export type DraggingPayload = {
    event: MouseEvent | TouchEvent
    contentHeight: number
  }
}
