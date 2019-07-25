const proxy = require('../base_proxy');
const {
    SITE_CHALLEL,
    CITY
} = require('../base_url');

/**
 * 获取菜单
 * @param cityId 城市ID
 * @returns {Promise.<*>}
 */
async function getMenus(cityId) {
    let data = await proxy({
        uri: SITE_CHALLEL + cityId,
        method: 'GET',
        headers: {
            "Content-Type": "application/json;charset=UTF-8",
            "Accept": "application/json, text/javascript, */*; q=0.01"
        }
    });
    return data;
}

/**
 * 获取城市
 * @returns {Promise.<*>}
 */
async function getCity() {
    let data = await proxy({
        uri: CITY,
        method: 'GET',
        headers: {
            "Content-Type": "application/json;charset=UTF-8",
            "Accept": "application/json, text/javascript, */*; q=0.01"
        }
    });
    return data;
}

/**
 * 获取用户id
 */
async function getUserId(session) {
    
}

module.exports = {
    getMenus,
    getCity
};