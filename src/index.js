import ReactDOM from 'react-dom'
import React from 'react'
import './index.css'
import './assets/reset/reset.scss'
import GetRouter from './router/router'
import * as serviceWorker from './serviceWorker'
import zhCN from 'antd/lib/locale-provider/zh_CN';
import { LocaleProvider } from 'antd'
import moment from 'moment'
import 'moment/locale/zh-cn'
moment.locale('zh-cn')

ReactDOM.render(
    <LocaleProvider locale={zhCN}>
        {GetRouter()}
    </LocaleProvider>,
    document.getElementById('root'));
serviceWorker.unregister();

