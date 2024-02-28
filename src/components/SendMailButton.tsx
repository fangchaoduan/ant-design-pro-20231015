import { Button, Divider, Form, Input } from 'antd';
import { ButtonProps } from 'antd/lib/button';
import React, { useEffect, useState } from 'react';
import './SendMailButton.less';

import { ReplyIcon, SendIcon, TransmitIcon, TrashCanIcon } from '@/Icon';
import {
  addEmailSend,
  deleteEmailDelete,
  getEmailSelectInfoById,
  GetEmailSelectInfoByIdType,
  modifyEmailAdd,
} from '@/services/ProjectFile/ParticipatingUnitsDocuments';
import {
  ArrowLeftOutlined,
  CloseOutlined,
  DownloadOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { message } from 'antd';
import { Rule } from 'antd/lib/form';
import moment from 'moment';
import { MouseEventHandler } from 'react';
import ReactDOM from 'react-dom';
import CustomDraggerUpload from './SendMailButton/CustomDraggerUpload';
import EnumSelect from './SendMailButton/EnumSelect';
import FangQuill from './SendMailButton/FangQuill';
import UserSelect from './SendMailButton/UserSelect';
// import FangReactQuill from './SendMailButton/FangReactQuill';

export type StateType =
  | `none` // `none`为隐藏; <:-|-:> 无回显;
  | `add` // `delete`为删除; <:-|-:> 无回显;
  | `modify` // `add`为新增; <:-|-:> 有回显--->不请求接口--->所有数据重置为默认值;
  | `check` // `modify`为修改; <:-|-:> 有回显--->通过邮件id请求接口--->数据与新增时保持一致正常回显-->回显的数据可以修改;
  | `delete` // `check`为查看; <:-|-:> 有回显--->通过邮件id请求接口--->数据与新增时保持一致正常回显-->回显的数据不可以修改仅可查看;
  | `replyAdd` // `replyAdd`为回复且新增模式; <:-|-:> 有回显--->通过邮件id请求接口--->与新增时字段有变化:`主题字段值`为`RE: +旧主题字段值`,`收件人邮箱字段值`为`旧发件人邮件字段值`,`收件人帐号字段值`为`旧发件人帐号字段值`,`内容字段值`为`空字符串`,`原邮件内容字段值`为`旧内容字段值`-->回显的数据可以修改;
  | `transmitAdd`; // `transmitAdd`为转发且新增模式; <:-|-:> 有回显--->通过邮件id请求接口--->与新增时字段有变化:`主题字段值`为`Fw: +旧主题字段值`,`收件人邮箱字段值`为`空字符串`,`收件人帐号字段值`为`空数组`,`内容字段值`为`空字符串`,`原邮件内容字段值`为`旧内容字段值`-->回显的数据可以修改;

export interface SendMailButtonProps extends ButtonProps {
  stateType?: StateType; //按钮类型;
  basicData?: {
    senderName?: string; //发件人名称;
    senderId?: string; //发件人id;
    senderEmail?: string; //发件邮箱;
    containerDOM?: HTMLDivElement; //弹框所在的DOM;
    // addresseeName?: string; //收件人名称;
    // addresseeId?: string; //收件人名称;
    // addresseeEmail?: string; //收件邮箱;
    // emailStatus: string; //邮件状态;0：已保存未发送，1：已发送 2:已保存已发送?;
  }; //来自于环境的变量,内部不会修改到的;//如父组件的id之类的;
  currentData?: {
    emailId: string; //邮件id;
  }; //决定该组件初始数据,一般是按钮id,向后端发起请求后通过它可拿到初始化数据;
  theData?: any; //决定该组件初始化数据,为一个对象,不用向后端发起请求就可初始化数据;
  onCancel?: () => any; //点击取消后执行的回调;
  onSuccess?: () => any; //点击取消后执行的回调;
}

const SendMailButton: React.FC<SendMailButtonProps> = (props) => {
  let theProps = { theData: {}, ...props };
  // 把特殊的几个属性值移除掉;
  delete theProps.children;
  delete theProps.theData;
  delete theProps.stateType;
  delete theProps.basicData;
  delete theProps.currentData;
  delete theProps.onCancel;
  delete theProps.onSuccess;

  // 处理当前弹框的状态;
  const [theStateType, setTheStateType] = useState<StateType>('none');

  const [theId, setTheId] = useState(props?.currentData?.emailId || ``);
  useEffect(() => {
    if (theStateType === `none`) {
      setTheId(``);
      return;
    }
    setTheId(theId || props?.currentData?.emailId || ``);
  }, [props?.currentData?.emailId, theStateType]);

  // 处理取消操作;
  const handleCancel = async () => {
    setTheStateType('none');
    props?.onCancel?.();
  };

  const [messageApi, contextHolder] = message.useMessage(); //提示信息;

  useEffect(() => {
    if (theStateType === `none` || theStateType === `delete`) {
      return;
    }
  }, [theStateType]);

  interface EmailAttachment {
    uuid: string;
    sysFileName: string;
    sysFileExtension: string;
    sysFileSize: number;
    sysCreateTime: string;
    url: string;
    sysFileStoragePath: string;
    uid: string;
    name: string;
    status: string;
  }
  type FormItemType = {
    theInputName01: string; // 主题;
    theInputName02: string; // 编号;
    theInputName03: string; // 收件人邮箱-以分号分隔;
    theInputName04: string; // 抄送人邮箱-以分号分隔;
    theInputName05?: string; // 发件人帐号名称;
    theInputName06?: string; // 发件人邮箱;
    theInputName07?: string; // 邮件发送时间;
    theInputName08?: string; // 发件人账号id;
    theInputName09?: string; // 发件人邮箱;
    theSelectName01: string; // 收件类型;
    theSelectName02: string | boolean; // 回复要求;
    theSelectName05: string[]; // 收件人帐号id;
    theSelectName06: string[]; // 抄送人帐号id;
    theSelectName07?: string[]; // 收件人帐号名称;
    theSelectName08?: string[]; // 抄送人帐号名称;
    theOtherName01: string; // 邮件内容;
    theOtherName02: EmailAttachment[]; // 邮件附件;
    theOtherName03: string; // 原邮件内容;
    theOtherName04: string; // 原邮件id;
  };
  const [theFormInstance] = Form.useForm<FormItemType>(); //表单实例;

  const [theForm, setTheForm] = useState<FormItemType>({
    theInputName01: ``,
    theInputName02: ``,
    theInputName03: ``,
    theInputName04: ``,
    theInputName05: ``,
    theInputName06: ``,
    theSelectName05: [],
    theSelectName06: [],
    theSelectName01: ``,
    theSelectName02: ``,
    theOtherName01: ``,
    theOtherName02: [],
    theOtherName03: ``,
    theOtherName04: ``,
  });

  // 处理数据回显;
  const handleReset = async (thisStateType = theStateType) => {
    // `none`与`add`与`delete`;
    let theData: GetEmailSelectInfoByIdType = {
      emailUuid: ``, // 邮件id;
      emailTopic: ``, // 邮件主题;
      emailNo: ``, // 邮件编号;
      recipientAccount: ``, // 收件人帐号;
      recipientsEmail: ``, // 收件人邮箱;
      userEmail: ``, // 发件人邮箱;
      ccToEmail: ``, // 抄送人邮箱;
      ccAccountNumber: ``, // 抄送人账号;
      emailType: ``, // 文件类型;
      emailReply: undefined, // 是否回复;
      emailContent: ``, // 邮件内容;
      emailSender: ``, // 发件人名称;
      emailStatus: ``, // 邮件状态(已读，未读);
      emailAttachment: [], // 邮件附件;
      emailIsSend: undefined, // 文件是否发送（0：已保存未发送，1：已发送）;
      readStatus: undefined, // 文件是否已读（0：未读，1：已读）;
      emailSendTime: ``, // 邮件发送时间;
      createTime: ``, // 邮件创建时间;
      recipientAccountName: ``, // 收件人帐号名称;
      ccAccountNumberName: ``, // 抄送人帐号名称;
      emailSenderId: ``, // 发件人账号id;
      originalEmailUuid: ``, // 原始邮件id-用来做转发与回复;
    };
    let theOldEmailContent = ``;

    if (thisStateType !== `add` && thisStateType !== `none` && theId) {
      try {
        const params = {
          emailUuid: theId,
        };
        let res1 = await getEmailSelectInfoById(params);
        console.log(`res1-->`, res1);
        if (res1?.code !== 200 || !res1?.data) {
          throw new Error(`第一次查询数据出错`);
        }
        theData = res1?.data;

        if (res1?.data?.originalEmailUuid) {
          const params = {
            emailUuid: res1?.data?.originalEmailUuid,
          };
          let res2 = await getEmailSelectInfoById(params);
          if (res2?.code !== 200 || !res2?.data) {
            throw new Error(`第二次查询数据出错`);
          }
          theOldEmailContent = res2?.data?.emailContent || ``;
        }
      } catch (error) {
        console.log(`error`, error);
        messageApi.destroy();
        messageApi.warning(`数据查询出错`);

        return false;
      } finally {
        setTimeout(messageApi.destroy, 2000);
      }
    }

    try {
      // `modify`与`delete`;
      const theObject: FormItemType = {
        theInputName01: theData.emailTopic || ``, // 邮件主题;
        theInputName02: theData.emailNo || ``, // 邮件编号;
        theInputName03: theData.recipientsEmail || ``, //收件人邮箱;
        theInputName04: theData.ccToEmail || ``, // 抄送人邮箱;
        theInputName05: theData.emailSender || ``, // 发件人帐号名称;
        theInputName06: theData.userEmail || ``, // 发件人邮箱;
        theInputName07: theData.emailSendTime || ``, // 邮件发送时间;
        theInputName09: theData.recipientAccountName || ``, // 收件人帐号名称;
        theSelectName05: theData.recipientAccount ? theData.recipientAccount?.split(`;`) : [], // 收件人帐号;
        theSelectName06: theData.ccAccountNumber ? theData.ccAccountNumber?.split(`;`) : [], // 抄送人账号;
        theSelectName07: (theData?.recipientAccountName || undefined)?.split?.(`;`) || [], // 收件人帐号名称;
        theSelectName08: (theData?.ccAccountNumberName || undefined)?.split(`;`) || [], // 抄送人帐号名称;
        theSelectName01: theData.emailType || ``, // 文件类型;
        theSelectName02: theData.emailReply || ``, // 回复要求-是否回复;
        theOtherName01: theData.emailContent || ``, // 邮件内容;
        theOtherName02: [], // 邮件附件;
        theOtherName03: theOldEmailContent || ``, // 原邮件内容;
        theOtherName04: theData.originalEmailUuid || ``, // 原邮件id;
      };
      const theAttachmentList = (theData.emailAttachment || [])?.map((item) => {
        const theItem = {
          ...item,
          uid: item?.sysFileUuid,
          sysFileUuid: item?.sysFileUuid,
          sysFileName: item?.sysFileName,
          url: item?.url,
          name: item?.sysFileName,
          status: 'done',
        };
        return theItem;
      });
      theObject.theOtherName02 = theAttachmentList;

      if (thisStateType === `replyAdd`) {
        theObject.theInputName01 = `RE: ${theData.emailTopic}`; //`主题字段值`为`RE：+旧主题字段值`;
        theObject.theInputName03 = theData.userEmail || ``; //`收件人邮箱字段值`为`旧发件人邮件字段值`;
        theObject.theSelectName05 = theData.emailSenderId ? [theData.emailSenderId] : []; //`收件人帐号字段值`为`旧发件人帐号字段值`;
        theObject.theOtherName01 = ``; //`内容字段值`为`空字符串`;
        theObject.theOtherName02 = []; //`邮件附件字段值`为`空数组`;
        theObject.theOtherName03 = theData.emailContent || ``; // `原邮件内容字段值`为`旧内容字段值`;
      }
      if (thisStateType === `transmitAdd`) {
        theObject.theInputName01 = `Fw: ${theData.emailTopic}`; //`主题字段值`为`Fw: +旧主题字段值`;
        theObject.theInputName03 = ``; //`收件人邮箱字段值`为`空字符串`;
        theObject.theSelectName05 = []; //`收件人帐号字段值`为`空数组`;
        theObject.theOtherName01 = ``; //`内容字段值`为`空字符串`;
        theObject.theOtherName02 = []; //`邮件附件字段值`为`空数组`;
        theObject.theOtherName03 = theData.emailContent || ``; // `原邮件内容字段值`为`旧内容字段值`;
      }

      setTheForm(theObject);
      theFormInstance.setFieldsValue(theObject);
      return true;
    } catch (error) {
      console.log(`error`, error);

      messageApi.destroy();
      messageApi.warning(`数据回显出错`);
      return false;
    } finally {
      setTimeout(messageApi.destroy, 2000);
    }
  };

  useEffect(() => {
    // 不显示的不用做处理;
    if (theStateType === `none`) {
      return;
    }

    handleReset(theStateType);
  }, [props.basicData, theId, theStateType]);

  // 处理表单的确定操作-保存后要查询一次,把后端返回的数据给回显;
  const handleSave = async (theType: `发送` | `保存` = `发送`, thisStateType = theStateType) => {
    const formData = theFormInstance.getFieldsValue(); //当前表单中的数据;
    console.log('formData', formData);
    try {
      let res = await theFormInstance.validateFields(); //触发校验;
      console.log('res', res);
    } catch (error) {
      console.log('校验出错: error', error);
      return;
    }

    try {
      const params = {
        emailUuid: theId || ``, // 邮件id;
        emailTopic: formData.theInputName01 || ``, // 邮件主题;
        emailNo: formData.theInputName02 || ``, // 邮件编号;
        recipientsEmail: formData.theInputName03 || ``, // 收件人邮箱;
        ccToEmail: formData.theInputName04 || ``, // 抄送人邮箱;
        recipientAccount: formData.theSelectName05?.join?.(';') || ``, // 收件人帐号;
        ccAccountNumber: formData.theSelectName06?.join?.(';') || ``, // 抄送人账号;
        emailType: formData.theSelectName01 || ``, // 文件类型;
        emailReply: formData.theSelectName02 || ``, // 回复要求-是否回复;
        emailContent: formData.theOtherName01 || ``, // 邮件内容;
        // emailSender: formData.||``,// 发件人;
        // emailStatus: formData.||``,// 邮件状态(已读，未读);
        emailAttachment: formData?.theOtherName02 || [], // 邮件附件;
        // emailIsSend: 0,// 文件是否发送（0：已保存未发送，1：已发送）;
        // emailSendTime: formData.||``,// 邮件发送时间;
        // createTime: formData.||``,// 邮件创建时间;
        originalEmailUuid: formData?.theOtherName04 || ``, // 原始邮件id-用来做转发与回复;
      };
      if (thisStateType === `replyAdd` || thisStateType === `transmitAdd`) {
        params.emailUuid = ``;
        params.originalEmailUuid = theId;
      }

      let theAPI = addEmailSend;
      if (theType !== `发送`) {
        theAPI = modifyEmailAdd;
      }
      const res = await theAPI(params);
      console.log(`邮件: res-->`, res);
      if (res?.code !== 200) {
        messageApi.error(res?.msg || `操作失败`);
        return false;
      }

      // console.log(`保存回显: res?.data?.emailUuid-->`, res?.data?.emailUuid);
      setTheId(res?.data?.emailUuid || ``);
      if (typeof res?.data === `string`) {
        setTheId(res?.data || ``);
      }

      messageApi?.success?.(`操作成功`);

      props?.onSuccess?.();
      if (theType === `发送`) {
        setTheStateType(`none`);
        return true;
      }

      setTheStateType(`modify`);
      return true;
    } catch (error) {
      console.log(`error`, error);

      return false;
    } finally {
      setTimeout(messageApi.destroy, 2000);
    }
  };

  console.log(`保存回显: theId-->`, theId);

  const theRules01: Rule[] = [
    {
      validator: (rule) => {
        const theInputName03 = theFormInstance.getFieldValue('theInputName03'); //收件人邮箱;
        const theSelectName05 = theFormInstance.getFieldValue('theSelectName05'); //收件人账号;

        console.log(`rule-->`, rule);

        // 进行判断逻辑
        if (theInputName03 || theSelectName05?.length) {
          // if (rule?.field === `theInputName03`) {
          //   theFormInstance.validateFields(['theSelectName05']);
          // }
          // if (rule?.field === `theInputName05`) {
          //   theFormInstance.validateFields(['theSelectName03']);
          // }
          return Promise.resolve();
        }

        return Promise.reject(`收件人账号与收件人邮箱必须填一项`);
      },
    },
  ];

  // 处理删除;
  const handleDelete = async (theList: string[]) => {
    messageApi.loading('操作中');

    try {
      let params = {
        emailUuid: theList || [theId] || [],
      };
      if (!params.emailUuid?.length) {
        messageApi.destroy();
        messageApi.warning(`没有要删除的id`);
        return;
      }
      console.log('处理删除-params', params);
      let res = await deleteEmailDelete(params);
      if (res?.code !== 200) {
        messageApi.destroy();
        messageApi.warning(res?.msg || '操作出错');
        return;
      }

      messageApi.destroy();
      messageApi.success('操作成功');
      props?.onSuccess?.();
      setTheStateType(`none`);
    } catch (error) {
      console.log('error', error);

      return false;
    } finally {
      setTimeout(messageApi.destroy, 2000);
    }
  };

  // 处理点击该组件默认展示按钮后的操作;
  const handleClick: MouseEventHandler<HTMLElement> = async (event) => {
    props?.onClick?.(event); //优先用户绑定的按钮点击事件;

    if (theStateType === `none`) {
      setTheStateType(props?.stateType || `none`);
      return;
    }

    if (theStateType === `delete` && theId) {
      handleDelete([theId]);
      return;
    }
    setTheStateType(`none`);
  };

  // 邮件详情主要渲染DOM;
  const ThePopUpDom = () => {
    return (
      <div
        className="SendMailButtonContainer"
        style={{
          display: theStateType !== 'none' ? 'flex' : 'none',
        }}
      >
        {(theStateType === 'add' ||
          theStateType === 'modify' ||
          theStateType === 'replyAdd' ||
          theStateType === 'transmitAdd') && (
          <div className="the-head01-box">
            <Button
              type="primary"
              icon={<SendIcon />}
              onClick={handleSave.bind(null, `发送`, theStateType)}
            >
              发送
            </Button>

            <Button
              icon={<DownloadOutlined />}
              onClick={handleSave.bind(null, `保存`, theStateType)}
            >
              保存
            </Button>

            <Button icon={<CloseOutlined />} onClick={handleCancel.bind(null)}>
              取消
            </Button>
          </div>
        )}

        {theStateType === 'add' ||
        theStateType === 'modify' ||
        theStateType === 'replyAdd' ||
        theStateType === 'transmitAdd' ? (
          <div className="the-body01-box is-flex custom-scrollbar">
            <Form
              layout="inline"
              form={theFormInstance}
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
            >
              <Form.Item<FormItemType>
                label="主题"
                name="theInputName01"
                rules={[{ required: true, message: '请设置被监听组件值' }]}
                className="half-width"
              >
                <Input width="md" />
              </Form.Item>
              <Form.Item<FormItemType> label="编号" name="theInputName02" className="half-width">
                <Input />
              </Form.Item>

              <Form.Item<FormItemType>
                label="收件人邮箱"
                name="theInputName03"
                className="half-width"
                rules={theRules01}
              >
                <Input />
              </Form.Item>
              <Form.Item<FormItemType>
                label="抄送人邮箱"
                name="theInputName04"
                className="half-width"
              >
                <Input />
              </Form.Item>

              <Form.Item<FormItemType>
                label="收件人帐号"
                name="theSelectName05"
                className="half-width"
                rules={theRules01}
              >
                <UserSelect mode="multiple" allowClear />
              </Form.Item>
              <Form.Item<FormItemType>
                label="抄送人帐号"
                name="theSelectName06"
                className="half-width"
              >
                <UserSelect mode="multiple" allowClear />
              </Form.Item>

              <Form.Item<FormItemType>
                label="类型"
                name="theSelectName01"
                className="half-width"
                rules={[{ required: true, message: '请输入' }]}
              >
                <EnumSelect theEnumName="收件类型" />
              </Form.Item>
              <Form.Item<FormItemType>
                label="回复要求"
                name="theSelectName02"
                className="half-width"
              >
                <EnumSelect theEnumName="收件回复要求" />
              </Form.Item>

              <Form.Item<FormItemType>
                name="theOtherName01"
                label="内容"
                className="overall-width"
                labelCol={{ span: 3 }}
                wrapperCol={{ span: 21 }}
                rules={[{ required: true, message: '请输入内容' }]}
              >
                <FangQuill />
              </Form.Item>

              {theForm?.theOtherName03 && (
                <Form.Item<FormItemType>
                  name="theOtherName03"
                  label="原邮件内容"
                  className="overall-width"
                  labelCol={{ span: 3 }}
                  wrapperCol={{ span: 21 }}
                >
                  <FangQuill stateType="check" />
                </Form.Item>
              )}

              <Form.Item<FormItemType>
                label="附件"
                name="theOtherName02"
                className="overall-width"
                labelCol={{ span: 3 }}
                wrapperCol={{ span: 21 }}
              >
                <CustomDraggerUpload />
              </Form.Item>
              <Form.Item<FormItemType>
                name="theOtherName04"
                label="原邮件id"
                className="overall-width"
                hidden={true}
              ></Form.Item>
            </Form>
          </div>
        ) : null}

        {theStateType === 'check' && (
          <div className="the-head01-box">
            <Button icon={<ArrowLeftOutlined />} onClick={handleCancel.bind(null)}>
              返回
            </Button>

            <Button
              type="primary"
              icon={<ReplyIcon />}
              onClick={setTheStateType?.bind?.(null, `replyAdd`)}
            >
              回复
            </Button>

            <Button icon={<TransmitIcon />} onClick={setTheStateType?.bind?.(null, `transmitAdd`)}>
              转发
            </Button>

            <Button icon={<TrashCanIcon />} onClick={handleDelete?.bind?.(null, [theId])}>
              删除
            </Button>
          </div>
        )}

        {theStateType === 'check' && (
          <div className="the-title01-box">
            <div className="the-title-text">邮件名称</div>
            <div className="the-title-body">
              <div className="the-image">
                <UserOutlined />
              </div>
              <div className="the-text-box">
                <div className="the-sender-box">
                  <div className="the-text01">发件人: </div>
                  <div className="the-text02">{theForm?.theInputName05 || ``}</div>
                  <div className="the-text03">{`<${theForm?.theInputName06 || ``}>`}</div>
                  <div className="the-text04">
                    {moment(theForm?.theInputName07).format('YYYY-MM-DD HH:mm:ss')}
                  </div>
                </div>
                <div className="the-sender-box">
                  <div className="the-text01">收件人邮箱: </div>
                  <div className="the-text03">
                    {(theForm?.theInputName03 || undefined)?.split(`;`)?.map((item) => {
                      return `<${item}> `;
                    })}
                  </div>
                </div>
                <div className="the-sender-box">
                  <div className="the-text01">抄送人邮箱: </div>
                  <div className="the-text03">
                    {(theForm?.theInputName04 || undefined)?.split(`;`)?.map((item) => {
                      return `<${item}> `;
                    })}
                  </div>
                </div>
                <div className="the-sender-box">
                  <div className="the-text01">收件人帐号: </div>
                  <div className="the-text05">
                    {theForm?.theSelectName07 &&
                      theForm?.theSelectName07?.map((item) => {
                        return `${item} `;
                      })}
                  </div>
                </div>
                <div className="the-sender-box">
                  <div className="the-text01">抄送人帐号: </div>
                  <div className="the-text05">
                    {theForm?.theSelectName08?.map((item) => {
                      return `${item} `;
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {theStateType === 'check' && (
          <div className="the-body01-box custom-scrollbar">
            <Form
              layout="inline"
              form={theFormInstance}
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
            >
              <Form.Item<FormItemType>
                name="theOtherName01"
                className="overall-width"
                labelCol={{ span: 0 }}
                wrapperCol={{ span: 24 }}
              >
                <FangQuill stateType="check" />
              </Form.Item>
              {theForm?.theOtherName03 && (
                <>
                  <Divider />
                  <Form.Item<FormItemType>
                    name="theOtherName03"
                    label="原邮件内容"
                    className="overall-width"
                    labelCol={{ span: 3 }}
                    wrapperCol={{ span: 21 }}
                  >
                    <FangQuill stateType="check" />
                  </Form.Item>
                </>
              )}
            </Form>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {contextHolder}
      <Button {...theProps} onClick={handleClick.bind(null)}>
        {props.children}
      </Button>
      {props?.basicData?.containerDOM ? (
        ReactDOM.createPortal(<ThePopUpDom />, props?.basicData?.containerDOM)
      ) : (
        <ThePopUpDom />
      )}
    </>
  );
};
export default SendMailButton;
