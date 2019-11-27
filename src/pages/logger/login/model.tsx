import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { message } from 'antd';
import { getPage, empty, getById } from './service';
import { Omit, Result, Status, TableListData } from '@/pages/typeings';

import { DetailsItem, DetailsItemFields, TableListItem } from './data.d';

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: {}) => T) => T },
) => void;

/**
 * StateType
 */
export interface StateType {
  list: TableListData<TableListItem>;
  details: DetailsItem;
}

/**
 * ModelType
 */
export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    fetch: Effect;
    empty: Effect;
    details: Effect;
  };
  reducers: {
    saveList: Reducer<Omit<StateType, 'details'>>;
    saveDetails: Reducer<Omit<StateType, 'list'>>;
  };
}

const RoleModel: ModelType = {
  namespace: 'loggerLogin',
  state: {
    list: {
      list: [],
      pagination: {},
    },
    details: { visible: false, fields: {} },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response: Result<TableListItem> = yield call(getPage, payload);
      if (response.status === Status.SUCCESS) {
        yield put({ type: 'saveList', payload: response.result });
      }
    },
    *details({ payload }, { call, put }) {
      const { visible, id } = payload;
      if (visible) {
        const response: Result<DetailsItemFields> = yield call(getById, id);
        if (response.status === Status.SUCCESS) {
          yield put({ type: 'saveDetails', payload: { visible, fields: response.result } });
          return;
        }
      }
      yield put({ type: 'saveDetails', payload: { visible } });
    },
    *empty({ payload, callback }, { call, put }) {
      const response: Result<boolean> = yield call(empty, payload);
      if (response.status === Status.SUCCESS) {
        message.success(response.message);
        // 刷新数据
        yield put({ type: 'fetch' });
        callback();
      }
    },
  },
  reducers: {
    saveList(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveDetails(state, action) {
      return {
        ...state,
        details: action.payload,
      };
    },
  },
};

export default RoleModel;
