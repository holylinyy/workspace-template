export const to = async <T = any, E = Error>(
  p: any,
): Promise<readonly [E, null] | readonly [null, T]> => {
  return Promise.resolve(p)
    .then((d) => [null, d] as [null, T])
    .catch((e: E) => {
      return [e, null] as const
    })
}
