以下是将你提供的 Ant Design Pro 项目的说明翻译成中文的内容：

# Ant Design Pro

这个项目是使用 [Ant Design Pro](https://pro.ant.design) 初始化的。以下是如何使用的快速指南。

## 环境准备

1. 在项目根目录`/`中安装前端项目`node_modules`，在根目录上执行：

```bash
npm install #使用npm安装，个人推荐。
```

```bash
yarn #使用yarn安装，个人不推荐。
```

2. 在`/nodeServices/`中安装`测试接口后端node.js项目`的`node_modules`，在`/nodeServices/`上执行：

```bash
npm install #使用npm安装，个人推荐。
```

## 根目录中提供的脚本

`Ant Design Pro` 提供了一些有用的脚本，帮助你快速启动和构建 Web 项目，进行代码风格检查和测试。

脚本提供在 `package.json` 中。可以安全地修改或添加额外的脚本：

```bash
npm start #会启动前端项目，同时使用mock.js模拟出的数据。
```

```bash
npm run build #构建项目。打包项目，让其变成静态文件，以便部署到静态服务器上。
```

```bash
npm run lint #检查代码风格。
```

```bash
npm run lint:fix #你还可以使用脚本自动修复一些风格错误。一般是提交到远程仓库之前执行的命令。
```

```bash
npm test #测试代码。
```

```bash
npm run dev #运行开发服务器，此时用的就是后端开发服务器的数据，而不是mock数据。
```

## 在`/nodeServices/`中提供的脚本

```bash
npm start #执行`ts格式中的node.js服务器代码`如使用`/nodeServices/src/index.ts`起一个接口服务。
```

## 更多

参见[个人操作说明](./个人操作说明.md);
