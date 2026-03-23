import { octokit } from './octokitClient.js'

export async function getContent(
  owner: string,
  repo: string,
  path: string = '.gitignore'
) {
  const res = await octokit.rest.repos.getContent({
    owner,
    repo,
    path,
  })
  console.log(res)
  console.log(res.data)
}
