const proxyIndex = require('../proxy/index/index');
const util = require('../lib/util');
const { getCityAndMenus } = require('./base')
const {
    getCityId
} = require('../proxy/base/header');

module.exports = async (req) => {
    // 公用导航栏和城市数据
    const cityId = await getCityId(req.hostname);
    const baseData = getCityAndMenus(cityId)
    let keys = ['classData', ...baseData.keys];
    // 获取分类数据
    let classData = proxyIndex.getClassData();
    return new Promise((resolve, reject) => {
        Promise.all([classData, ...baseData.values]).then(function (result) {
            resolve(util.getResult(keys, result))
        }).catch(function (e) {
            reject(e)
        });
    })
    
};