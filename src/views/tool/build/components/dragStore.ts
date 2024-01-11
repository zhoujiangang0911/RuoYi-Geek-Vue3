import { defineStore } from 'pinia'
const useDragStore = defineStore('drag', {
    state: () => ({
        dragingElement: {} as HTMLElement,
    }),
    actions: {
        startDrag(dragingElement: HTMLElement) {
            this.dragingElement = dragingElement
        },
        getDragingElement() {
            return this.dragingElement.cloneNode(true)
        }
    }
})
export default useDragStore
