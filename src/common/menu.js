import { isUrl } from '../utils/utils';

const menuData = [
  {
    name: 'dashboard',
    icon: 'dashboard',
    path: 'dashboard',
  },
  {
    name: '表单页',
    icon: 'form',
    path: 'form',
  },
  {
    name: '列表页',
    icon: 'table',
    path: 'list',
  },
  {
    name: '详情页',
    icon: 'profile',
    path: 'profile',
  },
  {
    name: '结果页',
    icon: 'check-circle-o',
    path: 'result',
  },
  {
    name: '异常页',
    icon: 'warning',
    path: 'exception',
  },
  {
    name: '账户',
    icon: 'user',
    path: 'user',
    authority: 'guest',
  },
];

function formatter(data, parentPath = '', parentAuthority) {
  return data.map((item) => {
    let { path } = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}

export const getMenuData = () => formatter(menuData);
