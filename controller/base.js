const proxyBase = require('../proxy/base/header')
const settings = require('../settings.json');
/**
 * 获取城市和菜单栏数据
 */
const getCityAndMenus = () => {
    let keys = ['menus', 'city'];
    // 获取菜单栏数据
    let menus = proxyBase.getMenus(settings.cityId)
    // 获取城市数据
    let city = proxyBase.getCity()
    return {
        keys: ["menus", "city"],
        values: [menus, city]
    }
    
};

module.exports = {
    getCityAndMenus
}
