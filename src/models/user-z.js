import tools from '@/common/tools';
import { create } from 'zustand';

const userInfo = tools.getStorageSyncWithTime('userInfo')
const useBoundStore = create((set) => ({
  user: {
    isLogin: !!userInfo?.userPhone, // 是否登录
    userPhone: userInfo?.userPhone,
    nickName: userInfo?.nickName
  },
  updateState:(newVal) => set((state) => ({
    user: {
      ...state.user,
      ...newVal
    }
  })),
  loginOut() {
    return {
      ...init()
    }
  }
}))

export default useBoundStore
