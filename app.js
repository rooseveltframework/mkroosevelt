#!/usr/bin/env node

const inquirer = require('inquirer')
const path = require('path')
const yeoman = require('yeoman-environment')
const env = yeoman.createEnv()

const myArgs = process.argv.slice(2)
let chosenDirectoryName

function askDirectoryName () {
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

function callYeoman (filename) {
  // search for generator
  env.lookup(() => {
    env.run(`roosevelt --standard-install ${filename}`)
  })
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
