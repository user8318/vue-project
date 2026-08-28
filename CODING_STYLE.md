# 代码风格

---

## 命名规范

| 类型                        | 规则                                     | 示例                                                 |
| --------------------------- | ---------------------------------------- | ---------------------------------------------------- |
| 变量 / 函数 / 方法          | 小驼峰 `camelCase`                       | `loading`, `handleDelete`, `openModal`               |
| 类 / 接口 / 类型            | 大驼峰 `PascalCase`                      | `class FormModel implements NodeInfo`                |
| 组件代码（components-code） | 大驼峰 `PascalCase`                      | `<ComponentName>`                                    |
| 组件文件（components-file） | 短横线 `kebab-case`                      | `component-name.vue`                                 |
| 组合式函数                  | `use` 前缀 + 大驼峰                      | `useLoading`, `useModalSync`                         |
| 常量                        | 纯值用大写下划线；导出的配置对象用小驼峰 | `NORMAL_CLOSURE`, `nodeStatus`                       |
| 文件和文件夹                | 短横线 `kebab-case`                      | `use-modal-sync.ts`, `template-path/`                |
| 路由（path / name）         | 短横线 `kebab-case`                      | `path: "template-path"`                              |
| Props                       | 小驼峰                                   | `loading?: boolean`                                  |
| Emits                       | `defineEmits` 里小驼峰；模板监听用短横线 | `defineEmits(["query"])`，`@update:checked-row-keys` |

---

## 异步与错误处理

- **始终使用 `async/await`**。禁用 `.then()` / `.catch()` 链式写法（Axios 拦截器里的 `Promise.reject` 除外）。
- 用 `try/catch` 控制异步流程。
- Axios 拦截器统一处理全局错误提示 + `Promise.reject`。
- 组件里表单校验：`try { await formRef.value?.validate() } catch { return }`，静默拦截不继续执行。

---

## Vue 约定

- 始终使用 `<script setup lang="ts">`，不写 Options API。
- Props 定义：`defineProps<{ ... }>()`，需要默认值时用 `withDefaults`。
- Emits 定义：`defineEmits(["query", "edit"])` 或带类型的回调形式。
- v-model：`defineModel("loading", { type: Boolean, default: false })`。
- 子组件暴露方法：`defineExpose({ openModal, reset })`，父组件通过模板 ref 直接调用。
- 组件模板引用统一使用 PascalCase：模板中写作 `ref="QueryFormRef"`，script 中写作 `const QueryFormRef = useTemplateRef("QueryFormRef")`。
- 复杂渲染逻辑可以在 `.vue` 或 `.tsx` 里写 TSX。

---

## 自动导入

- Vue API（`ref`、`computed`、`watch` 等）、vue-router API（`useRoute`、`useRouter` 等）、`@vueuse/core` 的 composables 均由 `unplugin-auto-import` 自动导入，**不要手写 import**。
- `src/utils/auto-import/` 下的工具函数 / composables、`src/components/tsx/` 下的 TSX 组件、`src/api/services.ts` 中的 `requestBR` 也是自动导入。
- `src/components/` 下的 `.vue` 组件以及 naive-ui 组件由 `unplugin-vue-components` 自动导入，**不要手写 import**。
- 仍需手动导入的：图标（`@vicons/ionicons5`）、业务接口（`api/<模块>.ts`）、其他未配置自动导入的第三方库。
- 类型导入保持独立一行，例如：

  ```ts
  import type { Ref } from 'vue'
  import { computed } from 'vue' // 不需要，仅供示例
  ```

---

## TypeScript

- 类型定义优先使用 `interface`，只有工具类型或联合类型才使用 `type`。
- 类型断言使用 `as`：`object as ResData`。
- 默认值模式：使用 `class` 实现接口来生成带默认值的对象，再包进 `ref`：

  ```ts
  class FormModel implements ReqData {
    id = ''
    name = ''
  }
  const formValue = ref(new FormModel())
  ```

- 合理使用泛型，比如 `useLoading<T, R>`、`send<T = unknown>`。
- 不使用 `enum`。使用 `as const` 对象 + 推导类型来代替枚举。

---

## HTTP 与 API

- 底层请求在 `utils/service.ts` 里封装（`createService(baseURL)`）。
- 业务接口按模块拆到 `api/<模块>.ts`，导出成独立函数。

---

## 代码组织

- 原子级组件放在 `src/components/`，由 `unplugin-vue-components` 自动导入；页面级组件局部按需引用。
- 工具函数和组合式函数放在 `src/utils/auto-import/`，由 `unplugin-auto-import` 自动导入。

---

## 目录结构

```text
src/
  api/          # 按模块拆分的接口函数
  components/   # 全局公共组件
  images/       # 图片资源
  views/        # 页面模块
  router/       # 路由表单文件
  types/        # 全局 TS 类型
  utils/        # 工具函数 + 组合式函数 + 全局注册逻辑
    auto-import/    # 自动导入的 utilities / composables
    service.ts      # Axios 封装
    websocket/      # WebSocket 封装
  mocks/        # MSW mock 数据与拦截器
  styles/       # 全局 CSS/SCSS
```
