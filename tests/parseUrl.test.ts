import { describe, it, expect } from 'vitest'
import { parseRepoInput } from '../src/util/parseRepoInput.js'
import { parseGitHubRepoUrl } from '../src/util/parseGithubRepoUrl.js'

describe('parse repo url', () => {
  it('should return owner and repo name, shorthand method', () => {
    const result = parseRepoInput('alcanivorax/devInsight')
    expect(result).toStrictEqual({ owner: 'alcanivorax', repo: 'devInsight' })
  })
  it('should return owner and repo name, full url', () => {
    const result = parseGitHubRepoUrl(
      'https://github.com/alcanivorax/devInsight'
    )
    expect(result).toStrictEqual({ owner: 'alcanivorax', repo: 'devInsight' })
  })
})
