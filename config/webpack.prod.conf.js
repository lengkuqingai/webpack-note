const merge = require('webpack-merge')
const env = require('./webpack.config')

module.exports = merge(env,{
    mode:'production', //模式配置
    devTool:'cheap-module-source-map'
})
