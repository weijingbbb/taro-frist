import { Text, View } from '@tarojs/components';
import { useLoad } from '@tarojs/taro';
import './order.scss';

const a = 'bbb';

export default function Order () {
  useLoad(() => {
    console.log('Page loaded.')
  })

  return (
    <View className='order'>
      <Text>订单页面</Text>
    </View>
  )
}
