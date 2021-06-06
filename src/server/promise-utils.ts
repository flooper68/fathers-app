export const runPromisesInSequence = async <Item>(
  array: Item[],
  callback: (item: Item) => Promise<void>
) => {
  return array.reduce(async (memo, item) => {
    await memo
    return callback(item)
  }, Promise.resolve())
}

export const reducePromisesInSequence = async <Item, Result>(
  array: Item[],
  callback: (item: Item, result: Result[]) => Promise<Result[]>
) => {
  return array.reduce(async (memo, item) => {
    const result = await memo
    return callback(item, result)
  }, Promise.resolve<Result[]>([]))
}
