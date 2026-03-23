import { octokit } from './octokitClient.js'
import type { FileNode } from '../types.js'
/*
 * Retrieves the repository tree for a given owner and repo.
 *
 * @param {string} owner - The owner of the repository.
 * @param {string} repo - The name of the repository.
 * @returns {Promise<FileNode[]>} - A promise that resolves to an array of FileNode objects.
 */
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

  if (treeRes.status !== 200) {
    throw new Error(`Failed to get tree: ${treeRes.status}`)
  }

  return treeRes.data.tree
}
