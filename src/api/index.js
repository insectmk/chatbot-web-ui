import { apis } from './request'
import {getAction, deleteAction, putAction, postAction, getActionBinary} from './method'

// **请求
// 获取验证码
const getCaptcha = () => getActionBinary(apis.captcha)
// 判断Token是否有效
const isTokenEffective = (params) => getAction(apis.isToken, params)
// 登录请求
const login = (params) => postAction(apis.login, params)

// **暴露
export {
    getCaptcha,
    isTokenEffective,
    login,
}
