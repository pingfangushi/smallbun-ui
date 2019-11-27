import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { message, notification } from 'antd';
import { FormDetails, FormItem, TableListItem } from './data.d';
import { Omit, Open, Result, Status } from '@/pages/typings';
import { add, unique, getById, getPage, removeByIds, updateById, updatePassword, updateStatusById } from './service';
import { TableListData } from '@/components/StandardTable/data';

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: {}) => T) => T },
) => void;
/**
 * 新增title
 */
const AddTitle = '新增用户';
/**
 * 修改title
 */
const UpdateTitle = '修改用户';

export interface StateType {
  list: TableListData<TableListItem>;
  form: FormItem;
  details: FormDetails;
}

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    form: Effect;
    fetch: Effect;
    submit: Effect;
    remove: Effect;
    unique: Effect;
    details: Effect;
    updateStatus: Effect;
    updatePassword: Effect;
  };
  reducers: {
    saveList: Reducer<Omit<StateType, 'form' | 'details'>>;
    saveForm: Reducer<Omit<StateType, 'list' | 'details'>>;
    saveDetails: Reducer<Omit<StateType, 'form' | 'list'>>;
  };
}

// noinspection DuplicatedCode
const UserModel: ModelType = {
  namespace: 'users',
  state: {
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
      yield put({ type: 'role/fetch', payload: { sorter: 'lastModifiedTime', asc: false } });
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
      const type: Open = yield select((state: any) => state.users.form.type);
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
        yield put({ type: 'fetch' });
        callback();
      }
    },
    *details({ payload }, { call, put }) {
      const { visible, id } = payload;
      if (visible) {
        const response: Result<object> = yield call(getById, id);
        if (response.status === Status.SUCCESS) {
          yield put({ type: 'saveDetails', payload: { visible, fields: response.result } });
          return;
        }
      }
      yield put({ type: 'saveDetails', payload: { visible, fields: {} } });
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
  },
};

export default UserModel;
