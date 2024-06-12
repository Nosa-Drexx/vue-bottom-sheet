export function isMouseEvent(event: MouseEvent | TouchEvent): event is MouseEvent {
  return (event as MouseEvent).clientX !== undefined
}

export function isTouchEvent(event: MouseEvent | TouchEvent): event is TouchEvent {
  return (event as TouchEvent).touches !== undefined
}
