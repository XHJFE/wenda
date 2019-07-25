const proxyBase = require('../proxy/base/header');
const proxyIndex = require('../proxy/base/index');
const settings = require('../settings.json');
/**
 * 获取城市和菜单栏数据
 */
const getCityAndMenus = () => {
    // 获取菜单栏数据
    let menus = proxyBase.getMenus(settings.cityId);
    // 获取城市数据
    let city = proxyBase.getCity();
    return {
        keys: ["menus", "city"],
        values: [menus, city]
    }  
};

/**
 * 获取广告位图片
 * @param {String} name 当前广告位使用页面
 */
async function getADPIC(name) {
    return proxyIndex.getADPIC(name)
}

module.exports = {
    getCityAndMenus,
    getADPIC
}
