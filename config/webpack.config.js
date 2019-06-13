const path = require('path')
const webpack = require('webpack')
const htmlWebpackPlugin = require('html-webpack-plugin')
const miniCssExtractPlugin= require('mini-css-extract-plugin')
const devMode = process.env.NODE_ENV !== 'production'
module.exports = {
    entry:{//入口文件
        vendor:'babel-polyfill',
        main:path.resolve(__dirname,'../src/index.js'),
    },
    output:{//出口文件
        filename: "[name].[chunkhash:8].chunk.js",
        chunkFilename: "[name].[chunkhash:8].chunk.js",
        path:path.resolve(__dirname,'../dist')
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
                            // minimize:true,  //是否压缩,注：minimize属性已被取消
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
                test:/\.(jpg|png|gif|svg)$/,
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
    optimization: {
        splitChunks: {
            chunks: 'all', //匹配的块的类型：initial（初始块），async（按需加载的异步块），all（所有块）
            minSize: 30000, // 分离后的最小块文件大小，单位为字节
            minChunks: 1, //分离前，该块被引入的次数（也就是某个js文件通过import或require引入的次数）
            maxAsyncRequests: 5, //按需加载时最大的并行加载数量
            maxInitialRequests: 3, //一个入口文件可以并行加载的最大文件数量
            name: true, //代码块的名字，设置为true则表示根据模块和缓存组秘钥自动生成, 实现固化 chunkId，保持缓存的能力
            automaticNameDelimiter: '~', //修改上文中的 “~” ,  若改为： “-” 则分离后的js默认命名规则为 [来源]-[入口的key值].js
            cacheGroups: { //存放分离代码块的规则的对象
                // 比如你要单独把jq之类的官方库文件打包到一起，就可以使用这个缓存组，如想具体到库文件（jq）为例，就可把test写到具体目录下
                vendor: {
                    test: /node_modules/,
                    name: "vendors",
                    priority: 10,
                    enforce: true
                },
                // 这里定义的是在分离前被引用过两次的文件，将其一同打包到common.js中，最小为30K
                common: {
                    name: "commons",
                    minChunks: 2,
                    minSize: 30000
                },
                polyfill: {
                    chunks: 'initial',
                    test: 'polyfill',
                    name: 'polyfill',
                    priority: 20,
                },
            }
        },
        runtimeChunk: {
            name: 'manifest'
        }
    },
    plugins:[
        new htmlWebpackPlugin({
            template:path.resolve(__dirname,'../src/index.html'),
            title:'webpack-clis',
            filename: 'index.html',
            inject:'body'
        }),
        new miniCssExtractPlugin({
            filename:devMode?'[name].css':'[name].[hash].css',
            chunkFilename:devMode?'[id].css':'[id].[hash].css'
        }),
    ],//对应插件
    resolve: {
        extensions: ['.js','.css','.json'],
        alias:[

        ]
    }
}
