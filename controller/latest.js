const proxyLatest = require('../proxy/index/index');
const proxyIndex = require('../proxy/index/index')
const util = require('../lib/util');
const { getCityAndMenus } = require('./base')

module.exports = (param) => {
    // 公用导航栏和城市数据
    const baseData = getCityAndMenus();
    let keys = ['newQuestion', 'classData', 'hotQuestion', 'newAsk', ...baseData.keys];
    let newQuestion = proxyIndex.getNewQuestion(param)
    // 获取最热的数据
    let hotQuestion = proxyIndex.getNewQuestion({
        pageSize: 5,
        sortViewNum: 'desc'
    })
    // 获取最新回答的问题
    let newAsk = proxyIndex.getNewQuestion({
        pageSize: 5,
        sortUpdateDate: 'desc'
    })
    let classData = proxyIndex.getClassData()
    return new Promise((resolve, reject) => {
        Promise.all([newQuestion, classData, hotQuestion, newAsk, ...baseData.values]).then(result => {
            resolve(util.getResult(keys, result));
        }).catch(e => {
            reject(e);
        });
    })
    
};