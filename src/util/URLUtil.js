/**
 * 判断url是否在线
 * @param url
 * @returns {boolean}
 */
export function isUrlOnline(url, method) {
    let xhr = new XMLHttpRequest();
    xhr.open(method, url, false);
    try {
        xhr.send();
        return xhr.status === 200;
    } catch (e) {
        // 在这里处理异常，例如网络问题等
        console.error("Checking the URL failed:", e);
        return false;
    }
}