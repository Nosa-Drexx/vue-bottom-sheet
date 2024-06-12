<script lang="ts">
import { defineComponent } from 'vue'
import BottomSheet from './components/BottomSheet.vue'

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

<style scoped></style>
