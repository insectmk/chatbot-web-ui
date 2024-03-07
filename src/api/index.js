import { apis } from './request'
import {getAction, deleteAction, putAction, postAction, getActionBinary} from './method'

// **请求
const getHistoryMsg = (params) => getAction(apis.getHistoryMsg, params)
const editPassword = (params) => putAction(apis.editPassword, params)
const getSessionAll = () => getAction(apis.getSessionAll)
const getUserInfo = () => getAction(apis.getUserInfo)
const getCaptcha = () => getActionBinary(apis.captcha)
const isTokenEffective = (params) => getAction(apis.isToken, params)
const login = (params) => postAction(apis.login, params)

// **暴露
export {
    getHistoryMsg,
    editPassword,
    getSessionAll,
    getUserInfo,
    getCaptcha,
    isTokenEffective,
    login,
}
