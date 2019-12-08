import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { message } from 'antd';
import { emptyLogin, emptyOperate, getOperatePage, getLoginPage, getOperateById } from '@/services/logger';
import { Omit, Result, Status } from '@/pages/typings';
import { TableListData } from '@/components/StandardTable/data';
import { LoginTableListItem, OperateDetailsItem, OperateTableListItem } from '@/pages/logger/data.d';

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: {}) => T) => T },
) => void;
export interface LoginStateType {
  list: TableListData<LoginTableListItem>;
}

export interface OperateStateType {
  list: TableListData<OperateTableListItem>;
  details: { visible: boolean; fields: OperateDetailsItem };
}

/**
 * StateType
 */
export interface StateType {
  // 登录日志
  login: LoginStateType;
  // 操作日志
  operate: OperateStateType;
}

/**
 * ModelType
 */
export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    // 获取登录日志
    fetchLogin: Effect;
    // 获取操作日志
    fetchOperate: Effect;
    // 清空登录日志
    emptyLogin: Effect;
    // 清空操作日志
    emptyOperate: Effect;
    // 操作日志详情
    operateDetails: Effect;
  };
  reducers: {
    saveLogin: Reducer<Omit<StateType, 'operate'>>;
    saveOperate: Reducer<Omit<StateType, 'login'>>;
  };
}

const LoggerModel: ModelType = {
  namespace: 'logger',
  state: {
    login: { list: { list: [], pagination: {} } },
    operate: { details: { visible: false, fields: {} }, list: { list: [], pagination: {} } },
  },

  effects: {
    *fetchLogin({ payload }, { call, put, select }) {
      const response: Result<LoginStateType> = yield call(getLoginPage, payload);
      if (response.status === Status.SUCCESS) {
        const details = yield select((state: any) => state.logger.login.details);
        yield put({ type: 'saveLogin', payload: { list: response.result, details } });
      }
    },
    *fetchOperate({ payload }, { call, put, select }) {
      const response: Result<OperateStateType> = yield call(getOperatePage, payload);
      if (response.status === Status.SUCCESS) {
        const details = yield select((state: any) => state.logger.operate.details);
        yield put({ type: 'saveOperate', payload: { list: response.result, details } });
      }
    },
    *emptyLogin({ payload, callback }, { call, put }) {
      const response: Result<boolean> = yield call(emptyLogin, payload);
      if (response.status === Status.SUCCESS) {
        message.success(response.message);
        // 刷新数据
        yield put({ type: 'fetchLogin' });
        callback();
      }
    },
    *emptyOperate({ payload, callback }, { call, put }) {
      const response: Result<boolean> = yield call(emptyOperate, payload);
      if (response.status === Status.SUCCESS) {
        message.success(response.message);
        // 刷新数据
        yield put({ type: 'fetchOperate' });
        callback();
      }
    },
    *operateDetails({ payload }, { call, put, select }) {
      const response: Result<boolean> = yield call(getOperateById, payload.id);
      if (response.status === Status.SUCCESS) {
        const list = yield select((state: any) => state.logger.operate.list);
        // 刷新数据
        yield put({
          type: 'saveOperate',
          payload: { list, details: { visible: payload.visible, fields: response.result } },
        });
      }
    },
  },
  reducers: {
    saveLogin(state, action) {
      return {
        ...state,
        login: action.payload,
      };
    },
    saveOperate(state, action) {
      return {
        ...state,
        operate: action.payload,
      };
    },
  },
};

export default LoggerModel;
