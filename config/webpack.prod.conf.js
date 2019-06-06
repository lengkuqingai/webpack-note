const merge = require('webpack-merge')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const env = require('./webpack.config')

module.exports = merge(env,{
    mode:'production', //模式配置
    devtool:'cheap-module-source-map',
    plugins:[
        new CleanWebpackPlugin()
    ]
})
