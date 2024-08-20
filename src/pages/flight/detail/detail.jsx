import tools from '@/common/tools';
import {
  Button,
  Image,
  Input,
  Text,
  View,
} from "@tarojs/components";
import { getCurrentInstance, useShareAppMessage } from '@tarojs/taro';
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import useBoundStore from '../../../models/user-z';

import useAuth from '../../../hooks/useAuth';
import "./detail.scss";

const Detail = () => {
  useAuth();
  const user = useBoundStore((state) => state.user)
  const[data, setdata] = useState({})

  const onOrder = () => {
    const { userPhone } = user
    tools.doLogin(() => {
      tools.showLoading()
      orderReq({
        userPhone,
        orderInfo: data
      })
        .then(() => {
          tools.showToast({
            title: '预定成功...',
            icon: "loading",
            duration: 2000
          })
            .then(() => {
              Taro.switchTab({
                url: '/pages/order/order'
              })
            })
        })
        .catch(err => {
          tools.showToast(err?.data?.mes || ERR_MES)
        })
        .finally(() => {
          tools.hideLoading()
        })
    })
  }

  useShareAppMessage(res => {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '分享了一个好好的小程序呀',
      path: '/pages/flight/detail/detail?id=1&arrTime=2021-09-05T10%3A55%3A00.000Z&airCompanyName=%E4%B8%AD%E5%9B%BD%E5%9B%BD%E8%88%AA&airIcon=https%3A%2F%2Fimages3.c-ctrip.com%2Fztrip%2Fairline%2FCA.png&price=893&dptTimeStr=16%3A25&arrTimeStr=18%3A55'
    }
  })

  useEffect(()=> {
    const { params } = getCurrentInstance().router;
    setdata({ ...params })
  }, [])

  return <View className="detail-container">
  <View className="flight-segment">
    <View className="info-head">
      <View className="tag">直飞</View>
      <View className="company-info">
        <Image src={data.airIcon} className="logo"></Image>
        {`${data.airCompanyName} ${dayjs(data.dptTime).format("M月D日")}`}
      </View>
    </View>
    <View className="info-detail">
      <View className="from">
        <View className="time">{data.dptTimeStr}</View>
        <View className="station">{data.dptAirportName}</View>
      </View>
      <Image
        className="mid"
        src="https://i.postimg.cc/z3P1QNf1/1.png"
      ></Image>
      <View className="to">
        <View className="time">{data.arrTimeStr}</View>
        <View className="station">{data.arrAirportName}</View>
      </View>
    </View>
  </View>
  <View className="passenger-box module-box">
    <Text className="title">乘机人</Text>
    {
      user.isLogin ? <View className="name">{user.nickName}</View> : <Button className="add-btn name" onClick={tools.doLogin}>新增</Button>
    }
  </View>
  <View className="passenger-box module-box">
    <Text className="title">联系手机</Text>
    <View className="phone-box">
      <Text className="num-pre">+86 </Text>
      <Input disabled placeholder="请输入乘机人手机号" value={user.userPhone}></Input>
    </View>
  </View>
  {/* 测试Taro bug */}
  {/* <Switch
    onChange={this.onSwitchChange}
  ></Switch>
  <View>
    {
      isChecked ? (
        <View className="module-box">
          <Text className="title">保险</Text>
          <View className="insurance-name">
            <Text>人身意外险</Text>
            <Text>¥ 30/人</Text>
          </View>
        </View>
      ) : null
    }
  </View> */}
  <View className="price-item">
    <View className="color-red">
      ¥ <Text className="price color-red">{data.price}</Text>
    </View>
    <View className="order-btn" onClick={onOrder}>订</View>
  </View>
  <Button className="share-btn" openType="share">快将行程分享给好友吧</Button>
  {/*  机票底部  */}
  <View className="flight-info"></View>
</View>
}

export default Detail;
