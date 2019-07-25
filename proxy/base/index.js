const proxy = require('../base_proxy');
const {
    ADPIC,
    HEADER,
    ADD_FOCUS,
    REMOVE_FOCUS
} = require('../base_url')
/**
 * 获取广告图
 * @param {String} name 当前广告使用页面
 * @returns {Promise.<*>}
 */
async function getADPIC(name) {
    let data = await proxy({
        uri: ADPIC + encodeURI(name),
        method: 'GET',
        headers: HEADER
    });
    return data;
}

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

module.exports = {
    getADPIC,
    addFocus,
    removeFocus
}
