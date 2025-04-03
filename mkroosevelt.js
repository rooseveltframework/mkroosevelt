#!/usr/bin/env node
(async () => {
  const yeomanEnvModule = await import('yeoman-environment')
  const YeomanEnvironment = yeomanEnvModule.default
  const env = new YeomanEnvironment()
  const args = process.argv.slice(2)
  let chosenDirectoryName
  let chosenAppType
  if (args.length > 0 && args !== undefined) {
    chosenDirectoryName = args[0]
    chosenAppType = 'MPA — multi-page app (recommended for most apps)'
  } else {
    const inquirerModule = await import('inquirer')
    await inquirerModule.default.prompt([
      {
        name: 'file',
        type: 'input',
        message: 'What would you like to name your Roosevelt app?',
        default: 'my-roosevelt-sample-app'
      },
      {
        name: 'type',
        type: 'list',
        message: 'Which type of app do you want?',
        choices: [
          'MPA — multi-page app (recommended for most apps)',
          'Static site generator (easiest to use, but fewer features available)',
          'SPA — single page app (advanced users only)'
        ]
      }
    ]).then((response) => {
      chosenDirectoryName = response.file
      chosenAppType = response.type
    })
  }
  await env.lookup()
  if (chosenAppType === 'MPA — multi-page app (recommended for most apps)') await env.run(`roosevelt --standard-mpa-install ${chosenDirectoryName}`)
  if (chosenAppType === 'Static site generator (easiest to use, but fewer features available)') await env.run(`roosevelt --standard-static-install ${chosenDirectoryName}`)
  if (chosenAppType === 'SPA — single page app (advanced users only)') await env.run(`roosevelt --standard-spa-install ${chosenDirectoryName}`)
})()
