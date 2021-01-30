/*
 * @Author: jyzhang
 * @Description: 删除文件
 * @Date: 2021-01-30 15:04:38
 * @LastEditors: jyzhang
 * @LastEditTime: 2021-01-30 15:05:05
 */
const fs = require('fs-extra')

module.exports = (fileUrl) => fs.remove(fileUrl)