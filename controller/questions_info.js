const {
    getPromblemInfo,
    getPromblemAnswerList,
    updateViewNum,
    getPromblemFocusIds
} = require('../proxy/index/index');
const util = require('../lib/util');
const { getCityAndMenus } = require('./base');


module.exports = (req, id) => {
    // 公用导航栏和城市数据
    const baseData = getCityAndMenus(req.cookies.siteid);
    const promblemInfo = getPromblemInfo(id)
    // 当前用户已关注的问题id
    const promblemFocusIds = getPromblemFocusIds(req.cookies.xh_userId)
    const answerList = getPromblemAnswerList({
        problemAskId: id
    })
    const viewNum = updateViewNum(id)
    const keys = ['promblemInfo', 'answerList', 'viewNum', 'promblemFocusIds', ...baseData.keys];
    return new Promise((resolve, reject) => {
        Promise.all([promblemInfo, answerList, viewNum, promblemFocusIds, ...baseData.values]).then(result => {
            resolve(util.getResult(keys, result));
        }).catch(e => {
            reject(e);
        });
    })
}