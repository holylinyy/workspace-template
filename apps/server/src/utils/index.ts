export const to = async <T = any, E = Error>(
  p: Promise<T>,
): Promise<readonly [E, null] | readonly [null, T]> => {
  return Promise.resolve(p)
    .then((d) => [null, d] as [null, T])
    .catch((e: E) => {
      return [e, null] as const
    })
}
export const base64ToString = (b64) => {
  return Buffer.from(b64, 'base64').toString('utf-8')
}
