import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { message } from 'antd';
import {
  add,
  addItem,
  getById,
  getItemList,
  getPage,
  removeByIds,
  removeItemByIds,
  unique,
  uniqueItem,
  updateById,
  updateItemById,
} from './service';
import { Omit, Open, Result, Status } from '@/pages/typings';
import { TableListData } from '@/components/StandardTable/data';
import { Config, FormItem, TableListItem } from './data.d';
import { AuthorityType } from '@/pages/authority/typings';

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: {}) => T) => T },
) => void;
/**
 * 新增title
 */
const AddTitle = '新增权限';
/**
 * 修改title
 */
const UpdateTitle = '修改权限';

/**
 * StateType
 */
export interface StateType {
  // 列表
  list: TableListData<TableListItem>;
  // Form表单
  form: FormItem;
  // 配置
  config: Config;
}

/**
 * ModelType
 */
export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    form: Effect;
    fetch: Effect;
    config: Effect;
    submit: Effect;
    remove: Effect;
    unique: Effect;
    fetchItem: Effect;
    uniqueItem: Effect;
    submitItem: Effect;
    removeItem: Effect;
  };
  reducers: {
    saveList: Reducer<Omit<StateType, 'form' | 'config'>>;
    saveForm: Reducer<Omit<StateType, 'list' | 'config'>>;
    saveConfig: Reducer<Omit<StateType, 'list' | 'form'>>;
  };
}

const AuthorityModel: ModelType = {
  namespace: 'authority',
  state: {
    list: {
      list: [],
      pagination: {},
    },
    form: {
      type: Open.ADD,
      fields: {},
      title: AddTitle,
      visible: false,
    },
    config: {
      visible: false,
      authorize: '',
      list: [],
    },
  },

  effects: {
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
      yield put({ type: 'saveForm', payload: { type, fields, title, visible } });
    },
    *fetch({ payload }, { call, put }) {
      const response: Result<TableListData<TableListItem>> = yield call(getPage, payload);
      if (response.status === Status.SUCCESS) {
        yield put({ type: 'saveList', payload: response.result });
      }
    },
    *unique({ payload, callback }, { call }) {
      const response: Result<object> = yield call(unique, payload);
      if (response.status === Status.SUCCESS) {
        callback(response.result);
      }
    },
    *submit({ payload, callback }, { call, put, select }) {
      // 获取state
      const type: Open = yield select((state: any) => state.authority.form.type);
      const response =
        type === Open.ADD ? yield call(add, payload) : yield call(updateById, payload);
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
    *config({ payload }, { put }) {
      if (payload.visible) {
        // 显示配置页面,默认查询路由数据
        yield put({
          type: 'fetchItem',
          payload: { authorize: payload.authorize, type: AuthorityType.ROUTE, visible: true },
        });
      }
      yield put({ type: 'saveConfig', payload });
    },
    *fetchItem({ payload }, { call, put }) {
      const { authorize, visible, type } = payload;
      // 根据权限类型和权限ID查询权限项项数据
      const response: Result<object> = yield call(getItemList, { type, authorize });
      if (response.status === Status.SUCCESS) {
        yield put({
          type: 'saveConfig',
          payload: { visible, authorize, list: response.result },
        });
      }
    },
    *uniqueItem({ payload, callback }, { call }) {
      const response: Result<object> = yield call(uniqueItem, payload);
      if (response.status === Status.SUCCESS) {
        callback(response.result);
      }
    },
    *submitItem({ payload, callback }, { call, put }) {
      // 获取state
      const type: Open = payload.submitType;
      const response =
        type === Open.ADD ? yield call(addItem, payload) : yield call(updateItemById, payload);
      // 成功
      if (response.status === Status.SUCCESS) {
        // true,关闭form
        callback(true);
        // 消息提示
        message.success(response.message);
        // 刷新数据
        yield put({
          type: 'fetchItem',
          payload: { authorize: payload.authorize, type: payload.type, visible: true },
        });
      }
    },
    *removeItem({ payload }, { call, put }) {
      const response: Result<boolean> = yield call(removeItemByIds, payload);
      if (response.status === Status.SUCCESS) {
        message.success(response.message);
        // 刷新数据
        yield put({
          type: 'fetchItem',
          payload: { authorize: payload.authorize, type: payload.type, visible: true },
        });
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
    saveConfig(state, action) {
      return {
        ...state,
        config: action.payload,
      };
    },
  },
};

export default AuthorityModel;
