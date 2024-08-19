import dayjs from 'dayjs';
import { create } from 'zustand';

const INIT_STATE = {
  dptCityId: 2,
  dptCityName: '上海',
  dptAirportName: '虹桥机场',
  arrCityId: 1,
  arrCityName: '北京',
  arrAirportName: '大兴机场',
  cityType: 'depart', // 选择的城市类型 depart: 出发， arrive：到达
  dptDate: dayjs().format("YYYY-MM-DD"), // 起飞时间
}
const useFlightStore = create((set) => ({
  flight: {
    ...INIT_STATE
  },
  updateFlight: (newVal) => set((state) => ({
    flight: {
      ...state.flight,
      ...newVal
    }
  }))
}))

export default useFlightStore
