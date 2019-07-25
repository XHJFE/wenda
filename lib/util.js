/**
 * 模板解析，解析{}包裹的数据
 * @param tpl 模板
 * @param data  数据
 * @returns {XML|string|void}
 */
function format(tpl, data) {
    return tpl.replace(/{([^\}]+)}/g, function (v, v1) {
        return data.hasOwnProperty(v1) ? data[v1] : v || '';
    });
}

/**
 * 获取JSON对象
 * @param obj
 */
function getJSON(obj) {
    let r;
    try {
        if (typeof obj === 'string') {
            r = JSON.parse(obj);
        }
        else {
            r = obj;
        }
    }
    catch (e) {
        r = {};
    }
    return r;
}

/**
 * 还原html转义字符
 * @param str
 */
function decodeHtml(str) {
    var rule = [/(&lt;)/g, '<', /(&gt;)/g, '>', /(&amp;)/g, '&'];
    for (var i = 0; i < rule.length; i += 2) {
        str.replace(rule[i], rule[i + 1]);
    }
    return str;
}

/**
 * 耗时统计类
 */
function statTimeCost() {
    this._startTime = 0;
    this._endTime = 0;
    this.start.apply(this);
}
/**
 * 耗时统计类原型
 * @type {{}}
 */
statTimeCost.prototype = {
    start: function () {
        this._startTime = new Date().getTime();
        return this;
    },
    end: function () {
        this._endTime = new Date().getTime();
        return this;
    },
    count: function () {
        return this._endTime - this._startTime;
    },
    get: function () {
        this.end();
        return this.count();
    }
};

/**
 * 获取结果集映射表
 * @param keys 表名
 * @param fn 处理函数
 * @returns {{}}
 */
function getResultMap(keys, fn) {
    let map = {};
    keys.map(function (v, i) {
        map[v] = fn(i, v);
    });
    return map;
}

/**
 * 获取标准结果集映射表
 * @param keys 表名
 * @param result 结果集
 * @returns {{}}
 */
function getResult(keys, result) {
    return getResultMap(keys, function (i) {
        return getJSON(result[i]);
    });
}

/**
 * 获取错误情况下的结果集映射表
 * @param keys 表名
 * @returns {{}}
 */
function getResultError(keys) {
    return getResultMap(keys, function () {
        return [];
    });
}

/**
 * 从字符串中解析出img标签
 * @param {String} str
 */
function getStringInImg(str) {
    const imgReg = /<img.*?(?:>|\/>)/gi;
    const srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;
    return str.match(imgReg);
}

/**
 * 删除字符串中的标签
 */
function delHtmlTag(str){
　　return str.replace(/<[^>]+>/g,"");
}

module.exports = {
    format: format,
    getJSON: getJSON,
    decodeHtml: decodeHtml,
    statTimeCost: statTimeCost,
    getResultMap: getResultMap,
    getResult: getResult,
    getResultError: getResultError,
    getStringInImg: getStringInImg,
    delHtmlTag: delHtmlTag
};