export function lazyLoader(path: string) {
  return async () => await import(`../views/${path}/index.ts`)
}
