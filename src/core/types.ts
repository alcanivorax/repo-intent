export interface FileNode {
  path: string
  size: number
}

export type FilterResult = {
  selected: string[]
  skipped: string[]
}
