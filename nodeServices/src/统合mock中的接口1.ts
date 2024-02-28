// import { Request, Response } from 'express';

// //start: mock/listTableList.ts;
// import moment from 'moment';
// import { parse } from 'url';

// // mock tableListDataSource
// const genList = (current: number, pageSize: number) => {
//   const tableListDataSource: API.RuleListItem[] = [];

//   for (let i = 0; i < pageSize; i += 1) {
//     const index = (current - 1) * 10 + i;
//     tableListDataSource.push({
//       key: index,
//       disabled: i % 6 === 0,
//       href: 'https://ant.design',
//       avatar: [
//         'https://gw.alipayobjects.com/zos/rmsportal/eeHMaZBwmTvLdIwMfBpg.png',
//         'https://gw.alipayobjects.com/zos/rmsportal/udxAbMEhpwthVVcjLXik.png',
//       ][i % 2],
//       name: `TradeCode ${index}`,
//       owner: '曲丽丽',
//       desc: '这是一段描述',
//       callNo: Math.floor(Math.random() * 1000),
//       status: Math.floor(Math.random() * 10) % 4,
//       updatedAt: moment().format('YYYY-MM-DD'),
//       createdAt: moment().format('YYYY-MM-DD'),
//       progress: Math.ceil(Math.random() * 100),
//     });
//   }
//   tableListDataSource.reverse();
//   return tableListDataSource;
// };

// let tableListDataSource = genList(1, 100);

// function getRule(req: Request, res: Response, u: string) {
//   let realUrl = u;
//   if (!realUrl || Object.prototype.toString.call(realUrl) !== '[object String]') {
//     realUrl = req.url;
//   }
//   const { current = 1, pageSize = 10 } = req.query;
//   const params = parse(realUrl, true).query as unknown as API.PageParams &
//     API.RuleListItem & {
//       sorter: any;
//       filter: any;
//     };

//   let dataSource = [...tableListDataSource].slice(
//     ((current as number) - 1) * (pageSize as number),
//     (current as number) * (pageSize as number),
//   );
//   if (params.sorter) {
//     const sorter = JSON.parse(params.sorter);
//     dataSource = dataSource.sort((prev, next) => {
//       let sortNumber = 0;
//       (Object.keys(sorter) as Array<keyof API.RuleListItem>).forEach((key) => {
//         let nextSort = next?.[key] as number;
//         let preSort = prev?.[key] as number;
//         if (sorter[key] === 'descend') {
//           if (preSort - nextSort > 0) {
//             sortNumber += -1;
//           } else {
//             sortNumber += 1;
//           }
//           return;
//         }
//         if (preSort - nextSort > 0) {
//           sortNumber += 1;
//         } else {
//           sortNumber += -1;
//         }
//       });
//       return sortNumber;
//     });
//   }
//   if (params.filter) {
//     const filter = JSON.parse(params.filter as any) as {
//       [key: string]: string[];
//     };
//     if (Object.keys(filter).length > 0) {
//       dataSource = dataSource.filter((item) => {
//         return (Object.keys(filter) as Array<keyof API.RuleListItem>).some((key) => {
//           if (!filter[key]) {
//             return true;
//           }
//           if (filter[key].includes(`${item[key]}`)) {
//             return true;
//           }
//           return false;
//         });
//       });
//     }
//   }

//   if (params.name) {
//     dataSource = dataSource.filter((data) => data?.name?.includes(params.name || ''));
//   }
//   const result = {
//     data: dataSource,
//     total: tableListDataSource.length,
//     success: true,
//     pageSize,
//     current: parseInt(`${params.current}`, 10) || 1,
//   };

//   return res.json(result);
// }

// function postRule(req: Request, res: Response, u: string, b: Request) {
//   let realUrl = u;
//   if (!realUrl || Object.prototype.toString.call(realUrl) !== '[object String]') {
//     realUrl = req.url;
//   }

//   const body = (b && b.body) || req.body;
//   const { method, name, desc, key } = body;

//   switch (method) {
//     /* eslint no-case-declarations:0 */
//     case 'delete':
//       tableListDataSource = tableListDataSource.filter((item) => key.indexOf(item.key) === -1);
//       break;
//     case 'post':
//       (() => {
//         const i = Math.ceil(Math.random() * 10000);
//         const newRule: API.RuleListItem = {
//           key: tableListDataSource.length,
//           href: 'https://ant.design',
//           avatar: [
//             'https://gw.alipayobjects.com/zos/rmsportal/eeHMaZBwmTvLdIwMfBpg.png',
//             'https://gw.alipayobjects.com/zos/rmsportal/udxAbMEhpwthVVcjLXik.png',
//           ][i % 2],
//           name,
//           owner: '曲丽丽',
//           desc,
//           callNo: Math.floor(Math.random() * 1000),
//           status: Math.floor(Math.random() * 10) % 2,
//           updatedAt: moment().format('YYYY-MM-DD'),
//           createdAt: moment().format('YYYY-MM-DD'),
//           progress: Math.ceil(Math.random() * 100),
//         };
//         tableListDataSource.unshift(newRule);
//         return res.json(newRule);
//       })();
//       return;

//     case 'update':
//       (() => {
//         let newRule = {};
//         tableListDataSource = tableListDataSource.map((item) => {
//           if (item.key === key) {
//             newRule = { ...item, desc, name };
//             return { ...item, desc, name };
//           }
//           return item;
//         });
//         return res.json(newRule);
//       })();
//       return;
//     default:
//       break;
//   }

//   const result = {
//     list: tableListDataSource,
//     pagination: {
//       total: tableListDataSource.length,
//     },
//   };

//   res.json(result);
// }
// //end: mock/listTableList.ts;

// //start: mock/notices.ts;
// const getNotices = (req: Request, res: Response) => {
//   res.json({
//     data: [
//       {
//         id: '000000001',
//         avatar:
//           'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/MSbDR4FR2MUAAAAAAAAAAAAAFl94AQBr',
//         title: '你收到了 14 份新周报',
//         datetime: '2017-08-09',
//         type: 'notification',
//       },
//       {
//         id: '000000002',
//         avatar:
//           'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/hX-PTavYIq4AAAAAAAAAAAAAFl94AQBr',
//         title: '你推荐的 曲妮妮 已通过第三轮面试',
//         datetime: '2017-08-08',
//         type: 'notification',
//       },
//       {
//         id: '000000003',
//         avatar:
//           'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/jHX5R5l3QjQAAAAAAAAAAAAAFl94AQBr',
//         title: '这种模板可以区分多种通知类型',
//         datetime: '2017-08-07',
//         read: true,
//         type: 'notification',
//       },
//       {
//         id: '000000004',
//         avatar:
//           'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/Wr4mQqx6jfwAAAAAAAAAAAAAFl94AQBr',
//         title: '左侧图标用于区分不同的类型',
//         datetime: '2017-08-07',
//         type: 'notification',
//       },
//       {
//         id: '000000005',
//         avatar:
//           'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/Mzj_TbcWUj4AAAAAAAAAAAAAFl94AQBr',
//         title: '内容不要超过两行字，超出时自动截断',
//         datetime: '2017-08-07',
//         type: 'notification',
//       },
//       {
//         id: '000000006',
//         avatar:
//           'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/eXLzRbPqQE4AAAAAAAAAAAAAFl94AQBr',
//         title: '曲丽丽 评论了你',
//         description: '描述信息描述信息描述信息',
//         datetime: '2017-08-07',
//         type: 'message',
//         clickClose: true,
//       },
//       {
//         id: '000000007',
//         avatar:
//           'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/w5mRQY2AmEEAAAAAAAAAAAAAFl94AQBr',
//         title: '朱偏右 回复了你',
//         description: '这种模板用于提醒谁与你发生了互动，左侧放『谁』的头像',
//         datetime: '2017-08-07',
//         type: 'message',
//         clickClose: true,
//       },
//       {
//         id: '000000008',
//         avatar:
//           'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/wPadR5M9918AAAAAAAAAAAAAFl94AQBr',
//         title: '标题',
//         description: '这种模板用于提醒谁与你发生了互动，左侧放『谁』的头像',
//         datetime: '2017-08-07',
//         type: 'message',
//         clickClose: true,
//       },
//       {
//         id: '000000009',
//         title: '任务名称',
//         description: '任务需要在 2017-01-12 20:00 前启动',
//         extra: '未开始',
//         status: 'todo',
//         type: 'event',
//       },
//       {
//         id: '000000010',
//         title: '第三方紧急代码变更',
//         description: '冠霖提交于 2017-01-06，需在 2017-01-07 前完成代码变更任务',
//         extra: '马上到期',
//         status: 'urgent',
//         type: 'event',
//       },
//       {
//         id: '000000011',
//         title: '信息安全考试',
//         description: '指派竹尔于 2017-01-09 前完成更新并发布',
//         extra: '已耗时 8 天',
//         status: 'doing',
//         type: 'event',
//       },
//       {
//         id: '000000012',
//         title: 'ABCD 版本发布',
//         description: '冠霖提交于 2017-01-06，需在 2017-01-07 前完成代码变更任务',
//         extra: '进行中',
//         status: 'processing',
//         type: 'event',
//       },
//     ],
//   });
// };
// //end: mock/notices.ts;

// // 代码中会兼容本地 service mock 以及部署站点的静态数据
// export default {
//   'GET /api/rule': getRule,
//   'POST /api/rule': postRule,

//   'GET /api/notices': getNotices,

// };
