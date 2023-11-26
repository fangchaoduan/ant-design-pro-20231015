import { IConfigFromPlugins } from '@/.umi/core/pluginConfig';

/**
 * @name umi 的路由配置
 * @description 只支持 path,component,routes,redirect,wrappers,name,icon 的配置
 * @param path  path 只支持两种占位符配置，第一种是动态参数 :id 的形式，第二种是 * 通配符，通配符只能出现路由字符串的最后。
 * @param component 配置 location 和 path 匹配后用于渲染的 React 组件路径。可以是绝对路径，也可以是相对路径，如果是相对路径，会从 src/pages 开始找起。
 * @param routes 配置子路由，通常在需要为多个路径增加 layout 组件时使用。
 * @param redirect 配置路由跳转
 * @param wrappers 配置路由组件的包装组件，通过包装组件可以为当前的路由组件组合进更多的功能。 比如，可以用于路由级别的权限校验
 * @param name 配置路由的标题，默认读取国际化文件 menu.ts 中 menu.xxxx 的值，如配置 name 为 login，则读取 menu.ts 中 menu.login 的取值作为标题
 * @param icon 配置路由的图标，取值参考 https://ant.design/components/icon-cn， 注意去除风格后缀和大小写，如想要配置图标为 <StepBackwardOutlined /> 则取值应为 stepBackward 或 StepBackward，如想要配置图标为 <UserOutlined /> 则取值应为 user 或者 User
 * @doc https://umijs.org/docs/guides/routes
 */

// 这些路由是前端配置的,也就是默认都有的;
const routes: IConfigFromPlugins['routes'] = [
  // 框架自带非布局页-用户登录页-登录后才能进其它的布局页-这里之所以为登录页,是因为`//src/app.tsx`中在代码逻辑设置了它;
  {
    path: '/user',
    layout: false,
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './User/Login',
      },
    ],
  },

  // 框架自带布局页-欢迎页-需登录的主页默认页;
  {
    path: '/welcome',
    layout: true,
    name: 'welcome',
    icon: 'smile',
    component: './Welcome',
  },

  // 框架自带布局页-admin才能显示的页面-需特定用户登录的布局页示例;
  {
    path: '/admin',
    name: 'admin',
    icon: 'crown',
    access: 'canAdmin',
    routes: [
      {
        path: '/admin',
        redirect: '/admin/sub-page',
      },
      {
        path: '/admin/sub-page',
        name: 'sub-page',
        component: './Admin',
      },
    ],
  },

  // 框架自带布局页-常见表格操作页-需登录的常见增删改查示例页;
  {
    name: 'list.table-list',
    icon: 'table',
    path: '/list',
    component: './TableList',
  },

  // // 框架自带重定向-默认主页的重定向-默认会跳转到欢迎页就是因为配置了这里;
  // {
  //   path: '/',
  //   redirect: '/welcome',
  // },

  // 个人自定义布局页-需登录的布局页示例;
  {
    path: '/FangFrontEndLayoutComponent/FangFrontEndLayoutComponent',
    layout: true,
    name: '前端写死布局组件名称',
    icon: 'smile',
    component: './FangFrontEndLayoutComponent/FangFrontEndLayoutComponent.tsx',
  },

  // 个人自定义布局页-无需登录的自定义布局页-这里之所以无需登录,是因为`//src/app.tsx`中在代码逻辑设置了它;
  {
    path: '/noLoginRequiredLayoutPage',
    name: '无需登录的自定义布局页',
    icon: 'smile',
    component: './noLoginRequiredLayoutPage.tsx',
  },
  // 个人自定义非布局页-无需登录的自定义非布局页;
  {
    path: '/noLoginRequiredPage',
    layout: false,
    name: '无需登录的自定义非布局页',
    icon: 'smile',
    component: './noLoginRequiredPage.tsx',
  },

  // 个人自定义非布局页-需登录的非布局页示例;
  {
    path: '/FangFrontEndComponent/FangFrontEndComponent',
    layout: false,
    name: '前端写死非布局组件名称',
    icon: 'smile',
    component: './FangFrontEndComponent/FangFrontEndComponent.tsx',
  },

  // 个人自定义非布局页-需登录的自定义默认主页-用于跳转到某些页面;
  {
    path: '/DefaultHomepage/DefaultHomepage',
    layout: false,
    name: '自定义默认主页',
    icon: 'smile',
    component: './DefaultHomepage/DefaultHomepage.tsx',
  },

  // 个人自定义重定向-用于默认就可以进入自定义默认主页;
  {
    path: '/',
    redirect: '/DefaultHomepage/DefaultHomepage',
  },

  // 框架自带非布局页-404未找到页-路径都未匹配后跳转的页面;
  {
    path: '*',
    layout: false,
    component: './404',
  },
];

export default routes;
