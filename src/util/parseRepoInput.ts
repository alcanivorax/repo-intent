import { repoInputSchema } from '../schema/repoInputSchema.js'
import { parseGitHubRepoUrl } from './parseGithubRepoUrl.js'

export function parseRepoInput(input: string) {
  const value = repoInputSchema.parse(input)
  if (value.includes('github.com')) {
    parseGitHubRepoUrl(value)
  }

  const [owner, repo] = value.split('/')
  return { owner, repo }
}
