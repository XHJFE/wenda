let express = require('express');
let router = express.Router();
let logic = require('../logic/main');
const indexController = require('../controller/index');
const classifyController = require('../controller/classify');
const settings = require('../settings.json');
const { getStringInImg, delHtmlTag } = require('../lib/util');

/**
 * 首页
 */
router.get('/', function (req, res, next) {
    indexController().then(data => {
        let {
            classData,
            newQuestion,
            menus,
            city
        } = data;     
        for (let i = 0, len = newQuestion.data.content.length; i < len; i++) {
            let item = newQuestion.data.content[i];
            let arr = getStringInImg(item.problemContent)
            item.problemContent = delHtmlTag(item.problemContent)
            item.img = '<img src="http://localhost:3301/images/logo.png">' //(arr && arr.length > 0) ? arr[0] : ''
        }
        res.render('index', {
            classData: classData.data,
            newQuestion: newQuestion.data,
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

module.exports = router;
