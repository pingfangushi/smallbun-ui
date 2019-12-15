import { IConfig, IPlugin } from 'umi-types';
import defaultSettings from './defaultSettings'; // https://umijs.org/config/
import slash from 'slash2';

const { pwa } = defaultSettings;

const plugins: IPlugin[] = [
  [
    'umi-plugin-react',
    {
      antd: true,
      dva: {
        hmr: true,
      },
      locale: {
        // default false
        enable: true,
        // default zh-CN
        default: 'zh-CN',
        // default true, when it is true, will use `navigator.language` overwrite default
        baseNavigator: true,
      },
      dynamicImport: {
        loadingComponent: './components/PageLoading/index',
        webpackChunkName: true,
        level: 5,
      },
      pwa: pwa
        ? {
            workboxPluginMode: 'InjectManifest',
            workboxOptions: {
              importWorkboxFrom: 'local',
            },
          }
        : false, // default close dll, because issue https://github.com/ant-design/ant-design-pro/issues/4665
      // dll features https://webpack.js.org/plugins/dll-plugin/
      // dll: {
      //   include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch'],
      //   exclude: ['@babel/runtime', 'netlify-lambda'],
      // },
    },
  ],
  [
    'umi-plugin-pro-block',
    {
      moveMock: false,
      moveService: false,
      modifyRequest: true,
      autoAddMenu: true,
    },
  ],
];

export default {
  plugins,
  hash: true,
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/zh/guide/router.html
  routes: [
    {
      path: '/user',
      component: '../layouts/UserLayout',
      routes: [
        {
          name: 'login',
          path: '/user/login',
          component: './user/login',
        },
      ],
    },
    {
      path: '/',
      component: '../layouts/SecurityLayout',
      routes: [
        {
          path: '/',
          component: '../layouts/BasicLayout',
          routes: [
            {
              path: '/',
              redirect: '/welcome',
            },
            {
              path: '/welcome',
              name: 'welcome',
              icon: 'smile',
              component: './Welcome',
            },
            {
              path: 'organization',
              name: 'organization',
              icon: 'team',
              authority: ['manage:route:user', 'manage:route:role', 'manage:route:group'],
              routes: [
                {
                  path: '/organization/user',
                  name: 'user',
                  component: './user',
                  authority: ['manage:route:user'],
                },
                {
                  path: '/organization/role',
                  name: 'role',
                  component: './role',
                  authority: ['manage:route:role'],
                },
                {
                  path: '/organization/group',
                  name: 'group',
                  component: './group',
                  authority: ['manage:route:group'],
                },
              ],
            },
            {
              path: 'manage',
              name: 'manage',
              icon: 'setting',
              authority: ['manage:route:authority', 'manage:route:dict', 'manage:route:logger'],
              routes: [
                {
                  path: 'authority',
                  name: 'authority',
                  component: './authority',
                  authority: ['manage:route:authority'],
                },
                {
                  path: '/manage/dict',
                  name: 'dict',
                  authority: ['manage:route:dict'],
                  component: './dict',
                },
              ],
            },
            {
              path: 'monitor',
              name: 'monitor',
              icon: 'monitor',
              authority: ['manage:route:logger'],
              routes: [
                {
                  path: 'logger',
                  name: 'logger',
                  authority: ['manage:route:logger'],
                  component: './logger',
                },
              ],
            },
            {
              component: './404',
            },
          ],
        },
        {
          component: './404',
        },
      ],
    },
    {
      component: './404',
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // ...darkTheme,
  },
  define: {},
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  disableRedirectHoist: true,
  cssLoaderOptions: {
    modules: true,
    getLocalIdent: (
      context: {
        resourcePath: string;
      },
      _: string,
      localName: string,
    ) => {
      if (
        context.resourcePath.includes('node_modules') ||
        context.resourcePath.includes('ant.design.pro.less') ||
        context.resourcePath.includes('global.less')
      ) {
        return localName;
      }

      const match = context.resourcePath.match(/src(.*)/);

      if (match && match[1]) {
        const antdProPath = match[1].replace('.less', '');
        const arr = slash(antdProPath)
          .split('/')
          .map((a: string) => a.replace(/([A-Z])/g, '-$1'))
          .map((a: string) => a.toLowerCase());
        return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
      }

      return localName;
    },
  },
  manifest: {
    basePath: '/',
  },
  //chainWebpack: webpackPlugin,
  proxy: {
    '/manage/api/': {
      target: 'http://127.0.0.1:8080',
      changeOrigin: true,
      pathRewrite: {
        '^/server': '',
      },
    },
  },
  publicPath: 'http://www.resources.smallbun.cn/preview/',
} as IConfig;
