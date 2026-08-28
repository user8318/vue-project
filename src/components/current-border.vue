<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    borderColor?: string
    hoverActive?: boolean
  }>(),
  {
    borderColor: '#42b883',
    hoverActive: true,
  },
)
const borderRef = useTemplateRef<HTMLElement>('borderRef')
const config = reactive({
  PX_PER_SEC: 100,
  SIZE_FACTOR: 1.4,
  baseFrequency: 0.02,
  numOctaves: 10,
})
const noiseAttr = reactive({
  y0: '100; 0',
  y1: '0; -100',
  yDur: '1s',
  x0: '100; 0',
  x1: '0; -100',
  xDur: '1s',
})
function updateAnimationAttr() {
  if (!borderRef.value) return
  const { width, height } = borderRef.value.getBoundingClientRect()
  const { SIZE_FACTOR, PX_PER_SEC } = config
  const filterHeight = height * SIZE_FACTOR
  noiseAttr.y0 = `${filterHeight}; 0`
  noiseAttr.y1 = `0; -${filterHeight}`
  noiseAttr.yDur = `${filterHeight / PX_PER_SEC}s`
  const filterWidth = width * SIZE_FACTOR
  noiseAttr.x0 = `${filterWidth}; 0`
  noiseAttr.x1 = `0; -${filterWidth}`
  noiseAttr.xDur = `${filterWidth / PX_PER_SEC}s`
}
onMounted(() => {
  if (borderRef.value) {
    const resizeObserver = new ResizeObserver(updateAnimationAttr)
    resizeObserver.observe(borderRef.value)
    updateAnimationAttr()
    onUnmounted(() => {
      resizeObserver.disconnect()
    })
  }
})
</script>
<template>
  <div ref="borderRef" class="current-border" :class="{ 'hover-active': props.hoverActive }">
    <div class="layer main"></div>
    <div class="layer glow-tight"></div>
    <div class="layer glow-wide"></div>
    <div class="layer overlay-primary"></div>
    <div class="layer overlay-secondary"></div>
    <div class="layer background-glow"></div>
    <svg width="0" height="0">
      <defs>
        <filter
          id="turbulent-displace"
          color-interpolation-filters="sRGB"
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
        >
          <feTurbulence
            type="turbulence"
            :baseFrequency="config.baseFrequency"
            :numOctaves="config.numOctaves"
            :seed="1"
            result="verticalNoise"
          />
          <feOffset in="verticalNoise" result="vertical0">
            <animate
              attributeName="dy"
              :values="noiseAttr.y0"
              :dur="noiseAttr.yDur"
              repeatCount="indefinite"
            />
          </feOffset>
          <feOffset in="verticalNoise" result="vertical1">
            <animate
              attributeName="dy"
              :values="noiseAttr.y1"
              :dur="noiseAttr.yDur"
              repeatCount="indefinite"
            />
          </feOffset>
          <feComposite
            in="vertical0"
            in2="vertical1"
            operator="over"
            result="seamlessVerticalNoise"
          />
          <feTurbulence
            type="turbulence"
            :baseFrequency="config.baseFrequency"
            :numOctaves="config.numOctaves"
            :seed="2"
            result="horizontalNoise"
          />
          <feOffset in="horizontalNoise" result="horizontal0">
            <animate
              attributeName="dx"
              :values="noiseAttr.x0"
              :dur="noiseAttr.xDur"
              repeatCount="indefinite"
            />
          </feOffset>
          <feOffset in="horizontalNoise" result="horizontal1">
            <animate
              attributeName="dx"
              :values="noiseAttr.x1"
              :dur="noiseAttr.xDur"
              repeatCount="indefinite"
            />
          </feOffset>
          <feComposite
            in="horizontal0"
            in2="horizontal1"
            operator="over"
            result="seamlessHorizontalNoise"
          />
          <feBlend
            in="seamlessVerticalNoise"
            in2="seamlessHorizontalNoise"
            mode="color-dodge"
            result="finalBlendedNoise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="finalBlendedNoise"
            scale="30"
            xChannelSelector="R"
            yChannelSelector="B"
          />
        </filter>
      </defs>
    </svg>
    <slot class="slot"></slot>
  </div>
</template>
<style scoped>
.current-border {
  --border-color: v-bind('props.borderColor');
  font-size: 16px;
  position: relative;
  width: max-content;
}
.layer {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
}
.main {
  border: 2px solid oklch(from var(--border-color) l c h / 0.5);
}
.main::after {
  content: '';
  position: absolute;
  inset: -2px;
  border: 2px solid var(--border-color);
  border-radius: inherit;
  opacity: 1;
  transition: opacity 0.3s ease;
}
.current-border.hover-active:hover .main::after,
.current-border:not(.hover-active) .main::after {
  opacity: 1;
  margin-top: -4px;
  margin-left: -4px;
  filter: url(#turbulent-displace);
}
.glow-tight {
  border: 2px solid oklch(from var(--border-color) l c h / 0.6);
  filter: blur(1px);
}
.glow-wide {
  border: 2px solid var(--border-color);
  filter: blur(4px);
}
.overlay-primary,
.overlay-secondary {
  background: linear-gradient(-30deg, white, transparent 30%, transparent 70%, white);
  transform: scale(1.1);
  filter: blur(16px);
  mix-blend-mode: overlay;
}
.overlay-secondary {
  opacity: 0.5;
}
.background-glow {
  background: linear-gradient(-30deg, var(--border-color), transparent, var(--border-color));
  filter: blur(32px);
  transform: scale(1.1);
  opacity: 0.2;
}
.slot {
  width: 100%;
  height: 100%;
}
</style>
