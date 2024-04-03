#!/usr/bin/env node

const yeoman = require('yeoman-environment')
const env = yeoman.createEnv()

const myArgs = process.argv.slice(2)
let chosenDirectoryName

async function askDirectoryName () {
  const inquirerModule = await import('inquirer')
  const inquirer = inquirerModule.default

  return inquirer
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

async function callYeoman (filename) {
  // search for generator
  await env.lookup()
  env.run(`roosevelt --standard-install ${filename}`)
}

async function runGenerator () {
  // check if args specified
  if (myArgs.length < 1 || myArgs === undefined) {
    // run prompt when no directory given
    await askDirectoryName()
  } else {
    chosenDirectoryName = myArgs[0]
  }

  callYeoman(chosenDirectoryName)
}

runGenerator()
