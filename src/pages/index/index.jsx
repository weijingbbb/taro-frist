import { Text, View } from '@tarojs/components';
import { useLoad } from '@tarojs/taro';
import './index.scss';

const a = 'bbb';

export default function Index () {
  useLoad(() => {
    console.log('Page loaded.')
  })

  return (
    <View className='index'>
      <Text>Hello world!</Text>
    </View>
  )
}
