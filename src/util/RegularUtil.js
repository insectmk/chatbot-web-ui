const username = /^.{3,20}$/ // 用户名，3-20位
const email = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,6}$/ // 邮箱
const password = /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[\W_]).{6,24}$/ // 密码：至少包含数字、字母和特殊字符，并且长度在6到24位之间
const captcha = /^[a-zA-Z0-9]{4}$/ // 验证码：由4个字符组成的图形验证码

export {
    username,
    email,
    password,
    captcha,
}