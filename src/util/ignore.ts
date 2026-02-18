import ignore from 'ignore'

const DEFAULT_IGNORES = [
  'node_modules',
  'dist',
  'build',
  '.next',
  'coverage',
  '*.lock',
]

export function createIgnoreFilter(gitignoreContent?: string) {
  const ig = ignore()

  ig.add(DEFAULT_IGNORES)

  if (gitignoreContent) {
    ig.add(gitignoreContent)
  }

  return ig
}
