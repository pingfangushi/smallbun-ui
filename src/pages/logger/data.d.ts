/**
 * 登录日志列表
 */
export interface LoginTableListItem {
  id?: string;
  module?: string;
  feature?: string;
  browser?: string;
  action?: string;
  uri?: string;
  ip?: string;
  location?: string;
  os?: string;
  platform?: string;
  method?: string;
  time?: string;
}

/**
 * 操作日志列表
 */
export interface OperateTableListItem {
  id?: string;
  module?: string;
  feature?: string;
  browser?: string;
  action?: string;
  uri?: string;
  ip?: string;
  location?: string;
  os?: string;
  platform?: string;
  method?: string;
  time?: string;
}

/**
 * 操作详情
 */
export interface OperateDetailsItem {
  id?: string;
  module?: string;
  feature?: string;
  browser?: string;
  action?: string;
  uri?: string;
  ip?: string;
  location?: string;
  os?: string;
  platform?: string;
  method?: string;
  user?: string;
  time?: string;
  status?: string;
}
