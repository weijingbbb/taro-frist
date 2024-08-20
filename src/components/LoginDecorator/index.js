import tools from "@/common/tools";
import { useReady } from '@tarojs/taro';

const CheckLogin = (WrappedComponent) => {
  // return class extends Component {
  //   componentDidMount() {
  //     const store = tools.getStorageSyncWithTime('userInfo')
  //     if (!store?.userPhone) {
  //       // 未登录
  //       tools.navigateTo({
  //         url: '/pages/index/index'
  //       })
  //     }
  //   }
  //   render() {
  //     return <WrappedComponent />
  //   }
  // }
  useReady(() => {
    const store = tools.getStorageSyncWithTime('userInfo')
    if (!store?.userPhone) {
      // 未登录
      tools.navigateTo({
        url: '/pages/index/index'
      })
    }
  })
  return <WrappedComponent />
}



export default CheckLogin
