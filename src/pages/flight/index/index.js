import { adsReq } from '@/common/api';
import { Image, Swiper, SwiperItem, Text, View } from '@tarojs/components';
import Taro from "@tarojs/taro";
import React, { useEffect, useState } from 'react';
import Tab from '../../../components/Tab';
import useFlightStore from '../../../models/flightIndex-z';
import './index.scss';

export default function FlightIndex() {

  // 广告banner
  const [adList, setAdList] = useState([])
  const [isExchange, setIsExchange] = useState(false)
  const flight = useFlightStore((state) => state.flight)
  const updateFlight = useFlightStore((state) => state.updateFlight)

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
    console.log('handleTabClick---', id)
  }
  // 获取广告
  const getAds = () => {
    adsReq().then(res => {
      const { result } = res
      setAdList(result || [])
    })
  }

  // 跳转机场选择页
  const chooseFlightCity = (cityType) => {
    updateFlight({ ...flight, cityType })
    // 注意：使用app.config.js中注册的绝对路径，需要加/
    Taro.navigateTo({
      url: "/pages/airportList/airportList"
    })
  }

  const exchangeCity = async () => {
    console.log('exchangeCity');
  }

  useEffect(() => {
    getAds()
  }, [])

  return (
    <View className="flight-container">

      <View className="flight-top">
        <Tab tabList={FLIGHT_TABS} onTabClick={handleTabClick} className="flight-index-tab">
          <SwiperItem className=''>
            <View className="item station">
              <View
                className={`cell from ${isExchange ? "slide" : ""}`}
                onClick={() => chooseFlightCity("depart")}
              >
                {flight.dptCityName}
              </View>
              <Text
                onClick={exchangeCity}
                className={`icon-zhihuan iconfont ${isExchange ? "active" : ""
                  }`}
              ></Text>
              <View
                className={`cell to ${isExchange ? "slide" : ""}`}
                onClick={() => chooseFlightCity("arrive")}
              >
                {flight.arrCityName}
              </View>
            </View>

          </SwiperItem>
          <SwiperItem className=''>
          </SwiperItem>
          <SwiperItem className=''>333</SwiperItem>
        </Tab>
      </View>
      <View className="alipay-swiper" style={{ margin: '15px' }}>
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
