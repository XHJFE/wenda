const {
    getPromblemInfo,
    getPromblemAnswerList,
    updateViewNum,
    getPromblemFocusIds,
    getAlikeProbleAsk
} = require('../proxy/index/index');
const util = require('../lib/util');
const { getCityAndMenus } = require('./base');
const {
    getCityId
} = require('../proxy/base/header');


module.exports = async (req, id) => {
    const { userId } = util.getUser(req.cookies);

    const cityId = await getCityId(req.hostname);
    // 公用导航栏和城市数据
    const baseData = getCityAndMenus(cityId);
    const promblemInfo = getPromblemInfo(id)
    // 当前用户已关注的问题id
    const promblemFocusIds = getPromblemFocusIds(userId)
    // 获取相似问题
    const alikeProbleAsk = getAlikeProbleAsk(id)
    const answerList = getPromblemAnswerList({
        problemAskId: id
    })
    const viewNum = updateViewNum(id)
    const keys = ['promblemInfo', 'answerList', 'viewNum', 'promblemFocusIds', 'alikeProbleAsk', ...baseData.keys];
    return new Promise((resolve, reject) => {
        Promise.all([promblemInfo, answerList, viewNum, promblemFocusIds, alikeProbleAsk, ...baseData.values]).then(result => {
            resolve(util.getResult(keys, result));
        }).catch(e => {
            reject(e);
        });
    })
}