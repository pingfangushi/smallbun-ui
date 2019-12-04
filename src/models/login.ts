import { Reducer } from 'redux';
import { routerRedux } from 'dva/router';
import { Effect } from 'dva';
import { stringify } from 'querystring';

import { fakeAccountLogin, getImageCaptcha, getPublicSecret } from '@/services/login';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { Result, Status } from '@/pages/typings';
import { notification } from 'antd';

export interface StateType {
  status?: 'ok' | 'error';
  type?: string;
  currentAuthority?: 'user' | 'guest' | 'admin';
}

export interface LoginModelType {
  namespace: string;
  state: StateType;
  effects: {
    login: Effect;
    getImageCaptcha: Effect;
    getPublicSecret: Effect;
    logout: Effect;
  };
  reducers: {
    changeLoginStatus: Reducer<StateType>;
  };
}

const Model: LoginModelType = {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response: Result<object> = yield call(fakeAccountLogin, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response.result,
      });
      // Login successfully
      if (response.status === Status.SUCCESS) {
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params as { redirect: string };
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = '/';
            return;
          }
        }
        yield put(routerRedux.replace(redirect || '/'));
      }
    },

    *getImageCaptcha({ payload, callback }, { call }) {
      const response: Result<any> = yield call(getImageCaptcha, payload);
      if (response.status === Status.SUCCESS) {
        if (callback && callback instanceof Function) {
          callback(response.result);
        }
        return;
      }
      notification.warn({
        placement: 'topRight',
        message: '提示',
        description: response.message,
      });
    },
    *getPublicSecret({ payload, callback }, { call }) {
      const response: Result<any> = yield call(getPublicSecret, payload);
      if (response.status === Status.SUCCESS) {
        if (callback && callback instanceof Function) {
          callback(response.result);
        }
        return;
      }
      notification.warn({
        placement: 'topRight',
        message: '提示',
        description: response.message,
      });
    },
    *logout(_, { put }) {
      const { redirect } = getPageQuery();
      // redirect
      if (window.location.pathname !== '/user/login' && !redirect) {
        yield put(
          routerRedux.replace({
            pathname: '/user/login',
            search: stringify({
              redirect: window.location.href,
            }),
          }),
        );
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      sessionStorage.setItem('X-AUTH-TOKEN', payload.token);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
  },
};

export default Model;
