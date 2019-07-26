const {
    getNewQuestion,
    getClassData
} = require('../proxy/index/index');
const util = require('../lib/util');
const { getCityAndMenus } = require('./base');


module.exports = (keyword) => {
    // 公用导航栏和城市数据
    const baseData = getCityAndMenus();
    const keys = ['question', 'hotQuestion', 'newAsk', 'classData', ...baseData.keys];
    const question = getNewQuestion({
        problemTitle: keyword
    })
    const classData = getClassData()
    // 获取最热的数据
    let hotQuestion = getNewQuestion({
        pageSize: 5,
        sortViewNum: 'desc'
    })
    // 获取最新回答的问题
    let newAsk = getNewQuestion({
        pageSize: 5,
        sortUpdateDate: 'desc'
    })
    return new Promise((resolve, reject) => {
        Promise.all([question, hotQuestion, newAsk, classData, ...baseData.values]).then(result => {
            resolve(util.getResult(keys, result));
        }).catch(e => {
            reject(e);
        });
    })
}