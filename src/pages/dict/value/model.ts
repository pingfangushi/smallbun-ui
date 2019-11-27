import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { message, notification } from 'antd';
import {
  add,
  fetch,
  getById,
  removeByIds,
  unique,
  updateById,
  updateIsDefaultById,
} from './service';
import {
  TypeTableListItem,
  ValueFormItem,
  ValueFormItemFields,
  ValueTableListItem,
} from './data.d';
import { Omit, Open, Result, Status, TableListData } from '@/pages/typeings';

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: {}) => T) => T },
) => void;
const valueUpdateTitle = '修改字典值';
const valueAddTitle = '新增字典值';

/**
 * StateType
 */
export interface StateType {
  list: TableListData<ValueTableListItem>;
  form: ValueFormItem;
  type: TypeTableListItem;
  visible: boolean;
}

/**
 * ModelType
 */
export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    /* value */
    fetch: Effect;
    submit: Effect;
    form: Effect;
    visible: Effect;
    remove: Effect;
    unique: Effect;
    updateIsDefaultById: Effect;
  };
  reducers: {
    saveVisible: Reducer<Omit<StateType, 'type' | 'list' | 'form'>>;
    saveList: Reducer<Omit<StateType, 'type' | 'form' | 'visible'>>;
    saveForm: Reducer<Omit<StateType, 'type' | 'list' | 'visible'>>;
    saveType: Reducer<Omit<StateType, 'list' | 'form' | 'visible'>>;
  };
}

// noinspection DuplicatedCode
const DictValueModel: ModelType = {
  namespace: 'dictValue',
  state: {
    visible: false,
    list: {
      list: [],
      pagination: {},
    },
    form: { visible: false, fields: {} },
    type: {},
  },

  effects: {
    *unique({ payload, callback }, { call }) {
      const response: Result<boolean> = yield call(unique, payload);
      if (response.status === Status.SUCCESS) {
        callback(response.result);
      }
    },
    *fetch({ payload }, { call, put, select }) {
      const id = yield select((state: any) => state.dictValue.type.id);
      const response: Result<ValueTableListItem> = yield call(fetch, {
        ...payload,
        type: id,
        sorter: 'sort',
        asc: true,
      });
      if (response.status === Status.SUCCESS) {
        yield put({ type: 'saveList', payload: response.result });
      }
    },
    *visible({ payload }, { put }) {
      const { visible } = payload;
      const { type } = payload;
      if (!visible) {
        yield put({ type: 'saveList', payload: {} });
      }
      yield put({ type: 'saveType', payload: type });
      yield put({ type: 'saveVisible', payload: visible });
    },
    *submit({ payload, callback }, { call, put, select }) {
      // 获取state
      const type: Open = yield select((state: any) => state.dictValue.form.type);
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
    *form({ payload }, { call, put, select }) {
      const dictType = yield select((state: any) => state.dictValue.type);
      const { visible, type } = payload;
      let title = valueAddTitle;
      let fields;
      // 新增
      if (type === Open.ADD) {
        fields = {
          sort: 9999,
          type: dictType.id,
          color: 'green',
        };
      }
      // 修改
      if (type === Open.UPDATE) {
        const { id } = payload;
        title = valueUpdateTitle;
        // 查询数据
        const response: Result<ValueFormItemFields> = yield call(getById, { id });
        if (response.status === Status.SUCCESS) {
          fields = response.result;
        }
      }
      yield put({ type: 'saveForm', payload: { type, fields, title, visible } });
    },
    *updateIsDefaultById({ payload }, { call, put }) {
      const response: Result<ValueFormItemFields> = yield call(updateIsDefaultById, payload);
      if (response.status === Status.SUCCESS && response.result === true) {
        yield put({ type: 'fetch', payload: { sorter: 'lastModifiedTime', asc: false } });
        notification.success({
          placement: 'topRight',
          message: '提示',
          description: response.message,
        });
        return;
      }
      notification.error({
        placement: 'topRight',
        message: '提示',
        description: response.message,
      });
    },
  },
  reducers: {
    saveVisible(state, action) {
      return {
        ...state,
        visible: action.payload,
      };
    },
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
    saveType(state, action) {
      return {
        ...state,
        type: action.payload,
      };
    },
  },
};

export default DictValueModel;
