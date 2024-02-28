// CustomDraggerUpload.tsx

import { InboxOutlined } from '@ant-design/icons';
import { request } from '@umijs/max';
import { Upload } from 'antd';
import { UploadProps } from 'antd/lib/upload/interface';
import React, { useEffect, useState } from 'react';

// import styled from 'styled-components';
import { createGlobalStyle } from 'styled-components';
const GlobalStyles = createGlobalStyle`
  .CustomDraggerUploadContainer {
    &.is-the-check {
      .ant-upload-drag {
        display: none;
      }
    }
  }
`;

interface CustomDraggerUploadProps extends UploadProps {
  fileList?: UploadProps['fileList'];
  value?: UploadProps['fileList'];
  onFileListChange?: (fileList: UploadProps['fileList']) => void;
  noUpload?: boolean;
}

const theFileUpload = `/api/file/upload`; //后端提交文件接口。

const CustomDraggerUpload: React.FC<CustomDraggerUploadProps> = (props) => {
  const theProps = { ...props };
  delete theProps.value;
  delete theProps.disabled;
  delete theProps.fileList;
  delete theProps.onChange;

  const [theDisabled, setTheDisabled] = useState(props?.disabled || false);
  useEffect(() => {
    setTheDisabled(props?.disabled || false);
  }, [props?.disabled]);

  // 自动控制已上传列表;
  let [theFileList, setTheFileList] = useState<UploadProps['fileList']>(props?.value || []);
  useEffect(() => {
    console.log(`props?.value-->`, props?.value);
    // 父组件在onChange事件中,大概率会把传出的theFileList赋值给porps.fileList中,防止死循环;
    if (theFileList === props?.value || !props?.value) {
      return;
    }
    setTheFileList(props?.value || []);
  }, [props?.value]);

  useEffect(() => {
    // 这个是为了给父组件传一个onChange事件;

    if (theFileList === props?.value) {
      return;
    }

    props?.onChange?.(theFileList); //兼容antd的校验机制;
  }, [theFileList]);

  const theUploadProps: UploadProps = {
    fileList: theFileList,
    progress: {
      strokeColor: {
        '0%': '#108ee9',
        '100%': '#87d068',
      },
    },
    onChange: async (info) => {
      if (props?.noUpload) {
        console.log(`不可上传,只能处理onChange: props?.noUpload-->`, props?.noUpload);
        return;
      }

      console.log(`列表数据变动事件onChange: info`, info);
      setTheFileList(info?.fileList || []);
    },
    customRequest: async (theOptions) => {
      if (props?.noUpload) {
        console.log(`不可上传,只能处理customRequest: props?.noUpload-->`, props?.noUpload);

        return;
      }

      const formData = new FormData();
      // console.log(`自定义上传事件: theOptions`, theOptions);
      formData.append('file', theOptions.file, theOptions.file.name);
      try {
        // 这个接口是后端给的,用于把文件上传到后端的服务器;
        interface ApiResponse {
          code: number; // 状态码;
          msg: null | string; // 消息，可以为 null 或字符串;
          data: {
            uuid: string; // 文件 UUID;
            sysFileName: string; // 文件名;
            sysFileExtension: string; // 文件扩展名;
            sysFileSize: number; // 文件大小（字节）;
            sysCreateTime: string; // 文件创建时间;
            url: string; // 文件绝对URL;
            sysFileStoragePath: string; // 文件相对路径;
          };
          error: boolean; // 是否有错误;
          success: boolean; // 是否成功;
        }

        setTheDisabled(true);
        const res = await request<ApiResponse>(theFileUpload, {
          data: formData,
          method: 'POST',
          onUploadProgress: (data) => {
            console.log(`上传中data`, data);

            // let { total, loaded } = data;
            let params = {
              percent: Math.round((data.loaded / data.total) * 100).toFixed(2),
            };
            theOptions.file.percent = Number(params.percent);
            theOptions.file.status = `uploading`;
            if (theOptions.file.percent >= 100) {
              theOptions.file.status = `done`;
            }
            // console.log(`theOptions.file`, theOptions.file);

            const theList = [
              theOptions.file,
              ...theFileList.filter((item) => item.uid !== theOptions.file.uid),
            ];
            theFileList = theList;
            setTheFileList(theList);
            theOptions?.onProgress?.(params, theOptions.file);
          },
        });
        console.log(`res`, res);

        if (res?.code !== 200) {
          throw new Error(`上传不成功`);
        }

        console.log(`自定义上传成功: theOptions`, theOptions, `\n theFileList`, theFileList);
        const theList = [
          {
            ...(res?.data || {}),
            uid: res?.data?.uuid,
            sysFileUuid: res?.data?.uuid,
            url: res?.data?.url,
            name: res?.data?.sysFileName,
            sysFileName: res?.data?.sysFileName,
            status: 'done',
          },
          ...theFileList.filter((item) => item.uid !== theOptions.file.uid),
        ];
        theFileList = theList;
        setTheFileList(theList);
      } catch (error) {
        console.log(`error`, error);
        theFileList = theFileList.filter((item) => item.uid !== theOptions.file.uid);
        setTheFileList(theFileList);
      } finally {
        setTheDisabled(false);
      }
    },
  };

  // console.log(`上传组件: props-->`, props);
  // console.log(`上传组件: theFileList-->`, theFileList);

  return (
    <>
      <GlobalStyles />
      <Upload.Dragger
        {...theUploadProps}
        {...theProps}
        disabled={theDisabled}
        rootClassName={`CustomDraggerUploadContainer ${theDisabled ? `is-the-check` : ``}`}
      >
        {!props?.noUpload && (
          <>
            <div>
              <InboxOutlined />
            </div>
            <div>单击或拖动文件到此区域进行上传</div>
          </>
        )}
      </Upload.Dragger>
    </>
  );
};

export default CustomDraggerUpload;
