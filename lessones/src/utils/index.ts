export function lazyLoader(name: string) {
  return async () => await import(`../views/${name}/index.ts`)
}
