const merge = require('webpack-merge')
const webpack = require('webpack')
const env = require('./webpack.config')

module.exports = merge(env,{
    devServer:{//开发服务器配置
        hot:true,
        host:'localhost',
        port:'8080',
        compress:true,
        open:true,
        overlay:{
            errors:true,
            warnings:false
        },
        quiet:true,
        publicPath:'/',
        watchOptions:{
            poll:1000,
            ignored:'/node_modules/',
            aggregateTimeout:300
        },
        proxy:{
            '/proxy':{
                target:'http://your_api_server.com',
                changeOrigin:true,
                pathRewrite:{
                    '^/proxy':''
                }
            }
        }
    },
    plugins:[
        new webpack.HotModuleReplacementPlugin()
    ],
    mode:'development',
    devtool:'cheap-module-eval-source-map'
})
