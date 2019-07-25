const proxyIndex = require('../proxy/base/index');

module.exports = (router) => {
    /**
     * 关注
     */
    router.post('/addFocus', function (req, res, next) {
        proxyIndex.addFocus(req.query).then(data => {
            res.send(data)
        })
    })

    /**
     * 取消关注
     */
    router.post('/removeFocus', function (req, res, next) {
        proxyIndex.removeFocus(req.query).then(data => {
            console.log(data)
            res.send(data)
        })
    })

}

