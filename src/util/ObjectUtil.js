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