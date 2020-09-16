const {
    getBelongerByPage,
    findLabelAll
} = require('../proxy/index/index');
const util = require('../lib/util');
const { getCityAndMenus } = require('./base');
const {
    getCityId
} = require('../proxy/base/header');


module.exports = async (req, param) => {
    const cityId = await getCityId(req.hostname);
    // 公用导航栏和城市数据
    const baseData = getCityAndMenus(cityId, req.hostname);
    const keys = ['belongerList', 'allBabel', ...baseData.keys];
    const belongerList = getBelongerByPage(param)
    const allBabel = findLabelAll()
    return new Promise((resolve, reject) => {
        Promise.all([belongerList, allBabel, ...baseData.values]).then(result => {
            resolve(util.getResult(keys, result));
        }).catch(e => {
            reject(e);
        });
    })
}