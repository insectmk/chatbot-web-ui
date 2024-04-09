import { apis } from './request'
import {getAction, deleteAction, putAction, postAction, getActionBinary} from './method'
import {put} from "axios";

// **请求
const getModelUsageStatistic = (params) => getAction(apis.getModelUsageStatistic, params)
const deleteModel = (params) => deleteAction(apis.deleteModel, params)
const editModel = (params) => putAction(apis.editModel, params)
const addModel = (params) => postAction(apis.addModel, params)
const findModel = (params) => getAction(apis.findModel, params)
const clearSystemLog = (params) => deleteAction(apis.clearSystemLog, params)
const findSystemLog = (params) => getAction(apis.findSystemLog, params)
const deleteUser = (params) => deleteAction(apis.deleteUser, params)
const editUser = (params) => putAction(apis.editUser, params)
const addUser = (params) => postAction(apis.addUser, params)
const findUser = (params) => getAction(apis.findUser, params)
const register = (params) => postAction(apis.register, params)
const getApiKey = () => getAction(apis.getApiKey)
const addSession = (params) => postAction(apis.addSession, params)
const getModelVersionAll = (params) => getAction(apis.getModelVersionAll, params)
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
    getModelUsageStatistic,
    deleteModel,
    editModel,
    addModel,
    findModel,
    clearSystemLog,
    findSystemLog,
    deleteUser,
    editUser,
    addUser,
    findUser,
    register,
    getApiKey,
    addSession,
    getModelVersionAll,
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
