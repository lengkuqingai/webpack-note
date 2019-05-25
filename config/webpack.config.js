const path = require('path')
const htmlWebpackPlugin = require('html-webpack-plugin')
const miniCssExtractPlugin= require('mini-css-extract-plugin')
const devMode = process.env.NODE_ENV !== 'production'
module.exports = {
    entry:{//入口文件
        vendor:'babel-polyfill',
        main:path.resolve(__dirname,'../src/index.js'),
    },
    output:{//出口文件
        filename: "[name].bundle.js",
        path:path.resolve('dist')
    },
    module:{//处理对应模块
        rules: [
            {
              test:/\.js$/,
              use:'babel-loader',
              exclude:/node_modules/
            },
            {
                test:/\.(sa|sc|c)ss$/,
                use:[
                    devMode?'style-loader':{
                        loader: miniCssExtractPlugin.loader,
                        options:{
                            hmr:process.env.NODE_ENV === 'development'
                        }
                    },
                    {
                        loader:'css-loader',
                        options: {
                            minimize:true,  //是否压缩
                            modules:true, //开启modules，在js中引入css后，就可以导出css文件
                        }
                    },
                    {
                        loader:'postcss-loader',
                        options:{
                            plugins:[
                                require('autoprefixer') //目前只能添加-webkit-前缀
                            ]
                        }
                    },
                    'sass-loader'
                ]
            },
            {
                test:/\.(jpg|png|gif)$/,
                use:[
                    {
                        loader:'url-loader',
                        options:{
                            limit:50*1024, //小于50k就会转成base64
                            outputPath:'images'
                        }
                    }
                ]
            }
        ]
    },
    plugins:[
        new htmlWebpackPlugin({
            template:path.resolve(__dirname,'../src/index.html'),
            title:'webpack-clis',
            filename: 'index.html',
            inject:'head'
        }),
        new miniCssExtractPlugin({
            filename:devMode?'[name].css':'[name].[hash].css',
            chunkFilename:devMode?'[id].css':'[id].[hash].css'
        })
    ],//对应插件
}
