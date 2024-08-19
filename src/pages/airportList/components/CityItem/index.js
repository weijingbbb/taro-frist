import { Text, View } from "@tarojs/components";
import Taro from "@tarojs/taro";

import useFlightStore from '../../../../models/flightIndex-z';
import './index.scss';

const CityItem = (props) => {
  const flight = useFlightStore((state) => state.flight)
  const updateFlight = useFlightStore((state) => state.updateFlight)
  const { cityList, label } = props

  const onCityClick = (cityInfo) => {
    const { cityType } = flight
    const {
      cityId,
      cityName,
      airportName,
    } = cityInfo
    if(cityType === "depart"){
      updateFlight({
        ...cityInfo,
        dptCityId: cityId,
        dptAirportName: airportName,
        dptCityName: cityName
      })
    }else {
      updateFlight({
        ...cityInfo,
        arrCityId: cityId,
        arrAirportName: airportName,
        arrCityName: cityName,
      })
    }
    Taro.navigateBack()
  }

  return (<View className="list-item" id={label}>
    <Text className="label">{label}</Text>
    {
      cityList?.map(item => {
        return <View key={item.id} className="name" onClick={() => onCityClick(item)}>
          {`${item.cityName}（${item.airportName}）`}
        </View>
      })
    }
  </View>)
}

export default CityItem
