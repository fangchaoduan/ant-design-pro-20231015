// yarn add react-quill quill-image-resize-module
//react-quill本体,quill-image-resize-module用于对图片进行缩放;

import React, { useEffect, useMemo, useRef, useState } from 'react';

import Quill from 'quill';
import ImageResize from 'quill-image-resize-module'; //图片裁剪
import ReactQuill, { ReactQuillProps } from 'react-quill';
import 'react-quill/dist/quill.snow.css'; //引入样式css

// 注入modules
Quill.register('modules/ImageResize', ImageResize);

// 属性接口
interface FangReactQuillProps {
  /**
   * 内容
   */
  content?: string;
  /**
   * 宽度
   */
  width?: string;
  /**
   * 高度
   */
  height?: string;
  /**
   * 将最新值传递给父组件
   * @param newHtmlStr
   */
  onValueChange: (newHtmlStr: string) => void;
}

const DEFAULT_HEIGHT = '300px'; //富文本输入框默认高度
const DEFAULT_WIDTH = '100%'; //富文本输入框默认宽度
/**
 * @Description: quill富文本编辑器组件
 */
const FangReactQuill: React.FC<FangReactQuillProps> = ({
  content,
  width,
  height,
  onValueChange,
}) => {
  const theRefs = useRef<ReactQuill>(null);
  const [valueText, setValue] = useState('');
  const [widthText, setWidth] = useState('');
  const [heightText, setHeight] = useState('');

  // 自定义上传图片
  const imageHandler = () => {
    console.log('自定义上传图片');

    const theInput = document.createElement('input');
    theInput.setAttribute('type', 'file');
    theInput.setAttribute('accept', 'image/*');
    theInput.click();

    theInput.onchange = async () => {
      if (!theInput?.files?.length) {
        return;
      }
      const file = theInput.files[0];
      const formData = new FormData();
      formData.append('quill-image', file);
      // const res = await uploadFile(formData)
      const url =
        'https://t11.baidu.com/it/u=2367737883,4291674407&fm=58&app=83&f=JPEG?w=200&h=266'; // 预览,获取url

      if (!theRefs.current) {
        return;
      }
      const theQuill = theRefs?.current?.getEditor?.(); //获取到编辑器本身;
      const cursorPosition = theQuill?.getSelection?.()?.index; //获取当前光标位置;
      if (typeof cursorPosition !== 'number') {
        return;
      }
      theQuill.insertEmbed(cursorPosition, 'image', url); //插入图片;
      // theQuill.setSelection(cursorPosition + 1); //光标位置加1;
      theQuill.setSelection(cursorPosition + 1, cursorPosition + 1); //光标位置加1;
    };
  };

  // 保存数据
  const handleSaveHtml = (newValue: string) => {
    setValue(newValue);
    onValueChange(newValue);
  };

  // 自定义配置
  const modules: any = useMemo(
    // useMemo: 解决自定义失焦问题
    () => ({
      imageResize: {
        modules: ['Resize', 'DisplaySize'], // 工具包：允许拖拽、显示尺寸、对齐方式
      },
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
          // [{ size: ['small', false, 'large', 'huge'] }], // 字体大小
          [{ header: [1, 2, 3, 4, 5, 6, false] }], // 几级标题
          [{ color: [] }, { background: [] }], // 字体颜色，字体背景颜色
          [{ font: [] }], // 字体
          [{ align: [] }], // 对齐方式
          ['clean'], // 清除字体样式
        ],
        handlers: {
          image: () => {
            imageHandler();
          },
        },
      },
    }),
    [],
  );

  // 默认属性配置
  const theOptions: ReactQuillProps = {
    placeholder: '请输入内容...',
    theme: 'snow',
    readOnly: false, // 是否只读
    className: 'ql-editor', //组件要加上(className=“ql-editor”)样式类名,否则空格不回显
    onChange: handleSaveHtml,
    value: valueText,
    modules: modules,
    style: {
      width: widthText,
      height: heightText,
      overflow: 'hidden',
      borderBottom: '1px solid #ccc',
    },
  };
  useEffect(() => {
    setValue(content || '');
    setWidth(width || DEFAULT_WIDTH);
    setHeight(height || DEFAULT_HEIGHT);
  }, [content, width, height]);

  return <ReactQuill ref={theRefs} {...theOptions} />;
};

export default FangReactQuill;
