import { MenuDataItem, ProLayoutProps } from '@ant-design/pro-components';

/**
 * @name 框架默认的配置; 可通过ProLayoutSettingsType查看可以配置什么,以及ProLayoutProps来查看多余的antd-pro提供的功能;
 */
interface ProLayoutSettingsType extends ProLayoutProps {
  pwa?: boolean;
  logo?: string;
}
const defaultSettings: ProLayoutSettingsType = {
  navTheme: 'light', //导航的主题;

  colorPrimary: '#1890ff', //拂晓蓝;//主色，需要配合umi使用;
  layout: 'mix', //layout的布局方式;//'侧边菜单side' | '顶部菜单top' | '混合布局mix-既有顶部也有侧边';
  contentWidth: 'Fluid', //内容布局:'Fluid流动' | 'Fixed固定'，仅在布局为顶部时有效;
  fixedHeader: false, //是否固定头部;
  fixSiderbar: true, //是否固定侧边栏;
  colorWeak: false, //是否全局增加滤镜;
  pure: false, //是否简约模式,设置之后不再渲染任何layout的东西，但是会有 context，可以获取到当前菜单。
  title: '框架Layout的标题', //Layout的title，也会显示在浏览器标签上;
  // 同步处理menuData的数据，可以动态的控制数据; 异步数据推荐使用 menu.request 和 params。
  menuDataRender: (theList: MenuDataItem[]) => {
    // // 这个好像是在运行时的;同时由于这里不能引入React组件,导致这里最好只能复制或删除一些路由;
    // let theMenuItem: MenuDataItem = {
    //   path: '/一级测试路由URL路径',
    //   name: '同步方式修改路由的新增页面',
    //   icon: 'smile',
    //   component: './Welcome',
    // };
    // let theMenuList = (theList || []).concat(theMenuItem);
    // console.log(`theMenuList-->`, theMenuList);

    // return theMenuList;
    return theList;
  },
  pwa: true,
  logo: 'https://www.baidu.com/img/PCfb_5bf082d29588c07f842ccde3f97243ea.png', //首页logo的配置，可以配置url，React组件和false;
  iconfontUrl: '', //菜单可以添加自己IconFont的项目图标,应该可以用相对路径也可用绝对路径;

  // 参见ts声明，demo 见文档，通过token 修改样式。Token 是一种设计系统的基本元素，可以使用 Token 快速的修改组件库的基础样式。Layout 中可以通过 token 属性来配置这些颜色。
  //https://procomponents.ant.design/components/layout#通过-token-修改样式；
  // [设计系统的基本元素Token]( https://procomponents.ant.design/components/layout#token )
  // bgLayout: 'linear-gradient(red, yellow 28%)',
  token: {
    bgLayout: 'transparent', //layout的背景颜色；
    //侧边side的 token 配置;
    sider: {
      colorMenuBackground: 'linear-gradient(to bottom, #1D36AA, #1667DB, #00D3A1)', //menu的背景颜色;
      colorTextMenuTitle: '#fff', //sider的标题字体颜色;
      colorTextMenu: '#fff', //menuItem的字体颜色;
      colorTextMenuSelected: '#fff', //menuItem的选中字体颜色;
      colorTextMenuItemHover: '#fff', //menuItem的hover字体颜色;
    },
  },
};

export default defaultSettings;
