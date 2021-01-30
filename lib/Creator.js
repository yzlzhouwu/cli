/*
 * @Author: jyzhang
 * @Description: 创建工厂函数
 * @Date: 2021-01-30 11:44:54
 * @LastEditors: jyzhang
 * @LastEditTime: 2021-01-30 15:57:55
 */
const fs = require('fs-extra')
const inquirer = require('inquirer')
const { chalk } = require('@vue/cli-shared-utils')
const { exec } = require('child_process')
const { log, errorLog, successLog } = require('./utils/errorLog')
const EventEmitter = require('events')

module.exports = class Creator extends EventEmitter {
    constructor(projectName, options) {
        super()

        this.projectName = options.isCurrent ? projectName.split('\\').slice(-1)[0] : projectName;
        this.options = options;
        this.author = ''
    }

    /**
     * @description: 远程拉取模板
     */
    create() {
        inquirer.prompt([{
            name: 'templateType',
            type: 'list',
            message: '选择需要初始化的项目模板？<intact: 完整框架项目, inline: 内嵌框架项目>',
            choices: [{ name: 'Intact', value: 'intact' }, { name: 'Inline', value: 'inline' }]
        }, {
            name: 'author',
            type: 'input',
            message: '当前操作人员',
            validate: (val) => {
                if (!val) { return chalk.red('当前操作人员不能为空') }
                return true
            }
        }, {
            name: 'isInstall',
            type: 'confirm',
            message: `模板拉取完成后，是否需要安装依赖？\n${chalk.yellow('安装时间比较长')}`
        }]).then(answer => {
            this.author = answer.author;
            const { isCurrent } = this.options;
            log(chalk.green('开始初始化文件\n'))
            log(chalk.gray('初始化中...'))
            const gitUrl = answer.templateType == 'intact' ? 'https://github.com/zjy-github/yzl-intact.git' : 'https://github.com/zjy-github/yzl-inline.git'
            exec(`git clone ${gitUrl} ${isCurrent ? '.' : this.projectName}`, (error, stdout, stderr) => {
                // 当有错误时打印出错误并退出操作
                if (error) errorLog(error, '拉取文件失败')

                // 同步文件模板文件
                const fsFile = `${isCurrent ? '.' : `./${this.projectName}`}/package.json`
                fs.readFile(fsFile, (err, data) => {
                    if (err) errorLog(err, 'package.json读取文件失败')
                    let $data = JSON.parse(data.toString());
                    $data.name = this.projectName;
                    $data.author = this.author;

                    fs.writeFile(fsFile, JSON.stringify($data, '', '\t'), (err) => {
                        if (err) errorLog(err, 'package.json写入文件失败')
                        successLog('初始化完成')

                        if (answer.isInstall) {
                            log(chalk.green('\n开始安装依赖\n'))
                            log(chalk.gray('安装依赖中...'))
                            exec(`${isCurrent ? '' : `cd ${this.projectName} && `}npm install`, (err, stdout) => {
                                if (err) errorLog(err, '安装依赖失败')
                                successLog('安装依赖完成')
                                log(
                                    `使用以下命令开始:\n\n` +
                                    (isCurrent ? `` : chalk.cyan(` ${chalk.gray('$')} cd ${this.projectName}\n`)) +
                                    chalk.cyan(` ${chalk.gray('$')} npm start`)
                                )
                                process.exit() // 退出这次命令行操作
                            })
                        } else {
                            log(
                                `使用以下命令开始:\n\n` +
                                (isCurrent ? `` : chalk.cyan(` ${chalk.gray('$')} cd ${this.projectName}\n`)) +
                                chalk.cyan(` ${chalk.gray('$')} npm start`)
                            )
                            process.exit() // 退出这次命令行操作
                        }
                    })
                    // 删除.git文件
                    fs.removeSync('./.git')
                });
            })
        })
    }

}