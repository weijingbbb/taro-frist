import { adsReq } from '@/common/api';
import tools from "@/common/tools";
import { sleep } from '@/common/utils';
import { Button, Image, Swiper, SwiperItem, Text, View } from '@tarojs/components';
import Taro from "@tarojs/taro";
import dayjs from 'dayjs';
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
  // 跳转日历页
  const chooseFlightDate = () => {
    Taro.navigateTo({
      url: "/pages/calendar/calendar"
    })
  }

  // 反转城市
  const exchangeCity = async () => {
    const {
      dptCityName,
      dptCityId,
      arrCityId,
      arrCityName,
      dptAirportName,
      arrAirportName,
    } = flight;
    const exchangeObj = {
      dptCityName: arrCityName,
      dptCityId: arrCityId,
      arrCityName: dptCityName,
      arrCityId: dptCityId,
      dptAirportName: arrAirportName,
      arrAirportName: dptAirportName,
    };
    setIsExchange(true);
    updateFlight(exchangeObj);
    await sleep(500);
    setIsExchange(false);
  }

  /**
   * 获取经纬度
   * @{param}
   */
  const getLocationInfo = () => {
    Taro.getLocation({
      type: 'gcj02'
    })
      .then(res => {
        const {
          latitude,
          longitude,
        } = res
        console.log('位置获取-----', latitude,
          longitude,);
        getCity({ latitude, longitude })
      })
      .catch(() => {
        tools.showToast("位置获取失败~")
      })
  }
  const getCity = ({ latitude, longitude }) => {
    Taro.request({
      url: `https://apis.map.qq.com/ws/geocoder/v1/?key=JKLBZ-WN3K4-HFSU6-DB5UU-2FGCS-CLB4J&location=${latitude},${longitude}`
    })
      .then((res) => {
        const { data } = res
        const cityInfo = data?.result?.ad_info || {}
        updateFlight({
          dptCityId: cityInfo.city_code || 2,
          dptCityName: cityInfo.city || '上海'
        })
      })
      .catch(() => {
        tools.showToast("位置获取失败~")
      })
  }

  const onLinkToList = () => {
    const {
      arrCityName,
      arrCityId,
      arrAirportName,
      dptCityId,
      dptCityName,
      dptAirportName,
      dptDate,
    } = flight;
    tools.navigateTo({
      url: '/pages/flight/list/list',
      data: {
        arrCityName,
        arrCityId,
        arrAirportName,
        dptCityId,
        dptCityName,
        dptAirportName,
        dptDate,
      }
    })
  }

  useEffect(() => {
    getAds()
    getLocationInfo()
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

            <View className="item date" onClick={chooseFlightDate}>
              {dayjs(flight.dptDate).format("M月D日")}
            </View>
            <Button className="search-btn" onClick={onLinkToList}>
              搜一下吧～
            </Button>

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
