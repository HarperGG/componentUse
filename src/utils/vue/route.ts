import { RouteLocationNormalized, RouteRecordNormalized } from 'vue-router'
export function getRawRoute(route: RouteLocationNormalized): RouteLocationNormalized {
  if (!route) return route
  const { matched, ...opt } = route
  return {
    ...opt,
    matched: (matched
      ? matched.map((item) => ({
          meta: item.meta,
          name: item.name,
          path: item.path
        }))
      : undefined) as RouteRecordNormalized[]
  }
}

export function getQueryVariable(query) {
  if (!query) return null
  const queryObj = {}
  const vars = query.split('&')
  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split('=')
    queryObj[pair[0]] = pair[1]
  }
  return queryObj
}
