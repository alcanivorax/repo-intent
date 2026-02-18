#!/usr/bin/env node

import { Command } from 'commander'
import { parseRepoInput } from './util/parseRepoInput.js'
import { getRepoTree } from './core/github/tree.js'
import { filterFiles } from './core/filterFiles.js'

const program = new Command()

program
  .name('repo-intent')
  .argument('[target]', 'Path to repository')
  .action(async (target) => {
    const { owner, repo } = parseRepoInput(target)
    const tree = await getRepoTree(owner, repo)
    const filteredFiles = await filterFiles(owner, repo, 'main', tree)
    console.log(filteredFiles)
  })

program.parse()
