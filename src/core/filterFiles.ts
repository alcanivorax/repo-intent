import path from 'node:path'
import { octokit } from './github/client.js'
import { createIgnoreFilter } from '../util/ignore.js'
import type { FilterResult } from './types.js'

const ALLOWED_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx'])

function isMinified(content: string): boolean {
  const lines = content.split('\n')
  if (lines.length === 1 && content.length > 1000) return true
  return false
}

function isBinary(content: string): boolean {
  return content.includes('\0')
}

export async function filterFiles(
  owner: string,
  repo: string,
  branch: string,
  files: { path: string; size: number }[],
  maxLines = 500
): Promise<FilterResult> {
  // Fetch .gitignore (optional)
  let gitignoreContent = ''
  try {
    const res = await octokit.rest.repos.getContent({
      owner,
      repo,
      path: '.gitignore',
      ref: branch,
    })

    if (!Array.isArray(res.data) && 'content' in res.data) {
      gitignoreContent = Buffer.from(res.data.content, 'base64').toString(
        'utf8'
      )
    }
  } catch {
    // no gitignore, ignore silently
  }

  const ig = createIgnoreFilter(gitignoreContent)

  const selected: string[] = []
  const skipped: string[] = []

  for (const file of files) {
    const ext = path.extname(file.path)

    if (!ALLOWED_EXTENSIONS.has(ext)) {
      skipped.push(file.path)
      continue
    }

    if (ig.ignores(file.path)) {
      skipped.push(file.path)
      continue
    }

    // Fetch file content
    try {
      const res = await octokit.rest.repos.getContent({
        owner,
        repo,
        path: file.path,
        ref: branch,
      })

      if (Array.isArray(res.data) || !('content' in res.data)) {
        skipped.push(file.path)
        continue
      }

      const content = Buffer.from(res.data.content, 'base64').toString('utf8')

      if (!content.trim()) {
        skipped.push(file.path)
        continue
      }

      if (isBinary(content)) {
        skipped.push(file.path)
        continue
      }

      if (isMinified(content)) {
        skipped.push(file.path)
        continue
      }

      const lineCount = content.split('\n').length

      if (lineCount > maxLines) {
        skipped.push(file.path)
        continue
      }

      selected.push(file.path)
    } catch {
      skipped.push(file.path)
    }
  }

  console.log(selected, skipped)
  return { selected, skipped }
}
