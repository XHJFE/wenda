const {
    getNewQuestion,
    getClassData,
    getPromblemFocusIds
} = require('../proxy/index/index')
const util = require('../lib/util');
const { getCityAndMenus } = require('./base')

module.exports = (req, param) => {
    // 公用导航栏和城市数据
    const baseData = getCityAndMenus(req.cookies.siteid);
    let keys = ['newQuestion', 'classData', 'hotQuestion', 'newAsk', 'promblemFocusIds', ...baseData.keys];
    const newQuestion = getNewQuestion(param)
    // 当前用户已关注的问题id
    const promblemFocusIds = getPromblemFocusIds(param.userId)
    // 获取最热的数据
    const hotQuestion = getNewQuestion({
        pageSize: 5,
        sortViewNum: 'desc'
    })
    // 获取最新回答的问题
    const newAsk = getNewQuestion({
        pageSize: 5,
        sortUpdateDate: 'desc'
    })
    const classData = getClassData()
    return new Promise((resolve, reject) => {
        Promise.all([newQuestion, classData, hotQuestion, newAsk, promblemFocusIds, ...baseData.values]).then(result => {
            resolve(util.getResult(keys, result));
        }).catch(e => {
            reject(e);
        });
    })
    
};