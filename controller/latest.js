const proxyLatest = require('../proxy/index/index');
const proxyIndex = require('../proxy/index/index')
const util = require('../lib/util');
const { getCityAndMenus } = require('./base')

module.exports = (param) => {
    // 公用导航栏和城市数据
    const baseData = getCityAndMenus();
    let keys = ['newQuestion', 'classData', ...baseData.keys];
    let newQuestion = proxyIndex.getNewQuestion(param)
    let classData = proxyIndex.getClassData()
    return new Promise((resolve, reject) => {
        Promise.all([newQuestion, classData, ...baseData.values]).then(result => {
            resolve(util.getResult(keys, result));
        }).catch(e => {
            reject(e);
        });
    })
    
};