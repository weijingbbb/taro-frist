import { flightListReq } from "@/common/api";
import { ERR_MES, MAX_DATE, MIN_DATE } from "@/common/constant";
import tools from "@/common/tools";
import { weekDay } from "@/common/utils";
import {
  Block,
  Image,
  Picker,
  ScrollView,
  Text,
  View
} from "@tarojs/components";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import Skeleton from 'taro-skeleton';
import useFlightStore from '../../../models/flightIndex-z';

import "./list.scss";

import 'taro-skeleton/dist/index.css';

let initFlightList = [];

const List = () => {
  const [dateList, setDateList] = useState([])
  const [flightData, setFlightData] = useState({})
  // 航班列表
  const [flightList, setFlightList] = useState({})
   // 航司列表
  const [flightCompanyList, setFlightCompanyList] = useState({})
  // 当前选中的下标
  const [curAirCompanyIndex, setCurAirCompanyIndex] = useState({})
  const [scrollTop, setScrollTop] = useState({})

  const flight = useFlightStore((state) => state.flight)


  const chooseDate = (date) => {
    setFlightData({
      ...flightData,
      dptDate: date
    })
    getList()
  }


  const formatDateList = () => {
    let minStr = dayjs(MIN_DATE).valueOf();
    const maxStr = dayjs(MAX_DATE).valueOf();
    const dayStr = 1000 * 60 * 60 * 24; // 一天
    let res = [];
    for (; minStr <= maxStr; minStr += dayStr) {
      res.push({
        dateStr: dayjs(minStr).format("YYYY-MM-DD"),
        day: dayjs(minStr).format("M-DD"),
        week: weekDay(minStr),
      });
    }
    return res;
  };

  // 筛选
  const onAirCompanyChange = (e) => {
    console.log('flightCompanyList----',flightCompanyList)
    const { value } = e.detail;
    setCurAirCompanyIndex(value)
    const res = initFlightList.filter(item => item.airCompanyName === flightCompanyList[value])
    setFlightList(res);
    setScrollTop(0)
  }

  // 获取数据
  const getList = () => {
    tools.showLoading();
    flightListReq({
      ...flightData
    })
      .then(res => {
        const companyArr = res.result?.map(item => item.airCompanyName)
        setFlightList(res.result);
        setFlightCompanyList([...new Set(companyArr)]);
        setScrollTop(0)
        initFlightList = res.result
      })
      .catch(() => {
        tools.showToast(ERR_MES)
      })
      .finally(() => {
        tools.hideLoading()
      })
  }

  /**
   * 跳转详情页
   * @{param}
   */
  const onFlightClick = (curFlight) => {
    tools.navigateTo({
      url: '/pages/flight/detail/detail',
      data: {
        ...curFlight
      }
    })
  }

  useEffect(() => {
    const { params } = getCurrentInstance().router;
    const {
      dptCityId,
      dptCityName,
      arrCityId,
      arrCityName,
      dptDate,
      arrAirportName,
      dptAirportName,
    } = params

    setDateList(formatDateList())
    setFlightData({
      dptCityId,
      dptCityName,
      arrCityId,
      arrCityName,
      dptDate,
      arrAirportName,
      dptAirportName,
    })
    Taro.setNavigationBarTitle({
      title: `${dptCityName} - ${arrCityName}`
    })
    getList()
    console.log('params-----', params)
  }, [])

  return (
    <View className="list-container">
      <View className="calendar-list">
        <ScrollView
          className="calendar-scroll-list"
          scrollX
          scrollWithAnimation
          scrollIntoView={`date-${flightData.dptDate}`}
        >
          {dateList.map((date) => {
            return (
              <View
                key={date.dateStr}
                className={`item ${
                  date.dateStr === flightData.dptDate ? "cur" : ""
                }`}
                id={`date-${date.dateStr}`}
                onClick={() => chooseDate(date.dateStr)}
              >
                <View className="date">{date.day}</View>
                <View className="week">{date.week}</View>
              </View>
            );
          })}
        </ScrollView>
      </View>
      {flightList.length ? (
          <View
            id="flight-list"
          >
            {/* 性能优化篇：虚拟列表 */}
            {/* <VirtualList className="flight-scroll-list" list={flightList} onRender={this.handleRender}></VirtualList> */}
            <ScrollView
              className="flight-scroll-list"
              scrollY
              scrollTop={scrollTop}
            >
              {flightList?.map((flight, index) => {
                const {
                  dptAirportName,
                  dptTimeStr,
                  arrTimeStr,
                  arrAirportName,
                  airIcon,
                  airCompanyName,
                  price,
                } = flight;
                return (
                  <Block key={flight.id}>
                    {
                      index === 3 && (
                        <View className="notice">
                          <Image className="notice-logo" src="https://i.postimg.cc/dhGPDTjq/2.png"></Image>
                          <Text className="notice-text">价格可能会上涨，建议尽快预定</Text>
                        </View>
                      )
                    }
                    <View
                      className="list-item"
                      onClick={() => onFlightClick(flight)}
                    >
                      <View className="item-price">
                        <View className="flight-row">
                          <View className="depart">
                            <Text className="flight-time">{dptTimeStr}</Text>
                            <Text className="airport-name">
                              {dptAirportName}
                            </Text>
                          </View>
                          <View className="separator">
                            <View className="spt-arr"></View>
                          </View>
                          <View className="arrival">
                            <Text className="flight-time">{arrTimeStr}</Text>
                            <Text className="airport-name">
                              {arrAirportName}
                            </Text>
                          </View>
                        </View>
                        <Text className="flight-price color-red">
                          ¥ {price}
                        </Text>
                      </View>
                      <View className="air-info">
                        <Image className="logo" src={airIcon} />
                        <Text className="company-name">{airCompanyName}</Text>
                      </View>
                    </View>
                  </Block>
                );
              })}
            </ScrollView>
          </View>
        ) : (
          <View className="skeleton-box">
            {Array(7)
              .fill(0)
              .map((item, index) => {
                return <Skeleton key={index} row={3} action rowHeight={34} />;
              })}
          </View>
        )}
      <View className={`flilter-btn ${flightList?.length ? "" : "hidden"}`}>
          <Picker
            range={flightCompanyList}
            value={curAirCompanyIndex}
            onChange={onAirCompanyChange}
          >
            筛选
          </Picker>
        </View>
    </View>
  )
}

export default List
