const {
    addFocus,
    removeFocus
} = require('../proxy/base/index');
const {
    getBelongerByPage
} = require('../proxy/index/index')

module.exports = (router) => {
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

}

