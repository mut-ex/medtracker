// BASIC EXAMPLE
<script lang="ts">
  import { defineComponent, ref } from "vue";
  export default defineComponent({
    setup() {
      return {
        isOpened: ref(false)
      }
    }
  })
</script>
<template>
  <VueSidePanel
		v-model="isOpened"
		lock-scroll
		rerender
		side="bottom"
		height="500px"
  >
		 <div style="padding-top: 70px; color: #f14668">
        <h2
          v-for="item in 50"
          :key="item"
          :style="{fontSize: '58px', fontWeight: 700, opacity: item * 2 / 100, lineHeight: '43px'}"
        >
          This is scrolled body!
        </h2>
      </div>

  </VueSidePanel>
</template>
    