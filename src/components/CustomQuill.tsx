// 前提条件: 在项目中引入ReactQuill：目前20231207的版本为`"react-quill": "^2.0.0",`;
// 在终端中执行: `npm install react-quill --save`;

import React, { useEffect } from 'react';

import 'quill/dist/quill.bubble.css'; //用来显示无边框及工具框的主题模式;让配置项theme可以选择`bubble`;
import { useState } from 'react';
import ReactQuill, { ReactQuillProps } from 'react-quill';
import 'react-quill/dist/quill.snow.css'; //默认css布局的主题模式;让配置项theme可以选择`snow`;

// 这个是个人统一用来处理富文本编辑器配置的组件,以下是参考文章;
// 1. [antd社区精选组件  -  <决定该组件选型的文章>](https://ant-design.antgroup.com/docs/react/recommendation-cn);
// 2. [适用于React的富文本编辑器_ReactQuill  -  <主要看的文章>](https://juejin.cn/post/7195124289501134905);
// 3. [react富文本编辑器react-quill的使用  -  <无用的文章,可以参考它的封装思路>](https://juejin.cn/post/7283037880088051746);
// 4. [纠缠不清的富文本编辑器  -  <无用的文章>](https://juejin.cn/post/6844904118151020558);
// 5. [react-quill强大的富文本在React中使用  -  <无用的文章>](https://juejin.cn/post/7025864064945356808);

export type StateType = 'none' | 'modify' | 'check'; //决定组件的状态;

export interface SendMailButtonProps extends ReactQuillProps {
  stateType?: StateType; //决定该富文本组件的类型-个人自定义的props属性;
}

const FangQuill: React.FC<SendMailButtonProps> = (props) => {
  const theProps = { ...props };
  delete theProps.value;
  delete theProps.onChange;
  delete theProps.stateType;

  const [theValue, setValue] = useState<ReactQuillProps['value']>(props?.value || ``); //内部修护一个值,用于实际控制富文本的值;

  console.log('富文本外部传入的值：  props', props);
  useEffect(() => {
    if (props?.value === theValue) {
      return;
    }
    setValue(props?.value || ``);
  }, [props?.value]);
  const handleChangeValue: ReactQuillProps['onChange'] = (value, delta, source, editor) => {
    //与antd中的from进行兼容处理;
    props?.onChange?.(value, delta, source, editor);
    // props?.onChange?.(value);//如果不能回车新增新的一行,就用这个来兼容antd中的from;

    console.log('内部值：value', value, '\n props', props);
    setValue(value);
  };

  // 默认属性配置-修改模式;
  let theOptions: ReactQuillProps = {
    placeholder: '请输入内容...',
    theme: 'snow',
    readOnly: false, // 是否只读
    // className: 'ql-editor', //组件要加上(className=“ql-editor”)样式类名,否则空格不回显;
    modules: {
      // imageResize: {
      //   modules: ['Resize', 'DisplaySize'], // 工具包：允许拖拽、显示尺寸、对齐方式
      // },
      // 工具栏配置
      toolbar: {
        container: [
          ['bold', 'italic', 'underline', 'strike'], // 加粗，斜体，下划线，删除线
          [/**'blockquote',*/ 'code-block'], // 引用，代码块
          ['link', 'image' /**'video' */], // 上传链接、图片、上传视频
          [{ header: 1 }, { header: 2 }], // 标题，键值对的形式；1、2表示字体大小
          [{ list: 'ordered' }, { list: 'bullet' }], // 列表 有序列表、无序列表
          [{ script: 'sub' }, { script: 'super' }], // 上下标
          [{ indent: '-1' }, { indent: '+1' }], // 缩进
          // [{ direction: 'rtl' }], // 文本方向
          [{ size: ['small', false, 'large', 'huge'] }], // 字体大小
          [{ header: [1, 2, 3, 4, 5, 6, false] }], // 几级标题
          [{ color: [] }, { background: [] }], // 字体颜色，字体背景颜色
          [{ font: [] }], // 字体
          [{ align: [] }], // 对齐方式
          ['clean'], // 清除字体样式
        ],
      },

      clipboard: {
        matchVisual: true, // 允许保留换行符
      },
    },
    style: {
      width: '100%',
      height: '300px',
      overflow: 'hidden',
      borderBottom: '1px solid #ccc',
    },
  };

  // 处理单纯的展示模式;
  if (props?.stateType === 'check') {
    theOptions = {
      // placeholder: theOptions.placeholder,
      theme: 'bubble', //主题,去除各种工具栏中的工具;
      readOnly: true, // 是否只读;
      // value: theValue || ``,
      style: {
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        // borderBottom: '1px solid #ccc',
      },
    };
  }

  return (
    <ReactQuill
      theme="snow"
      value={theValue} //内部处理富文本编辑器的值;
      onChange={handleChangeValue} //内部处理富文本编辑器的值变动事件;
      {...theOptions} //用于统一初始定义的富文本配置;
      {...theProps} //保证外部传的富文本配置更优先;
    />
  );
};

export default FangQuill;
