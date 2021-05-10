import { SIZE_TYPE } from '@c/enum'
import { POPOVER_PLACEMENT } from '@c/ok-wc-ui'
import { setPopover } from '@c/utils'
import { nextTick } from '@vue/runtime-core'
import { styleMap } from 'lit-html/directives/style-map'
import { computed, defineComponent, effect, html, PropType } from 'ok-lit'

import close from '../assets/images/closed.svg'
import { COMMON_CSS_PATH } from '../path.config'
/**
 * @props persons: {Array<Person>} 用户信息组
 */

defineComponent(
  'ok-person-group',
  {
    personList: {
      type: (Array as unknown) as PropType<any[]>,
      default: () => {
        return []
      },
    },
    size: {
      type: (String as unknown) as PropType<SIZE_TYPE>,
      default: SIZE_TYPE.SMALL,
    },
    width: {
      type: (String as unknown) as PropType<string>,
    },
    height: {
      type: (String as unknown) as PropType<string>,
    },
    showDelete: {
      type: (Boolean as unknown) as PropType<boolean>,
      default: false,
    },
    showAll: {
      type: (Boolean as unknown) as PropType<boolean>,
      default: false,
    },
    detailSize: {
      type: (String as unknown) as PropType<string>,
      default: 'mini',
    },
    detailWidth: {
      type: (String as unknown) as PropType<string>,
    },
    detailHeight: {
      type: (String as unknown) as PropType<string>,
    },
    contentStyle: {
      type: (Object as unknown) as PropType<{}>,
    },
    itemStyle: {
      type: (Object as unknown) as PropType<{}>,
    },
    placement: {
      type: (String as unknown) as PropType<string>,
      default: 'top',
    },
    deleteItem: {
      // eslint-disable-next-line no-unused-vars
      type: (Function as unknown) as PropType<(item: any) => void>,
    },
    subtitleRender: {
      // eslint-disable-next-line no-unused-vars
      type: (Function as unknown) as PropType<(item: any) => void>,
    },
  },
  (props, contxt) => {
    const placement = computed(() => {
      return props.placement
    })
    const showList = computed(() => {
      return props.personList?.slice(0, 3)
    })

    const popperList = computed(() => {
      return props.showAll ? props.personList : props.personList?.slice(3)
    })

    const closeIcon = close

    const setPopup = () => {
      setPopover(
        contxt.$refs['showMore'] as HTMLElement,
        contxt.$refs['personGroupPopper'] as HTMLElement,
        {
          appendTo: document.body,
          popperOptions: {
            strategy: 'fixed',
          },
          theme: 'ok-person-group',
          placement: placement.value as POPOVER_PLACEMENT,
        }
      )
    }

    effect(() => {
      if (props.personList?.length) {
        nextTick(() => {
          contxt.$refs['showMore'] && setPopup()
        })
      }
    })

    const deleteItem = (item: any) => {
      props.deleteItem && props.deleteItem(item)
    }

    const avatarRender = () => {
      return html`
        ${showList.value.map(
          item => html`<ok-person-cell
            class="avatar-list"
            .personInfo=${item}
            .size=${props.size}
            .width=${props.width}
            .height=${props.height}
          ></ok-person-cell>`
        )}
        ${!popperList.value.length
          ? html`<span class="single-user-name"
              >${showList.value?.[0]?.employee_name}</span
            >`
          : html`
              <span ref="showMore" class="more"
                >...${popperList.value.length}</span
              >
            `}
      `
    }

    const iconRender = (item: any) => {
      return html`
        ${props.subtitleRender
          ? props.subtitleRender(item)
          : props.showDelete &&
            html` <img
              .src="${closeIcon}"
              class="person-item-close-icon"
              @click="${() => {
                deleteItem(item)
              }}"
            />`}
      `
    }

    const popperRender = () => {
      return html`
        <ul
          ref="personGroupPopper"
          class="ok-person-group-popper popper-wraper"
          style=${styleMap(props.contentStyle)}
        >
          ${popperList.value.map(
            item =>
              html`
                <li style=${styleMap(props.itemStyle)} class="popper-item">
                  <ok-person-cell
                    class="popper-item-avatar"
                    .personInfo=${item}
                    .size=${props.detailSize}
                    .width=${props.detailWidth}
                    .height=${props.detailHeight}
                  ></ok-person-cell>
                  <span class="popper-item-name">${item.employee_name}</span>
                  ${iconRender(item)}
                </li>
              `
          )}
        </ul>
      `
    }

    // ${avatarRender()} ${props.personList.length > 1 ? popperRender() : ''}

    return () => html`
      <link rel="stylesheet" .href="${COMMON_CSS_PATH}" />
      <div class="ok-person-group ok-person-group-root">
        <div class="ok-person-group-wrap">
          ${avatarRender()} ${popperList.value.length ? popperRender() : ''}
        </div>
      </div>
    `
  }
)
