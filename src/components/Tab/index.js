import { Swiper, View } from '@tarojs/components';
import React, { useEffect, useState } from 'react';
import './index.scss';

export default function Tab(props) {
  const {
    className,
    tabList,
    children,
    onTabClick,
    initTab,
    onChange
  } = props

  const [currentId, setCurrentId] = useState(0)

  const innerStyle = {
    width: `${100 / tabList?.length}%`,
    transform: `translateX(${currentId * 100}%)`
  }

  // 点击tab切换时
  const handleClick = (id) => {
    setCurrentId(id)
    onTabClick?.(id)
  }

  // swiper切换时
  const handleChange = (e) => {
    const id = e.detail.current
    setCurrentId(id)
    onChange?.(e)
  }

  // 如果用户传入初始的tab-id，则使用初始化的，否则使用第一个
  useEffect(() => {
    if(initTab == undefined || initTab == null) {
      setCurrentId(tabList[0].id)
    }
    else {
      setCurrentId(0)
    }
  },[])

  return (
    <View className={`tab-container ${className}`}>
      {/* tab选项卡 */}
      <View className="tab-bar">
          {
            tabList?.map(item => {
              return (
                <View className={`tab-item ${currentId === item.id ? 'active' : ''}`} key={item.id} onClick={() => handleClick(item.id)}>{item.label}</View>
              )
            })
          }
          <View className="scroll-bar" style={innerStyle}></View>
        </View>
        {/* 选项卡内容 */}
        <Swiper
          current={currentId}
          className="tab-content"
          onChange={handleChange}
        >
          {children}
        </Swiper>
    </View>
  )
}
