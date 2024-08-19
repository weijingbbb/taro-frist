import { MAX_DATE, MIN_DATE } from "@/common/constant";
import { weekDay } from "@/common/utils";
import {
  ScrollView,
  View
} from "@tarojs/components";
import { getCurrentInstance } from "@tarojs/taro";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import useFlightStore from '../../../models/flightIndex-z';

import "./list.scss";

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

  useEffect(() => {
    const { params } = getCurrentInstance().router;
    setDateList(formatDateList())
    console.log('params-----', params)
  }, [])

  return (
    <View className="list-container">
      <View className="calendar-list">
        <ScrollView
          className="calendar-scroll-list"
          scrollX
          scrollWithAnimation
          scrollIntoView={`date-${flight.dptDate}`}
        >
          {dateList.map((date) => {
            return (
              <View
                key={date.dateStr}
                className={`item ${
                  date.dateStr === flight.dptDate ? "cur" : ""
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
      </View>
  )
}

export default List
