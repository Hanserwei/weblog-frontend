import axios, { type ApiResponse } from '@/axios'

export interface UploadFileRspVO {
  /**
   * 文件的访问链接
   */
  url?: string
}

export function UploadFile(file: File) {
  const formData = new FormData()
  // 这里的 'file' 必须和你后端 @RequestParam("file") 中的字符串一致
  formData.append('file', file)

  // Axios 传递 FormData 时，会自动识别并设置 Content-Type: multipart/form-data
  return axios.post<unknown, ApiResponse<UploadFileRspVO>>('/admin/file/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}
