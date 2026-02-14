#!/usr/bin/env node

import { Command } from 'commander'
import { parseRepoInput } from './util/parseRepoInput.js'
import { getRepoTree } from './core/github/tree.js'

const program = new Command()

program
  .name('repo-intent')
  .argument('[target]', 'Path to repository')
  .action(async (target) => {
    const { owner, repo } = parseRepoInput(target)
    const tree = await getRepoTree(owner, repo)
    console.log(tree)
  })

program.parse()
