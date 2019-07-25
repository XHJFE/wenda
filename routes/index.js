const express = require('express');
let router = express.Router();
const apiRouter = require('./api');
const indexController = require('../controller/index');
const classifyController = require('../controller/classify');
const latestController = require('../controller/latest')
const settings = require('../settings.json');
const { getStringInImg, delHtmlTag } = require('../lib/util');

/**
 * 格式化问答数据
 * @param {Array} arr 当前需要格式化的数组
 * @returns {Array} 返回格式化之后的数组
 */
const questionFormat = (arr) => {
    for (let i = 0, len = arr.length; i < len; i++) {
        let item = arr[i];
        let imgs = getStringInImg(item.problemContent)
        item.problemContent = delHtmlTag(item.problemContent)
        item.img = (imgs && imgs.length > 0) ? imgs[0] : ''
    }
    return arr
}

/**
 * 首页
 */
router.get('/', function (req, res, next) {
    indexController().then(data => {
        let {
            classData,
            newQuestion,
            menus,
            city,
            adPic
        } = data;
        newQuestion.data.content = questionFormat(newQuestion.data.content)
        res.render('index', {
            classData: classData.data,
            newQuestion: newQuestion.data,
            adPic,
            city,
            menus,
            currentCity: settings
        })
    })
    
});

/**
 * 分类页面
 */
router.get('/classify', function (req, res, next) {
    classifyController().then(data => {
        let {
            classData,
            menus,
            city
        } = data
        res.render('classify', {
            classData: classData.data,
            city,
            menus,
            currentCity: settings
        })
    })
});

/**
 * 最新问题
 */
router.get('/latest', function (req, res, next) {
    latestController(req.query).then(data => {
        let {
            menus,
            city,
            newQuestion,
            classData
        } = data
        newQuestion.data.content = questionFormat(newQuestion.data.content)
        console.log(JSON.stringify(classData))

        res.render('latest', {
            questionList: newQuestion.data,
            classData: classData.data,
            city,
            menus,
            currentCity: settings
        })
    })
    
});


apiRouter(router)

module.exports = router;
