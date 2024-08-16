import { View } from '@tarojs/components';
import { useLoad } from '@tarojs/taro';
import React, { useState } from 'react';
import './index.scss';

const DEFAULT_TAB_LIST = [
  { title: "飞船", tab: "flight", index: 0 },
  { title: "火车", tab: "train", index: 1 }
]

export default function Index () {
  const [tabIndex, setTabIndex] = useState(0)

  const innerStyle = {
    width: `${100 / DEFAULT_TAB_LIST.length}%`,
    transform: `translateX(${tabIndex * 100}%)`
  }

  useLoad(() => {
    console.log('Page loaded.')
  })

  const switchTab = (index) => {
    console.log(index)
    setTabIndex(index)
  }

  return (
    <View className='index-container'>
      <View className='top'>
        <View className='index-tab'>
          {
            DEFAULT_TAB_LIST.map(item => {
              return <View key={item.tab} className={`index_tab_item ${item.tab} ${tabIndex === item.index ? 'current' : ''}`} onClick={() => switchTab(item.index)}>
              {item.title}
            </View>
            })
          }
        </View>
        <View className="scrollbar" style={innerStyle}></View>
      </View>
      {
          DEFAULT_TAB_LIST[tabIndex]['tab'] === "flight" ? (
            <View className='content'>机票</View>
          ) : <View className='content'>火车票</View>
        }
    </View>
  )
}
