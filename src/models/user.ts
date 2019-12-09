import { Effect } from 'dva';
import { Reducer } from 'redux';

import { message, notification } from 'antd';
import {
  queryCurrent,
  unique,
  getById,
  getPage,
  add,
  updateById,
  removeByIds,
  updateStatusById,
  updatePassword,
} from '@/services/user';
import { Omit, Open, Result, Status } from '@/pages/typings';
import { TableListData } from '@/components/StandardTable/data';
import { FormDetails, FormItem, TableListItem } from '@/pages/user/data';
/**
 * 新增title
 */
const AddTitle = '新增用户';
/**
 * 修改title
 */
const UpdateTitle = '修改用户';
export interface CurrentUser {
  avatar?: string;
  name?: string;
  title?: string;
  group?: string;
  signature?: string;
  tags?: {
    key: string;
    label: string;
  }[];
  userid?: string;
  unreadCount?: number;
}

export interface UserModelState {
  currentUser?: CurrentUser;
  list: TableListData<TableListItem>;
  form: FormItem;
  details: FormDetails;
}

export interface UserModelType {
  namespace: 'user';
  state: UserModelState;
  effects: {
    form: Effect;
    fetch: Effect;
    submit: Effect;
    remove: Effect;
    unique: Effect;
    fetchCurrent: Effect;
    updateStatus: Effect;
    updatePassword: Effect;
  };
  reducers: {
    saveList: Reducer<Omit<UserModelState, 'form' | 'details' | 'currentUser' | 'details'>>;
    saveForm: Reducer<Omit<UserModelState, 'list' | 'details' | 'currentUser' | 'details'>>;
    saveDetails: Reducer<Omit<UserModelState, 'form' | 'list' | 'currentUser'>>;
    saveCurrentUser: Reducer<Omit<UserModelState, 'form' | 'list' | 'details'>>;
    changeNotifyCount: Reducer<Omit<UserModelState, 'form' | 'list' | 'details'>>;
  };
}

const UserModel: UserModelType = {
  namespace: 'user',

  state: {
    currentUser: {},
    list: {
      list: [],
      pagination: {},
    },
    form: {},
    details: {},
  },

  effects: {
    *unique({ payload, callback }, { call }) {
      const response: Result<object> = yield call(unique, payload);
      if (response.status === Status.SUCCESS) {
        callback(response.result);
      }
    },
    *form({ payload }, { call, put }) {
      const { type, visible = true } = payload;
      let { title = AddTitle } = payload;
      let fields = {};
      // 修改
      if (type === Open.UPDATE) {
        const { id } = payload;
        title = UpdateTitle;
        // 查询数据
        const response: Result<object> = yield call(getById, id);
        if (response.status === Status.SUCCESS) {
          fields = response.result;
        }
      }
      // 调用role
      if (visible) {
        yield put({ type: 'role/fetch', payload: { sorter: 'lastModifiedTime', asc: false } });
      }
      // 保存form数据
      yield put({ type: 'saveForm', payload: { type, fields, title, visible } });
    },
    *fetch({ payload }, { call, put }) {
      const response: Result<TableListData<TableListItem>> = yield call(getPage, payload);
      if (response.status === Status.SUCCESS) {
        yield put({ type: 'saveList', payload: response.result });
      }
    },
    *submit({ payload, callback }, { call, select, put }) {
      // 获取state
      const type: Open = yield select((state: any) => state.user.form.type);
      let response: Result<boolean> = { message: '', status: Status.EX900001, result: [] };
      // 新增
      if (type === Open.ADD) {
        response = yield call(add, payload);
      }
      // 修改
      if (type === Open.UPDATE) {
        response = yield call(updateById, payload);
      }
      // 成功
      if (response.status === Status.SUCCESS) {
        // 关闭Form
        yield put({ type: 'form', payload: { visible: false } });
        callback();
        // 消息提示
        message.success(response.message);
        // 刷新数据
        yield put({ type: 'fetch', payload: { sorter: 'lastModifiedTime', asc: false } });
      }
    },
    *remove({ payload, callback }, { call, put }) {
      const response: Result<boolean> = yield call(removeByIds, payload);
      if (response.status === Status.SUCCESS) {
        message.success(response.message);
        // 刷新数据
        yield put({ type: 'fetch', payload: { sorter: 'lastModifiedTime', asc: false } });
        callback();
      }
    },
    *updateStatus({ payload }, { call, put }) {
      const response: Result<boolean> = yield call(updateStatusById, payload);
      if (response.status === Status.SUCCESS && response.result === true) {
        // 刷新数据
        yield put({
          type: 'fetch',
          payload: { sorter: 'lastModifiedTime', asc: false },
        });
        notification.success({
          placement: 'topRight',
          message: '提示',
          description: response.message,
        });
      }
    },
    *updatePassword({ payload }, { call }) {
      const response: Result<object> = yield call(updatePassword, payload);
      if (response.status === Status.SUCCESS) {
        message.success(response.message);
      }
    },
    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      yield put({
        type: 'saveCurrentUser',
        payload: response.result,
      });
    },
  },

  reducers: {
    saveList(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveForm(state, action) {
      return {
        ...state,
        form: action.payload,
      };
    },
    saveDetails(state, action) {
      return {
        ...state,
        details: action.payload,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    changeNotifyCount(
      state = {
        currentUser: {},
      },
      action,
    ) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};

export default UserModel;
