// 这个是在node.js环境中;
const fs = require('fs');
const path = require('path');

// 说明:
// `./`表示的项目的根路径; - 所以要配合node.js中的path模块来找到对应的文件;
// `/`表示的当前项目所在硬盘的根目录;比如在c盘就是`C:\`;在d盘就是`D:\`;
export default {
  //纯js构建假json数据;
  'GET /api/fangTestMockFild/getMockJsonData': [
    { name: '这是一个使用mack.js生成的纯js构建假json数据' },
  ],

  //使用本地静态的json数据-这里查的是当前mock文件夹中的文件;
  'GET /api/fangTestMockFild/getLocalMockDirectoryJsonData': async (
    req: Request,
    res: Response,
    u: string,
  ) => {
    // //请求方式:
    // fetch('/api/fangTestMockFild/getLocalMockDirectoryJsonData')
    //   .then((response) => {
    //     if (!response.ok) {
    //       throw new Error('请求失败');
    //     }
    //     return response.json();
    //   })
    //   .then((data) => {
    //     console.log('成功获取数据：', data);
    //   })
    //   .catch((error) => {
    //     console.error('请求出错：', error);
    //   });

    const handleReadJSONFile = async (filePath: string) => {
      // 获取JSON文件的本地路径
      const theFilePath = filePath;
      return new Promise((resolve, reject) => {
        fs.readFile(theFilePath, 'utf8', (err, data) => {
          // console.log(`theFilePath-->`, theFilePath);
          // console.log(`data-->`, data);
          // console.log(`err-->`, err);
          if (err) {
            return reject(err);
          }

          try {
            const jsonData = JSON.parse(data);
            return resolve(jsonData);
          } catch (err) {
            return reject(err);
          }
        });
      });
    };
    const theResult = {
      code: 404,
      data: [],
    };
    console.log(`这里查的是当前mock文件夹中的文件`);

    try {
      let data = await handleReadJSONFile(
        path.join(__dirname, './theLocalMockDirectoryData/theTestJSON.json'),
      );
      theResult.code = 200;
      theResult.data = data;
    } catch (error) {
      console.log(`error-->`, error);
    } finally {
      res.send(theResult);
    }
  },

  //使用本地静态的json数据-这里查的是项目根目录文件夹中的文件;
  'GET /api/fangTestMockFild/getLocalProjectRootDirectoryJsonData': async (
    req: Request,
    res: Response,
    u: string,
  ) => {
    // //请求方式:
    // fetch('/api/fangTestMockFild/getLocalProjectRootDirectoryJsonData')
    //   .then((response) => {
    //     if (!response.ok) {
    //       throw new Error('请求失败');
    //     }
    //     return response.json();
    //   })
    //   .then((data) => {
    //     console.log('成功获取数据：', data);
    //   })
    //   .catch((error) => {
    //     console.error('请求出错：', error);
    //   });

    const handleReadJSONFile = async (filePath: string) => {
      // 获取JSON文件的本地路径
      const theFilePath = filePath;
      return new Promise((resolve, reject) => {
        fs.readFile(theFilePath, 'utf8', (err, data) => {
          // console.log(`theFilePath-->`, theFilePath);
          // console.log(`data-->`, data);
          // console.log(`err-->`, err);
          if (err) {
            return reject(err);
          }

          try {
            const jsonData = JSON.parse(data);
            return resolve(jsonData);
          } catch (err) {
            return reject(err);
          }
        });
      });
    };
    const theResult = {
      code: 404,
      data: [],
    };

    console.log(`这里查的是项目根目录文件夹中的文件`);
    try {
      let data = await handleReadJSONFile(
        './public/theLocalProjectRootDirectoryData/theTestJSON.json',
      );
      theResult.code = 200;
      theResult.data = data;
    } catch (error) {
      console.log(`error-->`, error);
    } finally {
      res.send(theResult);
    }
  },

  'POST /api/fangTestMockFild/rule': (req: Request, res: Response, u: string) => {
    // //请求方式:
    // fetch('/api/fangTestMockFild/rule', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     // 您的POST请求数据
    //   }),
    // })
    //   .then(response => {
    //     if (!response.ok) {
    //       throw new Error('请求失败');
    //     }
    //     return response.json();
    //   })
    //   .then(data => {
    //     console.log('成功获取数据：', data);
    //   })
    //   .catch(error => {
    //     console.error('请求出错：', error);
    //   });

    res.send({
      success: true,
      msg: `post请求的数据`,
    });
  },
};
