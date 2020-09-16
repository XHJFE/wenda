const {
    getNewQuestion,
    getClassData
} = require('../proxy/index/index');
const util = require('../lib/util');
const { getCityAndMenus } = require('./base');
const setting = require('../settings.json'); 
const {
    getCityId
} = require('../proxy/base/header');


module.exports = async (req, param) => {

    const cityId = await getCityId(req.hostname);
    // 公用导航栏和城市数据
    const baseData = getCityAndMenus(cityId, req.hostname);
    const keys = ['question', 'hotQuestion', 'newAsk', 'classData', ...baseData.keys];
    const question = getNewQuestion({
        ...param,
        cityId: cityId || setting.cityId
    })
    const classData = getClassData()
    // 获取最热的数据
    let hotQuestion = getNewQuestion({
        pageSize: 5,
        sortViewNum: 'desc',
        cityId: cityId || setting.cityId
    })
    // 获取最新回答的问题
    let newAsk = getNewQuestion({
        pageSize: 5,
        sortUpdateDate: 'desc',
        cityId: cityId || setting.cityId
    })
    return new Promise((resolve, reject) => {
        Promise.all([question, hotQuestion, newAsk, classData, ...baseData.values]).then(result => {
            resolve(util.getResult(keys, result));
        }).catch(e => {
            reject(e);
        });
    })
}