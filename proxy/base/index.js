const proxy = require('../base_proxy');
const {
    HEADER,
    ADD_FOCUS,
    REMOVE_FOCUS
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

module.exports = {
    addFocus,
    removeFocus
}
