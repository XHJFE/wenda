const proxyBase = require('../proxy/base/header');
const {
    cityId
} = require('../settings.json')
/**
 * 获取城市和菜单栏数据
 * @param {String} id 当前城市
 */
const getCityAndMenus = (id = cityId) => {
    // 获取菜单栏数据
    let menus = proxyBase.getMenus(id);
    // 获取城市数据
    let city = proxyBase.getCity(id);
    
    return {
        keys: ["menus", "city"],
        values: [menus, city]
    }  
};

module.exports = {
    getCityAndMenus
}
