import { Open, Result, StatusEnum } from '@/pages/typings';
import { TableListParams } from '@/components/StandardTable/data';

/*= ====================Type===================== */
export interface TypeTableListItem {
  id?: string;
  name?: string;
  code?: string;
  status?: string;
}

export interface TypeFormItem {
  title?: string;
  visible?: boolean;
  operating?: Open;
  fields?: TypeFormItemFields;
}

export interface TypeFormItemFields {
  id?: string | number;
  status?: StatusEnum;
  name?: string;
  code?: string;
  remarks?: string;
}

/*= ====================Item===================== */

export interface ItemTableListItem {
  id?: string;
  label?: string;
  value?: string;
  status?: string;
  sort?: string;
}

export interface ItemFormItem {
  type?: Open;
  fields?: ItemFormItemFields;
  title?: string;
  visible?: boolean;
}

export interface ItemFormItemFields {
  id?: string;
  type?: string;
  label?: string;
  value?: string;
  color?: string;
  status?: string;
  sort?: string | number;
  remarks?: string;
}

export { TableListParams, Result };
