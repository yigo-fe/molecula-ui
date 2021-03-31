/*
 * @Descripttion:
 * @Author: 付静
 * @Date: 2021-03-11 21:38:02
 * @LastEditors: 付静
 * @LastEditTime: 2021-03-31 16:44:40
 * @FilePath: /packages/ok-employee-select/index.ts
 */

import { defineComponent, html, onMounted } from 'ok-lit'
import { computed, createApp } from 'vue'

import CDN_PATH from '../path.config'
// const propsOptions = {
//   value: {
//     type: (Array as unknown) as PropType<string[]>,
//   },
//   range: {
//     type: (Array as unknown) as PropType<string[]>,
//   },
//   placeholder: {
//     type: (String as unknown) as PropType<string>,
//   },
//   disabled: {
//     type: (Boolean as unknown) as PropType<boolean>,
//     default: false,
//   },
//   multiple: {
//     type: (Boolean as unknown) as PropType<boolean>,
//     default: false,
//   },
//   secrecy: {
//     type: (Boolean as unknown) as PropType<boolean>,
//     default: false,
//   },
//   mode: {
//     type: (String as unknown) as PropType<string>,
//   },
//   update: {
//     type: (Function as unknown) as PropType<
//       // eslint-disable-next-line no-unused-vars
//       (ids: string[], options: []) => void
//     >,
//   },
// }
import { propsOptions } from './employee-props'

defineComponent('ok-employee-select', { ...propsOptions }, (props, context) => {
  onMounted(() => {
    const options = {
      setup() {
        const mode = computed(() => props.mode)
        const value = computed(() => {
          if (!props.value) {
            return []
          } else {
            return typeof props.value === 'string' ? [props.value] : props.value
          }
        })
        const disabled = computed(() => props.disabled)
        const placeholder = computed(() => props.placeholder)
        const multiple = computed(() => props.multiple)
        // 无边框
        const borderless = computed(() => props.borderless)
        const range = computed(() => props.range)
        // 组织架构是否开始保密
        const secrecy = computed(() => props.secrecy)

        // 更新组件外部value
        const updateValue = (e: CustomEvent) => {
          props.update && props.update(e.detail.value, e.detail.options)
        }

        return {
          mode,
          value,
          disabled,
          placeholder,
          multiple,
          range,
          secrecy,
          borderless,
          updateValue,
        }
      },
      template: `
				<ok-employee-tree 
					v-if="mode==='tree'"			
					:value="value"
					:placeholder="placeholder"
					:range="range"
					:disabled="disabled"
          :multiple="multiple"
          :secrecy="secrecy"
          :borderless="borderless"
					@update="updateValue"
          class="ok-employee-tree"
					></ok-employee-tree>
					
					<ok-employee-input 
						v-else
						:value="value"
            :placeholder="placeholder"
            :range="range"
            :disabled="disabled"
            :multiple="multiple"
            :borderless="borderless"
						@update="updateValue"
            class="ok-employee-input"
						></ok-employee-input>
      	`,
    }

    const app = createApp(options)

    app.mount(context.$refs.showEmployeeSelect as HTMLElement)
  })

  return () => html`
    <link rel="stylesheet" .href="${CDN_PATH}antd.min.css" />
    <style>
      .ok-employee-tree,
      .ok-employee-input {
        display: block;
      }
      .ok-employee-select-wraper {
        width: 100%;
      }
    </style>

    <div ref="showEmployeeSelect" class="ok-employee-select-wraper"></div>
  `
})
