import fetch from 'dva/fetch';
import { Result, Status } from '@/pages/typings';

/**
 * render
 * @author SanLi
 * Created by qinggang.zuo@gmail.com / 2689170096@qq.com on  2019/10/24 21:07
 */
export function render(oldRender: () => void) {
  // get dict
  fetch('/api/dict')
    .then(result => result.json())
    .then((result: Result<object>) => {
      if (result.status === Status.SUCCESS) {
        localStorage.setItem('smallbun-dict', JSON.stringify(result.result));
        oldRender();
      }
    });
  // get auth roues
}
