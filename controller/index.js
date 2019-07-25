const proxyIndex = require('../proxy/index/index');
const util = require('../lib/util');
const { getCityAndMenus } = require('./base')

module.exports = () => {
    // 公用导航栏和城市数据
    const baseData = getCityAndMenus()
    let keys = ['classData', 'newQuestion', ...baseData.keys];
    // 获取分类数据
    let classData = proxyIndex.getClassData();
    // 获取最新问答数据
    let newQuestion = proxyIndex.getNewQuestion();
    return new Promise((resolve, reject) => {
        Promise.all([classData, newQuestion, ...baseData.values]).then(function (result) {
            resolve(util.getResult(keys, result))
        }).catch(function (e) {
            reject(e)
        });
    })
    
};