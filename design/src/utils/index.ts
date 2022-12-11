export function lazyLoader(path: string) {
  return () => import(`../views/${path}`)
}
