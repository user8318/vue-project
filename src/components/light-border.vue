<script setup lang="ts">
const props = withDefaults(
  defineProps<{ borderColor?: string; bgColor?: string; reverse?: boolean; noLight?: boolean }>(),
  {
    borderColor: 'aqua',
    bgColor: '#0b1753',
    reverse: false,
    none: false,
  },
)
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
  --border-color: v-bind('props.borderColor');
  --bg-color: v-bind('props.bgColor');
  position: relative;
  z-index: 0;
  width: max-content;
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
    var(--border-color) 39% 49%,
    transparent 50% 70%,
    var(--border-color) 89% 99%,
    transparent 100%
  );
}
.light-border.reverse::before,
.light-border.reverse::after {
  animation-direction: reverse;
  background-image: conic-gradient(
    from var(--angle),
    transparent 0%,
    var(--border-color) 1% 11%,
    transparent 30% 50%,
    var(--border-color) 51% 61%,
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
  background: radial-gradient(
    ellipse 100% 100% at 50% 50%,
    var(--bg-color) 0%,
    var(--bg-color) 25%,
    var(--bg-color) 100%
  );
}
.slot-content::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
  background-size: 14px 14px;
}
</style>
