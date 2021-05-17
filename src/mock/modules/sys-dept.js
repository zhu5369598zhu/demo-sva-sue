import Mock from 'mockjs'

// 生成数据列表
var dataList = []
for (let i = 0; i < Math.floor(Math.random() * 10 + 1); i++) {
  dataList.push(Mock.mock({
    'id': '@increment',
    'paramKey': '@first',
    'paramValue': '@last',
    'remark': '@csentence'
  }))
}

// 获取参数列表
export function list () {
  return {
    // isOpen: false,
    url: '/sys/dept/list',
    type: 'get',
    data: {
      'msg': 'success',
      'code': 0,
      'page': {
        'totalCount': dataList.length,
        'pageSize': 10,
        'totalPage': 1,
        'currPage': 1,
        'list': dataList
      }
    }
  }
}

// 获取上级菜单
export function select () {
  return {
    // isOpen: false,
    url: '/sys/dept/select',
    type: 'get',
    data: {
      'msg': 'success',
      'code': 0,
      'deptList': dataList
    }
  }
}

// 获取参数信息
export function info () {
  return {
    // isOpen: false,
    url: '/sys/dept/info',
    type: 'get',
    data: {
      'msg': 'success',
      'code': 0,
      'config': dataList[0]
    }
  }
}

// 添加参数
export function add () {
  return {
    // isOpen: false,
    url: '/sys/dept/save',
    type: 'post',
    data: {
      'msg': 'success',
      'code': 0
    }
  }
}

// 修改参数
export function update () {
  return {
    // isOpen: false,
    url: '/sys/dept/update',
    type: 'post',
    data: {
      'msg': 'success',
      'code': 0
    }
  }
}

// 删除参数
export function del () {
  return {
    // isOpen: false,
    url: '/sys/dept/delete',
    type: 'post',
    data: {
      'msg': 'success',
      'code': 0
    }
  }
}
