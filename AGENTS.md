# CODING_STYLE

Naming
camelCase variables functions methods (loading, queryFormRef, handleDelete, openModal)
PascalCase classes interfaces types components-code (FormModel, QueryForm)
kebab-case filenames folders routes components-file (query-form.vue, template-path)
useXxx composables (useLoading, useModalSync)
SCREAMING_SNAKE_CASE pure constants (NORMAL_CLOSURE)
camelCase exported config objects (scenarioNodeStatus)
camelCase props
camelCase emits in defineEmits kebab-case in template (@update:checked-row-keys)

Async & Error Handling
Always async await. Never .then() .catch() except Axios interceptors.
Wrap async calls in try/catch.
Axios interceptor handles global error toast + Promise.reject.
Component validation: try { await formRef.value?.validate() } catch { return }.

Vue Conventions
Always script setup lang="ts". No Options API.
Props: defineProps<{...}>(); withDefaults when needed.
Emits: defineEmits(["query", "edit"]) or typed callback.
v-model: defineModel("loading", {type: Boolean, default: false}).
Expose child methods via defineExpose({openModal, reset}); parent calls via template ref.
Component template refs use PascalCase consistently: write `ref="QueryFormRef"` in the template and `const QueryFormRef = useTemplateRef("QueryFormRef")` in script.
TSX allowed in .vue / .tsx for complex render logic.

TypeScript
Prefer interface over type (type only for utility / union types).
Type assertion with as: object as ResData.
Default values pattern: class FormModel implements ReqData {id = ""; name = "";} then ref(new FormModel()).
Generics: useLoading<T, R>, send<T = unknown>.
No enum. Use as const object + inferred type.

HTTP & API
Base service in utils/service.ts (createService(baseURL)).
Business APIs in `api/<module>.ts` as exported plain functions.

Code Organization
Auto Import
Vue API (ref, computed, watch, etc.) and vue-router API (useRoute, useRouter, etc.) are auto-imported by unplugin-auto-import. Do not write import statements for them.
Project utilities under `src/utils/auto-import/` and TSX components under `src/components/tsx/` are auto-imported. Do not import them manually.
`requestBR` from `src/api/services.ts` is auto-imported.
Third-party composables from @vueuse/core are auto-imported.
All components under src/components/ and naive-ui components are auto-imported by unplugin-vue-components. Do not import them manually.
Manual import is still required for: icons (@vicons/ionicons5), business APIs (`api/<module>.ts`), and non-auto-imported third-party libraries.
Keep `import type { ... }` on separate lines for readability.

Directory Layout

```text
src/
  api/          module-split API functions
  components/   global atomic components
  images/       image assets
  views/        page modules
  router/       single route table file
  types/        global TS types
  utils/        utilities + composables + global registration
    auto-import/    auto-imported utilities and composables
    service.ts      Axios base service
    websocket/      WebSocket composable
  mocks/        MSW handlers
  styles/       global CSS/SCSS
```
