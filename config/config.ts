import { IConfig, IPlugin } from 'umi-types';
import defaultSettings from './defaultSettings'; // https://umijs.org/config/
import slash from 'slash2';

// import darkTheme from '@ant-design/dark-theme';
// import aliyunTheme from '@ant-design/aliyun-theme';

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
      // dynamicImport: {
      //   loadingComponent: './components/PageLoading/index',
      //   webpackChunkName: true,
      //   level: 3,
      // },
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
  block: {
    // 国内用户可以使用码云
    // defaultGitUrl: 'https://gitee.com/ant-design/pro-blocks',
    defaultGitUrl: 'https://github.com/ant-design/pro-blocks',
  },
  hash: true,
  targets: {
    ie: 11,
  },
  devtool: false,
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
          authority: ['admin', 'user'],
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
              path: 'develop',
              name: 'develop',
              icon: 'tool',
              routes: [
                {
                  name: 'api',
                  path: 'http://localhost:8080/doc.html',
                  target: '_blank', // 点击新窗口打开
                },
              ],
            },
            {
              name: 'doc',
              icon: 'read',
              path: 'https://pro.ant.design',
              target: '_blank', // 点击新窗口打开
            },
            {
              path: '/blog',
              name: 'blog',
              icon: 'thunderbolt',
              component: './Blog',
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
    // ...aliyunTheme,
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
  proxy: {
    '/api/': {
      target: 'http://127.0.0.1:8080',
      changeOrigin: true,
      pathRewrite: {
        '^/server': '',
      },
    },
  },
  publicPath: 'http://resource.leshalv.com/',
  treeShaking: true,
} as IConfig;
