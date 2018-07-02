// 服务端渲染代码
const ejs = require('ejs');
const serialize = require('serialize-javascript');
const asyncBootstrap = require('react-async-bootstrapper').default;
const ReactDomServer = require('react-dom/server');
const Helmet = require('react-helmet').default;

const getStoreState = (stores) => {
    return Object.keys(stores).reduce((result, storeName) => {
        result[storeName] = stores[storeName].toJson();
        return result
    }, {})
}

module.exports = async (ctx, bundle, template) => {
    ctx.headers['ContentType'] = 'text/html';
    // url: ctx.path
    const context = { };

    try {
        const stores = bundle.createStoreMap();
        const routerContext = {};
        const createApp = bundle.default;
        const app = createApp(stores, routerContext, context.url);

        await asyncBootstrap(app);

        // 如果路由中有redirect， 那么直接把路由定向到redirect的页面
        if(routerContext.url) {
            res.status(302).setHeader('Location', routerContext.url);
            ctx.body = "重定向路由";
            return;
        }

        // 定义当前页面需要显示的title, description内容
        const helmet = Helmet.rewind();
        const state = getStoreState(stores);
        const content = await ReactDomServer.renderToString(app);

        const html = ejs.render(template, {
            appString: content,
            initialState: serialize(state),
            title: helmet.title.toString(),
            style: helmet.style.toString(),
            link: helmet.link.toString(),
        })

        ctx.body = html;

    } catch(err) {
        console.log(err)
        throw err
        // ctx.body = "出错啦";
    }
}