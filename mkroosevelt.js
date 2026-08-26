#!/usr/bin/env node
(async () => {
  const yeomanEnvModule = await import('yeoman-environment')
  const YeomanEnvironment = yeomanEnvModule.default
  const env = new YeomanEnvironment()
  const args = process.argv.slice(2)

  const appTypes = [
    { label: 'MPA — multi-page app (recommended for most apps)', install: '--standard-mpa-install' },
    { label: 'Static site generator (easiest to use, but fewer features available)', install: '--standard-static-install' },
    { label: 'SPA — single page app (advanced users only)', install: '--standard-spa-install' }
  ]
  const defaultName = 'my-roosevelt-sample-app'

  let chosenDirectoryName = args[0]
  let chosenAppType = appTypes[0]

  // a directory name given at the command line means there is nothing left to ask
  if (!chosenDirectoryName) {
    // node's own readline asks these two questions, so this tool does not need a prompt library installed before it can ask anything
    const readline = require('node:readline/promises')
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout })

    const name = await rl.question(`What would you like to name your Roosevelt app? (${defaultName}) `)
    chosenDirectoryName = name.trim() || defaultName

    console.log('\nWhich type of app do you want?')
    for (const [index, type] of appTypes.entries()) console.log(`  ${index + 1}) ${type.label}`)
    const choice = await rl.question(`Enter a number from 1 to ${appTypes.length} (1): `)
    chosenAppType = appTypes[parseInt(choice.trim(), 10) - 1] || appTypes[0]

    rl.close()
  }

  await env.lookup()
  await env.run(`roosevelt ${chosenAppType.install} ${chosenDirectoryName}`)
})()
