import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getUserInfo, type FindUserInfoResponse } from '@/api/admin/user'

export const useUserStore = defineStore(
  'user',
  () => {
    // 用户信息
    const userInfo = ref<FindUserInfoResponse | null>(null)

    // 设置用户信息
    function setUserInfo() {
      getUserInfo().then((res) => {
        // 此时鼠标悬停在 res 上，TS 会提示类型为 ApiResponse<FindUserInfoResponse>
        // 所以 res.success 和 res.data 都能被正确识别
        if (res.success) {
          userInfo.value = res.data
        }
      })
    }

    return { userInfo, setUserInfo }
  },
  {
    persist: true,
  },
)
