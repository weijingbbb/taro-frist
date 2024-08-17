import { airportCityListReq } from "@/common/api";
import { ERR_MES } from "@/common/constant";
import tools from "@/common/tools";
import { ScrollView, View } from "@tarojs/components";
import { useEffect, useState } from "react";

import CityItem from './components/CityItem';

import './airportList.scss';

export default function Main () {
  const [cityListObj, setCityListObj] = useState({}) // 处理之后的城市列表
  const [letterList, setLetterList] = useState([])  // 字母列表
  const [currentLetter, setCurrentLetter] = useState("")  // 当前选中的字母

  const getCityList = () => {
    tools.showLoading()
    const storageList = tools.getStorageSyncWithTime("flightCityList")
    if (storageList?.length) {
      const obj = this.formatList(storageList)
      setCityListObj(obj)
      setLetterList(Object.keys(obj))
      tools.hideLoading()
      return
    }
    airportCityListReq()
      .then(res => {
        const { result } = res
        tools.setStorageSyncWithTime("flightCityList", result, 20)
        const obj = formatList(result)
        setCityListObj(obj)
        setLetterList(Object.keys(obj))
      })
      .catch(() => {
        tools.showToast(ERR_MES)
      })
      .finally(() => {
        tools.hideLoading()
      })
  }

  const formatList = (list) => {
    const obj = {}
    if (list?.length) {
      list.map((ele) => {
        const {firstLetter} = ele
        // 判断obj中是否有以firstLetter为键的属性
        if (!obj[firstLetter]) {
          obj[firstLetter] = []
        }
        obj[firstLetter].push(ele)
      })
    }
    return obj
  }


  const onLetterClick = (letter) => {
    setCurrentLetter(letter)
  }

  useEffect(() => {
    getCityList()
  },[])

  return (
  <View className="airport-list-container">
    <ScrollView scrollY scrollWithAnimation={tools.isAliPay ? false : true} style={{height: "100vh"}} scrollIntoView={currentLetter}>
      {
        letterList?.map(item => {
          const cityList = cityListObj[item]
          return (
            <CityItem
              key={item}
              label={item}
              cityList={cityList}
            />
          )
        })
      }
    </ScrollView>
    <View className="letter-container">
      {
        letterList?.map(item => (
          <View key={item} className="letter-item" onClick={() => onLetterClick(item)}>{item}</View>
        ))
      }
    </View>
  </View>)
}
