export const onlyUnique = (value: string, index: number, self: string[]) => {
  return self.indexOf(value) === index
}
