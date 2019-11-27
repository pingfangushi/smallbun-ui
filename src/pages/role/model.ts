import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { message, notification } from 'antd';
import {
  add,
  getById,
  getPage,
  getRoleAuth,
  removeByIds,
  unique,
  update,
  updateAuthorize,
  updateStatusById,
} from './service';
import { Omit, Open, Result, Status } from '@/pages/typings';
import { TableListData } from '@/components/StandardTable/data.d';
import { Auth, AuthItem, Form, Item, TableListItem } from '@/pages/role/data';
import { AuthorityType } from '@/pages/authority/typings';

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: {}) => T) => T },
) => void;
/**
 * 新增title
 */
const AddTitle = '新增角色';
/**
 * 修改title
 */
const UpdateTitle = '修改角色';

/**
 * StateType
 */
export interface StateType {
  list: TableListData<TableListItem>;
  form: Form;
  auth: Auth;
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
    submit: Effect;
    remove: Effect;
    unique: Effect;
    updateStatus: Effect;
    fetchAuthorize: Effect;
    updateAuthorize: Effect;
  };
  reducers: {
    saveList: Reducer<Omit<StateType, 'form' | 'auth'>>;
    saveForm: Reducer<Omit<StateType, 'list' | 'auth'>>;
    saveAuth: Reducer<Omit<StateType, 'list' | 'form'>>;
  };
}

/**
 * 处理选中
 * @param auth
 * @param item
 * @param checked
 */
function processingSelected(auth: Item[], item: string[] | string, checked: boolean) {
  const auths: Item[] = [];
  auth.forEach(it => {
    // 判断是否是 array 分别不同处理方式
    if (!Array.isArray(item)) {
      if (it.id === item) {
        // 更改数组值
        const ite: Item = it;
        ite.checked = checked;
        auths.unshift(ite);
      } else {
        auths.unshift(it);
      }
    } else {
      // 更改数组值
      const ite: Item = it;
      ite.checked = checked;
      auths.unshift(ite);
    }
  });

  return auths;
}
const RoleModel: ModelType = {
  namespace: 'role',
  state: {
    list: {
      list: [],
      pagination: {},
    },
    auth: {},
    form: {
      type: Open.ADD,
      fields: {},
      title: AddTitle,
      visible: false,
    },
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response: Result<TableListData<TableListItem>> = yield call(getPage, payload);
      if (response.status === Status.SUCCESS) {
        yield put({ type: 'saveList', payload: response.result });
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
      yield put({ type: 'saveForm', payload: { type, fields, title, visible } });
    },
    *submit({ payload, callback }, { call, put, select }) {
      // 获取state
      const type: Open = yield select((state: any) => state.role.form.type);
      let response: Result<boolean> = { message: '', status: Status.EX900001, result: [] };
      // 新增
      if (type === Open.ADD) {
        response = yield call(add, payload);
      }
      // 修改
      if (type === Open.UPDATE) {
        response = yield call(update, payload);
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
    *unique({ payload, callback }, { call }) {
      const response: Result<object> = yield call(unique, payload);
      if (response.status === Status.SUCCESS) {
        callback(response.result);
      }
    },
    *fetchAuthorize({ payload }, { call, put }) {
      let items: object[] = [];
      // 如果是显示,获取权限
      if (payload.visible) {
        const response: Result<any> = yield call(getRoleAuth, payload.id);
        if (response.status === Status.SUCCESS) {
          items = response.result;
        }
      }
      yield put({
        type: 'saveAuth',
        payload: {
          visible: payload.visible,
          id: payload.id,
          items,
        },
      });
    },
    *updateAuthorize({ payload }, { call, put, select }) {
      // 调用接口
      const response: Result<boolean> = yield call(updateAuthorize, {
        ...payload,
        auth: Array.isArray(payload.item)
          ? new Array(payload.item).join(',').toString()
          : payload.item,
      });
      if (response.status === Status.SUCCESS && response.result === true) {
        const { auth, type, item, checked } = payload;
        // 获取state数据
        const aut: Auth = yield select((state: any) => state.role.auth);
        // 修改state数据
        if (aut !== undefined && aut.items !== undefined) {
          aut.items.forEach((i: AuthItem) => {
            if (i.id === auth) {
              // 路由
              if (type === AuthorityType.ROUTE) {
                const items = processingSelected(i.routes, item, checked);
                i.routes.splice(0, i.routes.length);
                items.forEach(ite => {
                  i.routes.unshift(ite);
                });
              }
              // 操作
              if (type === AuthorityType.OPERATE) {
                const items = processingSelected(i.operates, item, checked);
                i.operates.splice(0, i.operates.length);
                items.forEach(ite => {
                  i.operates.unshift(ite);
                });
              }
              // 接口
              if (type === AuthorityType.INTERFACE) {
                const items = processingSelected(i.interfaces, item, checked);
                i.interfaces.splice(0, i.interfaces.length);
                items.forEach(ite => {
                  i.interfaces.unshift(ite);
                });
              }
            }
          });
        }
        // 同步修改state
        yield put({
          type: 'saveAuth',
          payload: { ...aut },
        });
        notification.success({ message: '提示', description: response.message });
        return;
      }
      notification.warning({ message: '提示', description: response.message });
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
    saveAuth(state, action) {
      return {
        ...state,
        auth: action.payload,
      };
    },
  },
};

export default RoleModel;
