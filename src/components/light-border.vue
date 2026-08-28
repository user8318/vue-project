<script setup lang="ts">
const props = withDefaults(defineProps<{ reverse?: boolean; noLight?: boolean }>(), {
  reverse: false,
  none: false,
})
</script>
<template>
  <div class="light-border" :class="{ reverse: props.reverse, 'no-light': props.noLight }">
    <div class="slot-content">
      <slot></slot>
    </div>
  </div>
</template>
<style scoped>
@property --angle {
  syntax: '<angle>';
  initial-value: 0deg;
  inherits: false;
}
@keyframes spin {
  from {
    --angle: 0deg;
  }
  to {
    --angle: 360deg;
  }
}
.light-border {
  position: relative;
  z-index: 0;
}
.light-border::before,
.light-border::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  top: 50%;
  left: 50%;
  translate: -50% -50%;
  box-sizing: unset;
  z-index: -1;
  padding: 2px;
  border-radius: 2px;
  animation: 4s spin linear infinite;
  background-image: conic-gradient(
    from var(--angle),
    transparent 0% 20%,
    aqua 39% 49%,
    transparent 50% 70%,
    aqua 89% 99%,
    transparent 100%
  );
}
.light-border.reverse::before,
.light-border.reverse::after {
  animation-direction: reverse;
  background-image: conic-gradient(
    from var(--angle),
    transparent 0%,
    aqua 1% 11%,
    transparent 30% 50%,
    aqua 51% 61%,
    transparent 80% 100%
  );
}
.light-border.no-light::before,
.light-border.no-light::after {
  background-image: unset;
}
.light-border::before {
  filter: blur(1.5rem);
  opacity: 0.5;
}
.slot-content {
  border-radius: 2px;
  background: radial-gradient(ellipse 100% 100% at 50% 50%, #0b1753 0%, #0b1753 25%, #082782 100%);
  height: 100%;
}
.slot-content::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
  background-size: 14px 14px;
}
</style>
