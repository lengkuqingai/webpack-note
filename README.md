# 如何优雅的构建webpack脚手架
## webpack原理介绍
### webpack构建流程
1. 解析webpack配置参数，合并从shell传入和webpack.config.js文件里配置的参数，生产最后的配置结果。
2. 注册所有配置的插件，好让插件监听webpack构建生命周期的事件节点，以做出对应的反应。
3. 从配置的entry入口文件开始解析文件构建AST语法树，找出每个文件所依赖的文件，递归下去。
4. 在解析文件递归的过程中根据文件类型和loader配置找出合适的loader用来对文件进行转换。
5. 递归完后得到每个文件的最终结果，根据entry配置生成代码块chunk。
6. 输出所有chunk到文件系统。
### webpack构建过程重要的事件节点
* compile 开始编译
* make 从入口点分析模块及其依赖的模块，创建这些模块对象
* build-module 构建模块
* after-compile 完成构建
* seal 封装构建结果
* emit 把各个chunk输出到结果文件
* after-emit 完成输出
------
*注：* 需要注意的是，在构建生命周期中有一系列插件在合适的时机做了合适的事情，比如UglifyJsPlugin会
在loader转换递归完后对结果再使用UglifyJs压缩覆盖之前的结果。
## 脚手架搭建
1. npm init 初始化package.json 文件
2. cnpm i webpack webpack-cli -D 安装webpack依赖(webpack4除了要安装webpack外还要安装webpack-cli)
3. cnpm i react react-dom react-router-dom -S 安装react核心库
4. cnpm i webpack-dev-server -D 配置开发服务器
5. cnpm i webpack-merge -D 合并webpack配置项，区分开发环境和生产环境
6. 配置执行scripts文件
    "dev":"webpack-dev-server --config ./config/webpack.dev.conf.js",
    "build":"webpack --config ./config/webpack.prod.conf.js"
7. cnpm i html-webpack-plugin -D 安装html生成插件以及属性配置
    > title: 生成html文件标题
    > filename: 生成的html文件名
    > template: 依赖的html文件模板
    > inject: （true|body|head|false）
    true 默认值，script标签位于html文件的 body 底部，body script标签位于html文件的 body 底部，head script标签位于html文件的 head中，false 不插入生成的js文件，这个几乎不会用到的
    > favicon：配置favicon的路径
    > cache: 默认是true的，表示内容变化的时候生成一个新的文件
    > chunks: chunks主要用于多入口文件，当你有多个入口文件，那就回编译后生成多个打包后的文件，那么chunks 就能选择你要使用那些js文件,如果没有设置，默认全部入口js文件都加载
    ```
      entry: {
          index: path.resolve(__dirname, './src/index.js'),
          devor: path.resolve(__dirname, './src/devor.js'),
          main: path.resolve(__dirname, './src/main.js')
      }

      plugins: [
          new httpWebpackPlugin({
              chunks: ['index','main']
          })
      ]
    ```
8. mode配置，根据不同环境配置不同参数，可选值（'development','production','none'）项目中可通过process.env.NODE_ENV获取环境参数
9. devServer配置
    > hot热更新 设置为true，才会启用HMR插件
    > host主机名 如‘localhost’
    > port端口号 如‘8080’
    > compress 为true时，开启虚拟服务器时会进行代码压缩
    > open 为true，自动打开浏览器
    > overlay (Boolean | Object) 为true则浏览器上会全屏显示编译的errors和warnings。默认false
        可灵活配置,只看错误不看警告
        ```
            overlay:{
                errors:true,
                warnings:false
            }
        ```
    > quiet 为true，此配置可让webpack的警告和错误不输出到终端
    > publicPath 类似于output.publicPath(作用于js，css，img),但是它作用于请求路径
        举例：
        ```
            // devServer.publicPath
            publicPath: "/assets/"
            // 原本路径 --> 变换后的路径
            http://localhost:8080/app.js --> http://localhost:8080/assets/app.js
        ```
    > watchOptions 监听模式，用来监听文件是否被改动过
        1.aggregateTimeout：一旦第一个文件改变，在重建之前添加一个延迟毫秒。
        2.ignored：排除需要观察的文件。
        3.poll：每隔多少毫秒监听一次文件变化。
        ```
            watchOptions: {
              aggregateTimeout: 300,
              poll: 1000，
              ignored: /node_modules/
            }
        ```
    > proxy 代理
        1.target 目标源
        2.changeOrigin 为true，则更改源
        3.pathRewrite 重写路径
        ```
          proxy: {
            '/proxy': {
                target: 'http://your_api_server.com',
                changeOrigin: true,
                pathRewrite: {
                    '^/proxy': ''
                }
          }
        ```
10. module 配置模块如何处理
    rules属性： 配置模块的读取和解析规则，
    数组每项一般有如下属性：
    > test（应用规则）
    > include（包含的文件）
    > exclude（排除的文件）
    > use（应用的loader）
    > options（loader的参数配置）
    > enforce（可以让一个loader的执行顺序放到最前或者最后pre|post）
    > noParse 忽略对部分没采用模块化的文件的递归解析和处理 列如noParse: /jquery|chartjs/ *注*被忽略掉的文件里不应该包含 import 、 require 、 define 等模块化语句，不然会导致构建出的代码中包含无法在浏览器环境下执行的模块化语句
    > parse noParse控制文件是否解析，而parse可以更详细的配置哪些模块语法是否解析
        ```
         parser: {
             amd: false, // 禁用 AMD
             commonjs: false, // 禁用 CommonJS
             system: false, // 禁用 SystemJS
             harmony: false, // 禁用 ES6 import/export
             requireInclude: false, // 禁用 require.include
             requireEnsure: false, // 禁用 require.ensure
             requireContext: false, // 禁用 require.context
             browserify: false, // 禁用 browserify
             requireJs: false, // 禁用 requirejs
            }
         ```
    * 处理css  cnpm i style-loader css-loader sass-loader node-sass postcss-loader autoprefixer -S -D 处理css。
        css-loader是允许将css文件引入到.js文件中，css-loader 启用了module：true，可如下使用
        ```
            .box  {
                 composes: bigBox from './common.css';//为了优先级，默认将引入的写入到括号中的第一行
                 width: 200px;
                 height: 200px;
                 background: skyblue;
                 border-radius:5%;
             }
        ```
        style-loader把css一同打包到js文件，js文件再DOM动态创建style标签并添加到页面里
        使用插件cnpm i mini-css-extract-plugin -D，将css文件单独抽出来,用来代替style-loader
    * 处理图片 cnpm i file-loader url-loader -D 
        file-loader的作用是解析地址，url-loader的作用是把图片转成base64，url-loader里已经包含file-loader功能
    * 处理js cnpm i -D babel-core babel-loader babel-plugin-transform-runtime babel-preset-es2015 babel-preset-stage-0
        cnpm i -S babel-runtime babel-polyfill 并且在项目根目录，新建.babelrc 这样babel-loader运行的时候，会检查这个配置文件，并读取相关的语法和插件配置
        >> babel-core 把 js 代码分析成 ast (抽象语法树, 是源代码的抽象语法结构的树状表现形式)，方便各个插件分析语法进行相应的处理。有些新语法在低版本 js 中是不存在的，如箭头函数，rest 参数，函数默认值等，这种语言层面的不兼容只能通过将代码转为 ast，再通过语法转换器分析其语法后转为低版本 js。
        >> babel-preset-* :babel-plugin-* 代表了一系列的转码插件 
                          有了 babel-plugin 系列，可以按需配置自己想要的特性，若是想搭个 es6 环境，一个个地配置各个插件，我猜你会疯掉。babel-preset 系列就可以满足我们的需求，babel-preset 系列打包了一组插件，类似于餐厅的套餐。如 babel-preset-es2015 打包了 es6 的特性，babel-preset-stage-0 打包处于 strawman 阶段的语法
        >> babel-plugin-transform-runtime 这个模块会将我们的代码重写，如将 Promise 重写成 _Promise（只是打比方），并且统一将工具函数放在单个模块中，避免被重复打包  
        
11. [devTool配置](https://www.jianshu.com/p/62dc120d96d0)可供参考
     ![参考图](https://upload-images.jianshu.io/upload_images/13805935-5616f8a35b8a6262.png)
    * eval:每个模块用eval执行，并且存在@sourceUrl，就是说这种配置的devtool，在打包的时候，生成的bundle.js文件，模块都被eval包裹，并且后面跟着sourceUrl,指向的是原文件index.js，调试的时候，就是根据这个sourceUrl找到的index.js文件的
    * source-map:这种配置会生成一个带有.map文件，这个map文件会和原始文件做一个映射，调试的时候，就是通国这个.map文件去定位原来的代码位置的
    * cheap:低消耗打包，什么叫低消耗，就是打包的时候map文件，不会保存原始代码的列位置信息，只包含行位置信息
    * module:调试的代码不会被转换，会保留原始代码语法
    * eval-source-map:结果是并没有一个map文件，而是在文件里面除了一个sourceURL还有一个surceMappingURL(这个模式比较特殊), 这个后面跟着的是map文件的base64码，他不是生成map文件，而是把map文件内容变成base64，插入到bundle.js文件中
    * cheap-eval-source-map:光标没有列信息,其他同上
    * ......
    *注：* 开发环境推荐：cheap-module-eval-source-map，生产环境推荐：cheap-module-source-map。理由：使用 module 可支持 babel 这种预编译工具（在 webpack 里做为 loader 使用），使用 eval 方式可大幅提高持续构建效率,直接将sourceMap放入打包后的文件，会明显增大文件的大小，不利于静态文件的快速加载；而外联.map时，.map文件只会在F12开启时进行下载（sourceMap主要服务于调试），故推荐使用外联.map的形式
12. resolve配置 alias别名，extensions访问后缀列表
13. 常用插件列表集合
    cnpm i clean-webpack-plugin -D 清除前次打包文件
    webpack.HotModuleReplacementPlugin() 配合devServer的hot属性，启用热更新功能
14. externals配置：如果我们想引用一个库，但是又不想让webpack打包，并且又不影响我们在程序中以CMD、AMD或者window/global全局等方式进行使用，那就可以通过配置externals，格式为 'aaa' : 'bbb', 其中，aaa表示要引入的资源的名字，bbb表示该模块提供给外部引用的名字
## 临时搭建react环境调试
### 公共库安装
    cnpm i react-dom react-redux react-router react-router-redux react-scripts redux redux-logger redux-thunk axios antd  -S
    cnpm install babel-preset-react -D 识别html转换为jsx语法
    cnpm i babel-plugin-transform-decorators-legacy -S -D  兼容旧的装饰器行为
