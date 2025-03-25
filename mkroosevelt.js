#!/usr/bin/env node
(async () => {
  const yeomanEnvModule = await import('yeoman-environment')
  const env = new yeomanEnvModule.default()
  const args = process.argv.slice(2)
  let chosenDirectoryName
  if (args.length > 0 && args !== undefined) chosenDirectoryName = args[0]
  else {
    const inquirerModule = await import('inquirer')
    await inquirerModule.default
      .prompt([
        {
          name: 'file',
          type: 'input',
          message: 'What would you like to name your Roosevelt app?',
          default: 'my-roosevelt-sample-app'
        }
      ])
      .then((response) => {
        chosenDirectoryName = response.file
      })
  }
  await env.lookup()
  await env.run(`roosevelt --standard-install ${chosenDirectoryName}`)
})()
