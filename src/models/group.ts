import { AnyAction, Reducer } from 'redux';
import { EffectsCommandMap } from 'dva';
import { notification } from 'antd';
import {
  add,
  unique,
  getById,
  getList,
  removeByIds,
  updateById,
  getTree,
  updateStatusById,
} from '@/services/group';
import { FormItem, TableListItem, TreeNode } from '@/pages/group/data.d';
import { Omit, Open, Result, Status } from '@/pages/typings';
import { TableListData } from '@/components/StandardTable/data';
import { GroupStatus } from '@/pages/group/typings';

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap & { select: <T>(func: (state: {}) => T) => T },
) => void;
/**
 * 新增title
 */
const AddTitle = '新增机构';
/**
 * 修改title
 */
const UpdateTitle = '修改机构';

/**
 * StateType
 */
export interface StateType {
  list: TableListData<TableListItem>;
  tree: TreeNode[];
  form: FormItem;
}

/**
 * ModelType
 */
export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    tree: Effect;
    form: Effect;
    fetch: Effect;
    submit: Effect;
    remove: Effect;
    unique: Effect;
    updateStatus: Effect;
  };
  reducers: {
    saveList: Reducer<Omit<StateType, 'form' | 'tree'>>;
    saveTree: Reducer<Omit<StateType, 'form' | 'list'>>;
    saveForm: Reducer<Omit<StateType, 'list' | 'tree'>>;
  };
}
/**
 * 处理树
 * @param data
 */
function processTree(data: TreeNode[] | any) {
  if (data.length > 0) {
    data.forEach((i: TreeNode, index: number) => {
      data[index].disabled = i.status === GroupStatus.DISABLE;
      if (i.children) {
        processTree(i.children);
      }
    });
  }
}

const OrgModel: ModelType = {
  namespace: 'group',
  state: {
    list: {
      list: [],
      pagination: false,
    },
    tree: [],
    form: {
      type: Open.ADD,
      fields: {},
      title: AddTitle,
      visible: false,
    },
  },

  effects: {
    *unique({ payload, callback }, { call }) {
      const response: Result<object> = yield call(unique, payload);
      if (response.status === Status.SUCCESS) {
        callback(response.result);
      }
    },
    *tree({ payload }, { call, put }) {
      const response: Result<TreeNode[]> = yield call(getTree, payload);
      if (response.status === Status.SUCCESS) {
        const { result } = response;
        if (result) {
          processTree(result);
        }
        yield put({ type: 'saveTree', payload: response.result });
      }
    },
    *form({ payload }, { call, put }) {
      const { type, parentId, visible = true } = payload;
      let { title = AddTitle } = payload;
      let fields = {};
      // 新增
      if (type === Open.ADD) {
        fields = { parentId };
      }
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
      // 调用tree获取数据
      yield put({ type: 'tree' });
      yield put({ type: 'saveForm', payload: { type, fields, title, visible } });
    },
    *fetch({ payload }, { call, put }) {
      const response: Result<TableListItem> = yield call(getList, payload);
      if (response.status === Status.SUCCESS) {
        yield put({ type: 'saveList', payload: { list: response.result } });
      }
    },
    *submit({ payload, callback }, { call, select }) {
      // 获取state
      const type: Open = yield select((state: any) => state.group.form.type);
      // 新增
      if (type === Open.ADD) {
        callback(yield call(add, payload));
        return;
      }
      // 修改
      callback(yield call(updateById, payload));
    },
    *remove({ payload, callback }, { call }) {
      callback(yield call(removeByIds, payload));
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
    saveTree(state, action) {
      return {
        ...state,
        tree: action.payload,
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

export default OrgModel;
