// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 获取当前的用户 GET /api/currentUser */
export async function currentUser(options?: { [key: string]: any }) {
  const res = await request<{
    data: API.CurrentUser;
  }>('/api/currentUser', {
    method: 'GET',
    ...(options || {}),
  });
  console.log(`获取当前的用户 GET /api/currentUser: res-->`, res);

  return res;
}

/** 退出登录接口 POST /api/login/outLogin */
export async function outLogin(options?: { [key: string]: any }) {
  const res = await request<Record<string, any>>('/api/login/outLogin', {
    method: 'POST',
    ...(options || {}),
  });
  console.log(`退出登录接口 POST /api/login/outLogin: res-->`, res);
  return res;
}

/** 登录接口 POST /api/login/account */
export async function loginAccount(body: API.LoginParams, options?: { [key: string]: any }) {
  const res = await request<API.LoginResult>('/api/login/account', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
  console.log(`登录接口 POST /api/login/account: res-->`, res);
  return res;
}

/** 此处后端没有提供注释 GET /api/notices */
export async function getNotices(options?: { [key: string]: any }) {
  const res = await request<API.NoticeIconList>('/api/notices', {
    method: 'GET',
    ...(options || {}),
  });
  console.log(`此处后端没有提供注释 GET /api/notices: res-->`, res);
  return res;
}

/** 获取规则列表 GET /api/rule */
export async function rule(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  const res = await request<API.RuleList>('/api/rule', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
  console.log(`获取规则列表 GET /api/rule: res-->`, res);
  return res;
}

/** 新建规则 PUT /api/rule */
export async function updateRule(options?: { [key: string]: any }) {
  const res = await request<API.RuleListItem>('/api/rule', {
    method: 'PUT',
    ...(options || {}),
  });
  console.log(`新建规则 PUT /api/rule: res-->`, res);
  return res;
}

/** 新建规则 POST /api/rule */
export async function addRule(options?: { [key: string]: any }) {
  const res = await request<API.RuleListItem>('/api/rule', {
    method: 'POST',
    ...(options || {}),
  });
  console.log(`新建规则 POST /api/rule: res-->`, res);
  return res;
}

/** 删除规则 DELETE /api/rule */
export async function removeRule(options?: { [key: string]: any }) {
  const res = await request<Record<string, any>>('/api/rule', {
    method: 'DELETE',
    ...(options || {}),
  });
  console.log(`删除规则 DELETE /api/rule: res-->`, res);
  return res;
}
