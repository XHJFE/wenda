const {
    addFocus,
    removeFocus
} = require('../proxy/base/index');
const {
    getBelongerByPage,
    saveProblemAsk,
    savePromblemAnswer,
    getPromblemAnswerList
} = require('../proxy/index/index')
const {
    timestampToTime
} = require('../lib/util')
const _ = require('underscore')

module.exports = (router) => {
    router
    /**
     * 关注
     */
    router.post('/addFocus', function (req, res, next) {
        console.log(req.cookies)
        if (!req.cookies.xh_userId) {
            res.send({
                status: 506,
                msg: '请登录'
            })
        } else {
            addFocus(req.cookies.xh_userId, req.body.askId).then(data => {
                res.send(JSON.parse(data))
            })
        }
    })

    /**
     * 取消关注
     */
    router.post('/removeFocus', function (req, res, next) {
        if (!req.cookies.xh_userId) {
            res.send({
                status: 506,
                msg: '请登录'
            })
        } else {
            removeFocus(req.cookies.xh_userId, req.body.askId).then(data => {
                res.send(JSON.parse(data))
            })
        }
    })

    /**
     * 获取经纪人列表
     */
    router.post('/getBelongerList', function(req, res) {
        getBelongerByPage(req.body.page, req.body.name).then(data => {
            res.send(JSON.parse(data))
        })
    })

    /**
     * 提问
     */
    router.post('/askQuestions', function(req, res) {
        if (req.cookies.xh_userId) {
            saveProblemAsk(req, req.body).then(data => {
                res.send(JSON.parse(data))
            })
        } else {
            res.send({
                status: 506,
                msg: '请登录'
            })
        }
    })

    /**
     * 回答问题
     */
    router.post('/savePromblemAnswer', (req, res) => {
        if (req.cookies.xh_userId) {

            savePromblemAnswer({
                ...req.body,
                answerPersonId: req.cookies.xh_userId,
                answerPersonName: req.cookies.xh_userName
            }).then(data => {
                res.send(JSON.parse(data))
            })
        } else {
            res.send({
                status: 506,
                msg: '请登录'
            })
        }
    })

    /**
     * 获取问题列表
     */
    router.get('/answerList', (req, res) => {
        getPromblemAnswerList(req.query).then(data => {
            data = JSON.parse(data)
            data.data.content = _.map(data.data.content, item => {
                item.createDate = timestampToTime(item.createDate)
                return item
            })
            res.send(data)
        })
    })

}

