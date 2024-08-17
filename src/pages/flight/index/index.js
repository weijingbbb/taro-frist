import { adsReq } from '@/common/api';
import { Button, Image, Swiper, SwiperItem, View } from '@tarojs/components';
import React, { useEffect, useState } from 'react';
import Tab from '../../../components/Tab';
import useBoundStore from '../../../models/user-z';
import './index.scss';

export default function FlightIndex() {

  // 广告banner
  const [adList, setAdList] = useState([])
  const count = useBoundStore((state) => state.count)
  const increasePopulation = useBoundStore((state) => state.increasePopulation)

  const FLIGHT_TABS = [
    {
      label: '单程',
      id: 0,
    },
    {
      label: '多程',
      id: 1,
    },
    {
      label: '往返',
      id: 2,
    },
  ]

  const handleTabClick = (id) => {
    console.log('handleTabClick---',id)
  }

  const getAds = () => {
    adsReq().then(res=> {
      const { result } = res
      setAdList(result || [])
    })
  }

  useEffect(() => {
    getAds()
  },[])

  return (
    <View className="flight-container">
      <View className="flight-top">
        <Tab tabList={FLIGHT_TABS} onTabClick={handleTabClick} className="flight-index-tab">
          <SwiperItem className=''>{count}<Button onTap={increasePopulation}>增加</Button></SwiperItem>
          <SwiperItem className=''>222</SwiperItem>
          <SwiperItem className=''>333</SwiperItem>
        </Tab>
      </View>
      <View className="alipay-swiper" style={{margin: '15px'}}>
          <Swiper className="advs-banner-bd" autoplay circular interval={3000}>
            {
              adList.map(item => {
                return (
                  <SwiperItem key={item.id} className="item">
                    <Image className="img" src={item.imgUrl}></Image>
                  </SwiperItem>
                )
              })
            }
          </Swiper>
        </View>
    </View>
  )
}
