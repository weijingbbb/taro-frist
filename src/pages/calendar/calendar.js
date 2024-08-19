
import { MAX_DATE, MIN_DATE } from '@/common/constant';
import { View } from "@tarojs/components";
import Taro from '@tarojs/taro';
import { AtCalendar } from "taro-ui";
import useFlightStore from '../../models/flightIndex-z';

import './calendar.scss';

const Calendar = (props) => {
  const { dptDate } = props

  const updateFlight = useFlightStore((state) => state.updateFlight)

  const onDateSelect = (date) => {
    const {value: {start}} = date
    updateFlight({ dptDate: start })
    Taro.navigateBack()
  }
  return (
    <View className="calendar-page">
      <AtCalendar
        currentDate={dptDate}
        minDate={MIN_DATE}
        maxDate={MAX_DATE}
        onSelectDate={onDateSelect}
      ></AtCalendar>
    </View>
  )
}

export default Calendar
