/*
 * @Descripttion:
 * @Author: 付静
 * @Date: 2021-03-19 01:13:31
 * @LastEditors: 付静
 * @LastEditTime: 2021-03-20 17:25:27
 * @FilePath: /packages/ok-accessory/upload-attachment-hook.ts
 */

import { apiInit } from '../services/api'
import useUploadHandler from './upload-base-hook'
export default function (props, context) {
  const api = apiInit()
  // 删除文件
  const remove = async ({ file, fileLists, index }) => {
    const fileId = file.response?.data[0].file_id
    const result = await api.default.DelAttachmentPrivateV1GET({
      query: { fileId },
    })
    if (result.code === '000000') {
      // 删除显示的上传列表
      fileLists.splice(index, 1)
      // 处理用户自定义事件
      props.onRemove && props.onRemove({ file, fileLists })

      // 更新value
      props.update && props.update({ file, fileLists })
    }
  }

  // 获取默认值
  const getDefaultFileList = async (ids: string[]) => {
    return await api.default.GetAttachmentListAttachmentPrivateV1POST({
      file_id_list: ids,
    })

    // const result: any = await api.default.GetAttachmentListAttachmentPrivateV1POST(
    //   {
    //     file_id_list: ids,
    //   }
    // )
    // if (result.code === '000000') {
    //   displayFileList(result.data)
    // }
  }
  // test:
  // const a = ['ab22a2cfdc310739fff09a08607f5534']
  // getDefaultFileList(a)

  const config = {
    action: '/v1/private/attachment/uploadAttachments',
    remove: remove,
    getDefaultFileList: getDefaultFileList,
  }

  const {
    showPreview,
    showDownload,
    showRemove,
    fileLists,
    hideUploader,
    displayFileList,
    uploadFiles,
    handlePreview,
    handleDetele,
    handleDownload,
  } = useUploadHandler(props, context, config)

  return {
    showPreview,
    showDownload,
    showRemove,
    fileLists,
    hideUploader,
    displayFileList,
    uploadFiles,
    handlePreview,
    handleDetele,
    handleDownload,
  }
}
