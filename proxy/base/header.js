let proxy = require('../base_proxy');
let util = require('../../lib/util');
let config = require('../../config.json');
let env = config.env;

/**
 * 获取菜单
 * @param cityId 城市ID
 * @returns {Promise.<*>}
 */
async function getMenus(cityId) {
    let data = await proxy({
        uri: config.proxy_server_url[env] + '/web/channel/siteChannel/' + cityId,
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
        uri: config.proxy_server_url[env] + '/web/city/findSort',
        method: 'GET',
        headers: {
            "Content-Type": "application/json;charset=UTF-8",
            "Accept": "application/json, text/javascript, */*; q=0.01"
        }
    });
    return data;
}

module.exports = {
    getMenus,
    getCity
};