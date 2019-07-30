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
 * @param {String} id 当前城市id
 * @returns {Promise.<*>}
 */
async function getCity(id) {
    let data = await proxy({
        uri: CITY,
        method: 'GET',
        headers: {
            "Content-Type": "application/json;charset=UTF-8",
            "Accept": "application/json, text/javascript, */*; q=0.01"
        }
    });
    data = JSON.parse(data);
    let arr = Object.values(data);
    let cityName = '';
    for (let i = 0, len = arr.length; i < len; i++) {
        let bool = false;
        for (let j = 0, jLen = arr[i].length; j < jLen; j++) {
            if (arr[i][j].cityId == id) {
                cityName = arr[i][j].name;
                bool = true;
                break;
            }
        }
        if (bool) {
            break;
        }
    }
    return JSON.stringify({
        city: data,
        name: cityName
    });
}

module.exports = {
    getMenus,
    getCity
};