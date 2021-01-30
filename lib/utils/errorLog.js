/*
 * @Author: jyzhang
 * @Description: 报错打印日志
 * @Date: 2021-01-30 14:12:50
 * @LastEditors: jyzhang
 * @LastEditTime: 2021-01-30 14:35:06
 */
const { log, chalk } = require('@vue/cli-shared-utils')
module.exports = {
    log,
    errorLog: (error, errStr) => {
        log(chalk.red(errStr))
        log(chalk.red(error))
        process.exit()
    },
    successLog: (errStr) => {
        log(chalk.green(errStr))
    }
}