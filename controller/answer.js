const proxyLatest = require('../proxy/index/index');
const proxyIndex = require('../proxy/index/index')
const util = require('../lib/util');
const { getCityAndMenus } = require('./base')


module.exports = (req) => {
    // 公用导航栏和城市数据
    const baseData = getCityAndMenus(req.cookies.siteid);
    let keys = [ ...baseData.keys];
    return new Promise((resolve, reject) => {
        Promise.all([...baseData.values]).then(result => {
            resolve(util.getResult(keys, result));
        }).catch(e => {
            reject(e);
        });
    })
}