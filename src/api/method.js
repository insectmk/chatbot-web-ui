import axios from 'axios'

// 全局设置请求带cookie
//axios.defaults.withCredentials = true
// 全局设置请求带token请求头
axios.defaults.headers.common['token'] = localStorage.getItem("token")
// 全局设置API地址
axios.defaults.baseURL = 'http://127.0.0.1:9001'

export function getActionBinary(url, parameter, headers) {
  return axios({
    url: url,
    method: 'get',
    data: parameter,
    headers:headers,
    responseType: 'arraybuffer', // 关键 设置 响应类型为二进制流
  })
}

//post
export function postAction(url, parameter, headers) {
  return axios({
    url: url,
    method: 'post',
    data: parameter,
    headers:headers
  })
}

//post method= {post | put}
export function httpAction(url, parameter, method, headers) {
  console.log("dddd")
  return axios({
    url: url,
    method: method,
    data: parameter,
    headers: headers
  })
}

//put
export function putAction(url, parameter, headers) {
  return axios({
    url: url,
    method: 'put',
    data: parameter,
    headers: headers
  })
}

//get
export function getAction(url, parameter, headers) {
  let geturl = toGetUrl(url, parameter)
  return axios({
    url: geturl,
    method: 'get',
    headers: headers
  })
}

//deleteAction
export function deleteAction(url, parameter, headers) {
  return axios({
    url: url,
    method: 'delete',
    params: parameter,
    headers: headers
  })
}

/**
 * 下载文件 用于excel导出
 * @param url
 * @param parameter
 * @returns {*}
 */
export function downFile(url, parameter) {

  return axios({
    url: url,
    params: parameter,
    method: 'get',
    responseType: 'blob'
  })
}

/**
 * 获取文件访问路径
 * @param avatar
 * @param imgerver
 * @param str
 * @returns {*}
 */
export function getFileAccessHttpUrl(avatar, imgerver, subStr) {
  if (avatar && avatar.indexOf(subStr) != -1) {
    return avatar;
  } else if(imgerver) {
    return imgerver + "/" + avatar;
  } else if(subStr) {
    return subStr + "://" + imgerver + "/" + avatar;
  }else {
    return window._CONFIG['staticDomainURL']+"/"+ avatar;
  }
}

/**
 * 文件上传 用于富文本上传图片
 * @param url
 * @param parameter
 * @returns {*}
 */
export function uploadAction(url,parameter){
  return axios({
    url: url,
    data: parameter,
    method:'post' ,
    headers: {
      'Content-Type': 'multipart/form-data',  // 文件上传
    },
  })
}

export  function toGetUrl(url, params) {
  var idx = url.indexOf('?');
  if (idx < 0) {
    url = url + '?';
  } else if(idx !== url.length - 1){
    if (url.charAt(url.length - 1) !== '&') {
      url = url + '&';
    }
  }
  for (var key in params) {
    if (params.hasOwnProperty(key)) {
      var v = params[key];
      if (v !== '') {
        url += key + '=' + params[key] + '&';
      }
    }
  }
  return url;
}
