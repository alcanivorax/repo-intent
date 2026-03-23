export type FilterResult = {
  selected: string[]
  skipped: string[]
}

export interface Metrics {
  line: number
  sizeByte: number
  tokenCount: number
}

export interface FileInfo {
  repoId: string
  path: string
  relativePath: string
  extension: string
  language: string
}

export interface FileNode {
  path: string
  sha: string
  size?: number
  type: string
}
