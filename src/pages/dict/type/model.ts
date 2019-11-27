import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { message, notification } from 'antd';
import { fetch, getById, removeByIds, unique, updateStatusById, add, updateById } from './service';
import { TypeFormItem, TypeTableListItem, ValueFormItemFields } from './data.d';
import { Omit, Open, Result, Status, TableListData } from '@/pages/typeings';


export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: {}) => T) => T },
) => void;
const typeUpdateTitle = '修改字典类型';
const typeAddTitle = '新增字典类型';

/**
 * StateType
 */
export interface StateType {
  list: TableListData<TypeTableListItem>;
  form: TypeFormItem;
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
    remove: Effect;
    submit: Effect;
    unique: Effect;
    updateStatusById: Effect;
  };
  reducers: {
    saveList: Reducer<Omit<StateType, 'form'>>;
    saveForm: Reducer<Omit<StateType, 'list'>>;
  };
}

const DictTypeModel: ModelType = {
  namespace: 'dictType',
  state: {
    list: {
      list: [],
      pagination: {},
    },
    form: { visible: false, fields: {} },
  },

  effects: {
    *unique({ payload, callback }, { call }) {
      const response: Result<boolean> = yield call(unique, payload);
      if (response.status === Status.SUCCESS) {
        callback(response.result);
      }
    },
    *fetch({ payload }, { call, put }) {
      const response: Result<TypeTableListItem> = yield call(fetch, payload);
      if (response.status === Status.SUCCESS) {
        yield put({ type: 'saveList', payload: response.result });
      }
    },
    *submit({ payload, callback }, { call, put, select }) {
      // 获取state
      const type: Open = yield select((state: any) => state.dictType.form.type);
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
      const { ids } = payload;
      const response: Result<boolean> = yield call(removeByIds, { ids });
      if (response.status === Status.SUCCESS) {
        message.success(response.message);
        // 刷新数据
        yield put({ type: 'fetch' });
        callback();
      }
    },
    *form({ payload }, { call, put }) {
      const { visible, type } = payload;
      let title = typeAddTitle;
      let fields;
      // 修改
      if (type === Open.UPDATE) {
        const { id } = payload;
        title = typeUpdateTitle;
        // 查询数据
        const response: Result<ValueFormItemFields> = yield call(getById, { id });
        if (response.status === Status.SUCCESS) {
          fields = response.result;
        }
      }
      yield put({
        type: 'saveForm',
        payload: { type, fields, title, visible },
      });
    },
    *updateStatusById({ payload }, { call, put }) {
      const response: Result<ValueFormItemFields> = yield call(updateStatusById, payload);
      if (response.status === Status.SUCCESS && response.result === true) {
        yield put({ type: 'fetch', payload: { sorter: 'lastModifiedTime', asc: false } });
        notification.success({
          placement: 'topRight',
          message: '提示',
          description: response.message,
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
  },
};

export default DictTypeModel;
