export interface Dict {
  type: string;
  items: DictItem[];
  default: string;
}
export interface DictItem {
  value: string;
  label: string;
  color: string;
}
/**
 * 获取字典
 * @author SanLi
 * Created by qinggang.zuo@gmail.com / 2689170096@qq.com on  2019/10/20 17:05
 */
export function findDict(type: string): Dict {
  const dict: Dict[] = JSON.parse(<string>localStorage.getItem('smallbun-dict'));
  if (dict && dict.length > 0) {
    return dict.filter(v => v.type === type)[0];
  }
  return { type: '', default: '', items: [] };
}
