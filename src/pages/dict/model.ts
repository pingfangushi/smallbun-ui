import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { message, notification } from 'antd';
import {
  ItemTableListItem,
  TypeFormItem,
  TypeTableListItem,
  ItemFormItem,
  ItemFormItemFields,
  TypeFormItemFields,
} from './data.d';
import { Open, Result, Status } from '@/pages/typings';
import {
  addItem,
  addType,
  fetchTypes,
  fetchItems,
  uniqueType,
  uniqueItem,
  getItemById,
  getTypeById,
  updateItemById,
  updateTypeById,
  removeTypeByIds,
  removeItemByIds,
  updateStatusById,
  updateDefaultById,
} from './service';
import { TableListData } from '@/components/StandardTable/data';

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: {}) => T) => T },
) => void;
const typeUpdateTitle = '修改字典类型';
const typeAddTitle = '新增字典类型';
const itemUpdateTitle = '修改字典项';
const itemAddTitle = '新增字典项';

export interface TypeStateType {
  list: TableListData<TypeTableListItem>;
  form: TypeFormItem;
}

export interface ItemStateType {
  list: TableListData<ItemTableListItem>;
  /* 是否显示 */
  visible: boolean;
  /* 当前类型 */
  type: TypeTableListItem;
  form: ItemFormItem;
}

/**
 * StateType
 */
export interface StateType {
  /* 字典类型 */
  type: TypeStateType;
  /* 字典项 */
  item: ItemStateType;
}

/**
 * ModelType
 */
export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    typeForm: Effect;
    itemForm: Effect;
    uniqueType: Effect;
    uniqueItem: Effect;
    submitType: Effect;
    submitItem: Effect;
    removeType: Effect;
    removeItem: Effect;
    fetchTypes: Effect;
    fetchItems: Effect;
    updateStatus: Effect;
    updateDefault: Effect;
  };
  reducers: {
    saveType: Reducer<Omit<StateType, 'item'>>;
    saveItem: Reducer<Omit<StateType, 'type'>>;
  };
}

const DictModel: ModelType = {
  namespace: 'dict',
  state: {
    type: { list: { list: [], pagination: {} }, form: {} },
    item: { list: { list: [], pagination: {} }, form: {}, visible: false, type: {} },
  },

  effects: {
    *typeForm({ payload }, { call, put, select }) {
      const { visible, operating, id } = payload;
      let title = typeAddTitle;
      let fields;
      // 修改
      if (operating === Open.UPDATE) {
        title = typeUpdateTitle;
        // 查询数据
        const response: Result<TypeFormItemFields> = yield call(getTypeById, { id });
        if (response.status === Status.SUCCESS) {
          fields = response.result;
        }
      }
      const list = yield select((state: any) => state.dict.type.list);
      yield put({
        type: 'saveType',
        payload: { form: { operating, fields, title, visible }, list },
      });
    },
    *itemForm({ payload }, { call, put, select }) {
      const { visible, operating, id } = payload;
      let title = itemAddTitle;
      let { fields } = payload;
      // 修改
      if (operating === Open.UPDATE) {
        title = itemUpdateTitle;
        // 查询数据
        const response: Result<ItemFormItemFields> = yield call(getItemById, { id });
        if (response.status === Status.SUCCESS) {
          fields = response.result;
        }
      }
      yield put({
        type: 'saveItem',
        payload: {
          form: { operating, fields, title, visible },
          list: yield select((state: any) => state.dict.item.list),
          type: yield select((state: any) => state.dict.item.type),
          visible: yield select((state: any) => state.dict.item.visible),
        },
      });
    },
    *fetchTypes({ payload }, { call, put, select }) {
      const response: Result<TableListData<TypeStateType>> = yield call(fetchTypes, payload);
      if (response && response.status === Status.SUCCESS) {
        const form = yield select((state: any) => state.dict.type.form);
        yield put({ type: 'saveType', payload: { list: response.result, form } });
      }
    },
    *fetchItems({ payload }, { call, put, select }) {
      // 说明是字典项要关闭
      if (payload.visible !== undefined && !payload.visible) {
        const form = yield select((state: any) => state.dict.item.form);
        yield put({ type: 'saveItem', payload: { visible: payload.visible, type: {}, form } });
        return;
      }
      let response: Result<TableListData<ItemStateType>>;
      // 这里处理是为了排序
      const type = yield select((state: any) => state.dict.item.type);
      if (type.id) {
        response = yield call(fetchItems, { ...payload, type: type.id });
      } else {
        response = yield call(fetchItems, { ...payload, type: payload.type.id });
      }
      if (response && response.status === Status.SUCCESS) {
        const form = yield select((state: any) => state.dict.item.form);
        yield put({
          type: 'saveItem',
          payload: {
            list: response.result,
            type: type.id !== undefined ? type : payload.type,
            visible: true,
            form,
          },
        });
      }
    },
    *submitType({ payload, callback }, { call, put, select }) {
      const operating: Open = yield select((state: any) => state.dict.type.form.operating);
      let response: Result<boolean> = { message: '', status: Status.EX900001, result: [] };
      // 新增
      if (operating === Open.ADD) {
        response = yield call(addType, payload);
      }
      // 修改
      if (operating === Open.UPDATE) {
        response = yield call(updateTypeById, payload);
      }
      // 成功
      if (response.status === Status.SUCCESS) {
        // 关闭Form
        yield put({ type: 'typeForm', payload: { visible: false } });
        callback();
        // 消息提示
        message.success(response.message);
        // 刷新数据,根据修改日期排序
        yield put({
          type: 'fetchTypes',
          payload: { sorter: 'lastModifiedTime', asc: false },
        });
      }
    },
    *submitItem({ payload, callback }, { call, put, select }) {
      const operating: Open = yield select((state: any) => state.dict.item.form.operating);
      let response: Result<boolean> = { message: '', status: Status.EX900001, result: [] };
      // 新增
      if (operating === Open.ADD) {
        response = yield call(addItem, payload);
      }
      // 修改
      if (operating === Open.UPDATE) {
        response = yield call(updateItemById, payload);
      }
      // 成功
      if (response.status === Status.SUCCESS) {
        // 关闭Form
        yield put({ type: 'itemForm', payload: { visible: false } });
        callback();
        // 消息提示
        message.success(response.message);
        // 刷新数据
        const type: TypeTableListItem = yield select((state: any) => state.dict.item.type);
        yield put({
          type: 'fetchItems',
          payload: {
            sorter: 'sort',
            asc: true,
            visible: true,
            type,
          },
        });
      }
    },
    *removeType({ payload, callback }, { call, put, select }) {
      const response: Result<boolean> = yield call(removeTypeByIds, payload);
      if (response.status === Status.SUCCESS) {
        message.success(response.message);
        const type: TypeTableListItem = yield select((state: any) => state.dict.item.type);
        // 刷新数据
        yield put({
          type: 'fetchTypes',
          payload: {
            sorter: 'lastModifiedTime',
            asc: false,
            visible: true,
            type,
          },
        });
        callback();
      }
    },
    *removeItem({ payload, callback }, { call, put, select }) {
      const response: Result<boolean> = yield call(removeItemByIds, payload);
      if (response.status === Status.SUCCESS) {
        message.success(response.message);
        const type: TypeTableListItem = yield select((state: any) => state.dict.item.type);
        // 刷新数据
        yield put({
          type: 'fetchItems',
          payload: {
            sorter: 'sort',
            asc: true,
            visible: true,
            type,
          },
        });
        callback();
      }
    },
    *uniqueType({ payload, callback }, { call }) {
      const response: Result<boolean> = yield call(uniqueType, payload);
      if (response.status === Status.SUCCESS) {
        callback(response.result);
      }
    },
    *uniqueItem({ payload, callback }, { call }) {
      const response: Result<boolean> = yield call(uniqueItem, payload);
      if (response.status === Status.SUCCESS) {
        callback(response.result);
      }
    },
    *updateStatus({ payload }, { call, put }) {
      const response: Result<boolean> = yield call(updateStatusById, payload);
      if (response.status === Status.SUCCESS && response.result === true) {
        // 刷新数据
        yield put({
          type: 'fetchTypes',
          payload: { sorter: 'lastModifiedTime', asc: false },
        });
        notification.success({
          placement: 'topRight',
          message: '提示',
          description: response.message,
        });
      }
    },
    *updateDefault({ payload }, { call, put, select }) {
      let notificationType: 'warn' | 'success' = 'warn';
      const response: Result<boolean> = yield call(updateDefaultById, payload);
      if (response.status === Status.SUCCESS && response.result === true) {
        // 刷新数据
        const type: TypeTableListItem = yield select((state: any) => state.dict.item.type);
        // 刷新数据
        yield put({
          type: 'fetchItems',
          payload: {
            sorter: 'sort',
            asc: true,
            visible: true,
            type,
          },
        });
        notificationType = 'success';
      }
      notification[notificationType]({
        placement: 'topRight',
        message: '提示',
        description: response.message,
      });
    },
  },
  reducers: {
    saveType(state, action) {
      return {
        ...state,
        type: action.payload,
      };
    },
    saveItem(state, action) {
      return {
        ...state,
        item: action.payload,
      };
    },
  },
};

export default DictModel;
