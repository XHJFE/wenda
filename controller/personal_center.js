const {
    getNewQuestion,
    getPersonAnswer,
    getPromblemFocus,
    getPromblemFocusIds
} = require('../proxy/index/index');
const util = require('../lib/util');   

module.exports = (req) => {
    const { userId } = util.getUser(req.cookies);
    // 获取待回答问题
    const stayAnswerQuestion = getNewQuestion({
        inviteeId: userId,
        pageSize: 10
    })
    // 我提出的问题
    const myQuestion = getNewQuestion({
        questionerId: userId,
        pageSize: 10,
        isAll: true
    })
    // 我回答的问题
    const personAnswer = getPersonAnswer({
        userId,
        isAll: true
    })
    // 我关注的问题
    const focusPromblems = getPromblemFocus({
        userId
    })
    // 我关注的所有问题id
    const focusPromblemIds = getPromblemFocusIds(userId)

    const keys = ['stayAnswerQuestion', 'myQuestion', 'personAnswer', 'focusPromblems', 'focusPromblemIds'];
    return new Promise((resolve, reject) => {
        Promise.all([stayAnswerQuestion, myQuestion, personAnswer, focusPromblems, focusPromblemIds]).then(result => {
            resolve(util.getResult(keys, result));
        }).catch(e => {
            reject(e);
        });
    })
}