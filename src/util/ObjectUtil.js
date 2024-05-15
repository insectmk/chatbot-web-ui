/**
 * 将普通对象转为FormData对象，通常用于文件上传
 * @param obj
 * @returns {FormData}
 */
export function paramsToFormData(obj) {
    const formData = new FormData();
    Object.keys(obj).forEach((key) => {
        if (obj[key] instanceof Array) {
            obj[key].forEach((item) => {
                formData.append(key, item);
            });
            return;
        }
        formData.append(key, obj[key]);
    });
    return formData;
}

/**
 * 合并两个对象数组并去重
 * @param arr1
 * @param arr2
 * @param key
 * @returns {any[]}
 */
export function mergeAndDeduplicate(arr1, arr2, key) {
    let unique = new Map();

    // 合并两个数组并添加到Map中，使用对象的key属性作为Map的键
    [...arr1, ...arr2].forEach(item => {
        unique.set(item[key], item);
    });

    // 从Map中提取值，得到去重后的数组
    return Array.from(unique.values());
}
