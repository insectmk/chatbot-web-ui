/**
 * 判断url是否在线
 * @param url
 * @param method
 * @returns {boolean}
 */
export async function isUrlOnline(url, method) {
    try {
        const response = await fetch(url, { method: method });
        return response.status >= 200 && response.status < 300;
    } catch (error) {
        return false;
    }
}