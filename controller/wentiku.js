const {
    getNewQuestion,
    getClassData,
    getPromblemFocusIds
} = require('../proxy/index/index')
const util = require('../lib/util');
const { getCityAndMenus } = require('./base')
const setting = require('../settings.json'); 
const {
    getCityId
} = require('../proxy/base/header');

module.exports = async (req, param) => {

    const cityId = await getCityId(req.hostname);
    // 公用导航栏和城市数据
    const baseData = getCityAndMenus(cityId, req.hostname);
    let keys = ['newQuestion', 'classData', 'hotQuestion', 'newAsk', 'promblemFocusIds', ...baseData.keys];
    const newQuestion = getNewQuestion({
        ...param,   
        cityId: cityId || setting.cityId
    })
    // 当前用户已关注的问题id
    const promblemFocusIds = getPromblemFocusIds(param.userId)
    // 获取最热的数据
    const hotQuestion = getNewQuestion({
        pageSize: 5,
        sortViewNum: 'desc',
        cityId: cityId || setting.cityId
    })
    // 获取最新回答的问题
    const newAsk = getNewQuestion({
        pageSize: 5,
        sortUpdateDate: 'desc',
        cityId: cityId || setting.cityId
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