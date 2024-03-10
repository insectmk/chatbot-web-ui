import { apis } from './request'
import {getAction, deleteAction, putAction, postAction, getActionBinary} from './method'

// **请求
const delSession = (params) => deleteAction(apis.delSession, params)
const sendMsg = (params) => postAction(apis.sendMsg, params)
const sendMsgStream = (params) => postAction(apis.sendMsgStream, params, {responseType: 'text/event-stream'})
const getHistoryMsg = (params) => getAction(apis.getHistoryMsg, params)
const editPassword = (params) => putAction(apis.editPassword, params)
const getSessionAll = () => getAction(apis.getSessionAll)
const getUserInfo = () => getAction(apis.getUserInfo)
const getCaptcha = () => getActionBinary(apis.captcha)
const isTokenEffective = (params) => getAction(apis.isToken, params)
const login = (params) => postAction(apis.login, params)

// **暴露
export {
    delSession,
    sendMsg,
    sendMsgStream,
    getHistoryMsg,
    editPassword,
    getSessionAll,
    getUserInfo,
    getCaptcha,
    isTokenEffective,
    login,
}
