const proxy = require('../base_proxy');
const {
    HEADER,
    ADD_FOCUS,
    REMOVE_FOCUS,
    FIND_BY_ID
} = require('../base_url')
/**
 * 关注问题
 * @param {String | Number} userId 当前用户id
 * @param {String | Number} askId 当前问题id
 */
async function addFocus(userId, askId) {
    let data = await proxy({
        uri: `${ADD_FOCUS}${userId}/${askId}`,
        method: 'POST',
        headers: HEADER
    });
    return data;
}

/**
 * 取消关注问题
 * @param {String | Number} userId 当前用户id
 * @param {String | Number} askId 当前问题id
 */
async function removeFocus(userId, askId) {
    let data = await proxy({
        uri: `${REMOVE_FOCUS}${userId}/${askId}`,
        method: 'POST',
        headers: HEADER
    });
    return data;
}

/**
 * 获取用户信息
 * @param {String} userId 当前需要查询的用户id
 */
async function getUserInfo(userId) {
    let data = await proxy({
        uri: FIND_BY_ID + userId,
        method: 'GET',
        headers: HEADER
    });
    return data;
}

module.exports = {
    addFocus,
    removeFocus,
    getUserInfo
}
