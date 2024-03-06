import { apis } from './request'
import {getAction, deleteAction, putAction, postAction, getActionBinary} from './method'

// **请求
const getSessionAll = () => getAction(apis.getSessionAll)
const getUserInfo = () => getAction(apis.getUserInfo)
const getCaptcha = () => getActionBinary(apis.captcha)
const isTokenEffective = (params) => getAction(apis.isToken, params)
const login = (params) => postAction(apis.login, params)

// **暴露
export {
    getSessionAll,
    getUserInfo,
    getCaptcha,
    isTokenEffective,
    login,
}
