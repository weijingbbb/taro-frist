

import tools from "@/common/tools";
import { useDidShow } from '@tarojs/taro';

const useAuth = () => {
  useDidShow(() => {
    const store = tools.getStorageSyncWithTime('userInfo')
    if (!store?.userPhone) {
      // 未登录
      tools.navigateTo({
        url: '/pages/login/login'
      })
    }
  })
  return null;
};

export default useAuth
