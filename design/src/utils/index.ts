export function lazyLoader(path: string) {
  return async () => await import(`../views/${path}/index.ts`)
}

export function normalizedTime(time = Date.now()) {
  const now = new Date()
  const startOfDay = new Date(now.setHours(0, 0, 0, 0)).getTime()
  const endOfDay = new Date(now.setHours(23, 59, 59, 999)).getTime()

  const normalized = (time - startOfDay) / (endOfDay - startOfDay)

  return normalized
}
