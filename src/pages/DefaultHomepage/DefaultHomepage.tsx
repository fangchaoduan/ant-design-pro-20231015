import React from 'react';
import { Link } from 'umi';

const DefaultHomepage: React.FC = () => {
  console.log(`进入了默认主页`);

  return (
    <div>
      <h1>一个默认主页</h1>
      <div>
        <Link to="/user/login">框架自带非布局页-用户登录页-登录后才能进其它的布局页</Link>
      </div>
      <div>
        <Link to="/welcome">框架自带布局页-欢迎页-需登录的主页默认页</Link>
      </div>
      <div>
        <Link to="/admin">框架自带布局页-admin才能显示的页面-需特定用户登录的布局页示例</Link>
      </div>
      <div>
        <Link to="/list">框架自带布局页-常见表格操作页-需登录的常见增删改查示例页</Link>
      </div>

      <div>
        <Link to="/FangFrontEndLayoutComponent/FangFrontEndLayoutComponent">
          个人自定义布局页-需登录的布局页示例
        </Link>
      </div>
      <div>
        <Link to="/FangFrontEndComponent/FangFrontEndComponent">
          个人自定义非布局页-需登录的非布局页示例
        </Link>
      </div>
      <div>
        <Link to="/DefaultHomepage/DefaultHomepage">
          个人自定义非布局页-需登录的自定义默认主页-用于跳转到某些页面
        </Link>
      </div>
      <div>
        <Link to="/404">框架自带非布局页-404未找到页-路径都未匹配后跳转的页面</Link>
      </div>
    </div>
  );
};

export default DefaultHomepage;
