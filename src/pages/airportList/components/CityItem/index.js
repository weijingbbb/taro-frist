import { Text, View } from "@tarojs/components";

import './index.scss';

const CityItem = (props) => {
  const { cityList, label } = props
  return (<View className="list-item" id={label}>
    <Text className="label">{label}</Text>
    {
      cityList?.map(item => {
        return <View key={item.id} className="name" onClick={() => this.onCityClick(item)}>
          {`${item.cityName}（${item.airportName}）`}
        </View>
      })
    }
  </View>)
}

export default CityItem
