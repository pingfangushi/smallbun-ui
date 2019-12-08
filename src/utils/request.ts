/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { extend } from 'umi-request';
import { notification, Modal } from 'antd';
import { stringify } from 'querystring';
import { Result, Status } from '@/pages/typings';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

/**
 * 异常处理程序
 */
const errorHandler = (error: { response: Response }): Response => {
  const { response } = error;
  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    // 401 重新登录
    if (response.status === 401) {
      const queryString = stringify({
        redirect: window.location.href,
      });
      Modal.destroyAll();
      localStorage.removeItem('X-AUTH-TOKEN');
      Modal.error({
        title: '提示',
        content: '登录超时，请重新登录',
        onOk() {
          window.location.href = `/user/login?${queryString}`;
        },
      });
    } else {
      notification.error({
        message: '提示',
        description: errorText,
      });
    }
  } else if (!response) {
    notification.error({
      description: '您的网络发生异常，无法连接服务器',
      message: '网络异常',
    });
  }
  return response;
};

/**
 * 配置request请求时的默认参数
 */
const request = extend({
  errorHandler, // 默认错误处理
  credentials: 'include', // 默认请求是否带上cookie
});

/**
 * 获取cookie
 * @param name
 */
function getCookie(name: string): string {
  const reg = new RegExp(`(^| )${name}=([^;]*)(;|$)`);
  const match = document.cookie.match(reg);
  if (match) {
    return unescape(match[2]);
  }
  return '';
}

/**
 * request拦截器, 改变url 或 options.
 */
request.interceptors.request.use((url, options) => {
  let headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };
  // 获取 XSRF-TOKEN
  const xsrf = getCookie('XSRF-TOKEN');
  // 获取 X-AUTH-TOKEN
  const token = localStorage.getItem('X-AUTH-TOKEN');
  // 添加xsrf
  if (xsrf) {
    headers = { ...headers, ...{ 'X-XSRF-TOKEN': xsrf } };
  }
  // 添加token
  if (token) {
    headers = { ...headers, ...{ Authorization: `Bearer ${token}` } };
    return {
      url: `${url}`,
      options: { ...options, headers },
    };
  }
  return {
    url: `${url}`,
    options: { ...options, headers },
  };
});

/**
 * response 拦截器, 统一处理服务器返回
 */
request.interceptors.response.use(async response => {
  const data: Result<object> | any = await response.clone().json();
  // 错误
  if (data.status === Status.EX900001) {
    notification.error({
      placement: 'topRight',
      message: '提示',
      description: data.message,
    });
    return response;
  }
  return response;
});
export default request;
