import { octokit } from './client.js'
import { FileNode } from '../types.js'

export async function getRepoTree(
  owner: string,
  repo: string
): Promise<FileNode[]> {
  const repoInfo = await octokit.rest.repos.get({ owner, repo })
  const branch = repoInfo.data.default_branch

  const branchRes = await octokit.rest.repos.getBranch({
    owner,
    repo,
    branch,
  })

  const treeSha = branchRes.data.commit.commit.tree.sha

  const treeRes = await octokit.rest.git.getTree({
    owner,
    repo,
    tree_sha: treeSha,
    recursive: '1',
  })

  // 🔐 Runtime validation
  const files: FileNode[] = treeRes.data.tree
    .filter((item) => item.type === 'blob')
    .map((item) => ({ path: item.path, size: item.size ?? 0 })) // size?

  return files
}
