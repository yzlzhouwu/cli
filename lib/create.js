/*
 * @Author: jyzhang
 * @Description: 初始化项目
 * @Date: 2021-01-29 16:59:20
 * @LastEditors: jyzhang
 * @LastEditTime: 2021-01-30 14:19:09
 */
const fs = require('fs-extra')
const path = require('path')
const inquirer = require('inquirer')
const { chalk, error, stopSpinner } = require('@vue/cli-shared-utils')
const Creator = require('./Creator')

async function init(projectName, options) {
    // 获取当前工作文件夹
    const cwd = options.cwd || process.cwd();
    const isCurrent = projectName === '.'; // 是否是当前文件夹下创建
    const name = isCurrent ? path.resolve('../', cwd) : projectName;
    const targetDir = path.resolve(cwd, projectName || '.') // 获取目标工作目录
    // 判断是否已经创建相同文件夹
    if (fs.existsSync(targetDir)) {
        if (isCurrent) {
            const { ok } = await inquirer.prompt([{
                name: 'ok',
                type: 'confirm',
                message: '是否在当前目录下初始化项目？'
            }])
            if (!ok) {
                return
            }
        } else {
            const { action } = await inquirer.prompt([{
                name: 'action',
                type: 'list',
                message: `目标目录${chalk.cyan(targetDir)}已经存在，选择操作？`,
                choices: [
                    { name: '重写', value: 'overwrite' },// 重写
                    { name: '取消', value: false }// 取消
                ]
            }])
            if (!action) return
            else if (action === 'overwrite') {
                console.log(`\n ${chalk.red(`删除${chalk.cyan(targetDir)}中...`)}`);
                await fs.remove(targetDir)
                console.log(`\n ${chalk.green(`删除${chalk.cyan(targetDir)}完成`)}`);
            }
        }
    }
    let creator = new Creator(name, Object.assign(options, { isCurrent }))
    creator.create();
}

module.exports = (name, options) => {
    return init(name, options).catch(err => {
        stopSpinner(false)
        error(err)
    })
}