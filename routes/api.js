const {
    addFocus,
    removeFocus
} = require('../proxy/base/index');
const {
    getBelongerByPage,
    saveProblemAsk
} = require('../proxy/index/index')

module.exports = (router) => {
    router
    /**
     * 关注
     */
    router.post('/addFocus', function (req, res, next) {
        console.log(req.cookies)
        addFocus(req.cookies.xh_userId, req.query.askId).then(data => {
            res.send(data)
        })
    })

    /**
     * 取消关注
     */
    router.post('/removeFocus', function (req, res, next) {
        console.log(req.cookies.xh_userId)
        removeFocus(req.cookies.xh_userId, req.query.askId).then(data => {
            console.log(data)
            res.send(data)
        })
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
        if (global.user.isLogin) {
            saveProblemAsk(req.body).then(data => {
                console.log(data)
                res.send(JSON.parse(data))
            })
        } else {
            res.send({
                status: 506,
                message: '请登录'
            })
        }
        
    })

}

