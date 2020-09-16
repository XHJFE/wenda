const {
    getClassData,
    getNewQuestion
} = require('../proxy/index/index');
const {
    getCityId
} = require('../proxy/base/header');
const util = require('../lib/util');
const { 
    getCityAndMenus,
 } = require('./base');
 const setting = require('../settings.json');

module.exports = async (req) => {
    // 公用导航栏和城市数据    
    const cityId = await getCityId(req.hostname);
    const baseData = getCityAndMenus(cityId);
    
    let keys = ['classData', 'newQuestion', 'hotQuestion', ...baseData.keys];

    // 获取分类数据
    let classData = getClassData();
    // 获取最热的数据
    let hotQuestion = getNewQuestion({
        pageSize: 5,
        sortViewNum: 'desc',
        cityId: cityId || setting.cityId
    })
    // 获取最新问答数据
    let newQuestion = getNewQuestion({
        cityId: cityId || setting.cityId
    });
    return new Promise((resolve, reject) => {
        Promise.all([classData, newQuestion, hotQuestion, ...baseData.values]).then(result => {
            resolve(util.getResult(keys, result));
        }).catch(e => {
            reject(e);
        });
    })
    
};