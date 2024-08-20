
import { loginReq } from '@/common/api';
import { ERR_MES, USER_VALID_TIME } from '@/common/constant';
import tools from "@/common/tools";
import { debounce } from '@/common/utils';
import { Button, Input, View } from "@tarojs/components";
import { useState } from "react";
import useBoundStore from '../../models/user-z';

import './login.scss';

const Login = () => {
  const [data, setData] = useState({
    nickName: "",
    userPhone: "",
    password: "",
  })

  const updateState = useBoundStore((state) => state.updateState)

  const handleInput = debounce((e, type) => {
    const f = data
    f[type] = e.detail.value
    setData(f)
  }, 300)


  const onLogin = () => {
    const {
      userPhone,
      password,
      nickName
    } = data
    if (!userPhone || !password || !nickName) {
      return tools.showToast('所有内容必须填写完整～');
    }
    const reg = /^1[3-9]\d{9}$/
    if (!reg.test(userPhone)) {
      return tools.showToast('请填写正确手机号～')
    }
    tools.showLoading()
    loginReq({
      userPhone,
      password,
      nickName
    })
      .then(res => {
        const { result } = res
        tools.setStorageSyncWithTime('userInfo', {
          userPhone: result.userPhone,
          nickName: result.nickName
        }, USER_VALID_TIME)
        updateState({
          isLogin: !!result.userPhone,
          userPhone: result.userPhone,
          nickName: result.nickName,
        })
        Taro.navigateBack()
      })
      .catch(err => {
        const { data } = err
        if (data?.mes) {
          return tools.showToast(data.mes)
        }
        tools.showToast(ERR_MES)
      })
      .finally(() => {
        tools.hideLoading()
      })
  }

  return (
    <View className="login-container">
      <View className="login-top">
        <View>你好，</View>
        <View>欢迎登录</View>
      </View>
      <View className="login-box">
        <Input type="text" className="nick-name input" placeholder="请输入昵称" placeholderClass="placeholer-class" onInput={(e) => handleInput(e, "nickName")}></Input>
        <Input type="text" className="phone input" placeholder="请输入手机号" placeholderClass="placeholer-class" onInput={(e) => handleInput(e, "userPhone")}></Input>
        <Input type="password" className="password input" placeholder="请输入密码" placeholderClass="placeholer-class" onInput={(e) => handleInput(e, "password")}></Input>
      </View>
      <Button className="login-btn" onClick={onLogin}>登录</Button>
    </View>
  )
}

export default Login
