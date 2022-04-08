import { isObject } from '../is'
import { getUserList as userListApi } from '@/api/axios/app'
import { ref, reactive } from 'vue'
interface userParams {
  group: string
  name: string
}
const userListData = reactive<{ data: userParams[] }>({
  data: []
})

export function deepMerge<T = any>(src: any = {}, target: any = {}): T {
  let key: string
  for (key in target) {
    src[key] = isObject(target[key]) ? deepMerge(src[key], target[key]) : (src[key] = target[key])
  }
  return src
}

/** 处理 AD数据，装换成树形结构
 * @param arr
 */
interface ITree {
  label: string
  key: string
  disabled?: boolean
  children?: ITree[]
}
export function generateTree<T extends ITree>(
  arr: { name: string; group: string }[] = []
): {
  treeArr: T[]
  labelParent: string[]
} {
  const treeArr: Nullable<T[]> = []
  const labelParent: string[] = []

  const addChildrenTree = (group, value, treeArr: ITree[] = [], idx) => {
    const currentLevelKey = treeArr.map((tree: ITree) => tree.label)
    // 判断是不是最底层
    if (idx < group.length) {
      const firstGroup = group[idx]
      const index = currentLevelKey.findIndex((val) => val === firstGroup)
      if (index !== -1) {
        if (!treeArr[index].hasOwnProperty!('children')) treeArr[index]['children'] = []
        addChildrenTree(group, value, treeArr[index]['children'], ++idx)
      } else {
        const path = group.slice(0, idx + 1).join('/')
        treeArr.push({
          label: firstGroup,
          key: '/' + path,
          children: addChildrenTree(group, value, [], ++idx)
        })
      }
      if (!labelParent.includes(group.slice(0, idx + 1).join('/')))
        labelParent.push(group.slice(0, idx + 1).join('/'))
    } else {
      treeArr.push({
        label: value,
        key: value
      })
    }
    return treeArr
  }
  arr.forEach((info) => {
    addChildrenTree(
      info.group.split('/').filter((item) => !!item),
      info.name,
      treeArr,
      0
    )
  })
  return {
    treeArr,
    labelParent
  }
}

export async function getUserListApi() {
  const res = await userListApi()
  userListData.data = res.users
  const userManagers: any = []
  userListData.data.forEach(({ name, group }) => {
    if (
      userManagers.filter((res) => {
        return res.Name == name && res.group == group
      }).length == 0
    ) {
      userManagers.push({ name, group })
    }
  })
  return generateTree(userManagers)
}

export function authenticateUser(user, password) {
  const token = user + ':' + password
  const hash = btoa(token)
  return 'Basic ' + hash
}
