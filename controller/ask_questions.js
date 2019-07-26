const {
    getBelongerByPage,
    findLabelAll
} = require('../proxy/index/index');
const util = require('../lib/util');
const { getCityAndMenus } = require('./base');


module.exports = (param) => {
    // 公用导航栏和城市数据
    const baseData = getCityAndMenus();
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