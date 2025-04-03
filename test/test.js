/* eslint-env mocha */
const assert = require('assert')
const spawn = require('child_process').spawn
const fs = require('fs-extra')

describe('Create Roosevelt app', () => {
  it('should answer prompts and select MPA', (done) => {
    const child = spawn('node', ['mkroosevelt.js'])
    child.stdout.on('data', (data) => {
      if (data.includes('What would you like to name your Roosevelt app')) child.stdin.write('\n')
      if (data.includes('Which type of app do you want?')) child.stdin.write('\n')
    })
    child.on('close', () => {
      let allThere = false
      const exists1 = fs.existsSync('my-roosevelt-sample-app')
      const exists2 = fs.existsSync('my-roosevelt-sample-app/.gitignore')
      const exists3 = fs.existsSync('my-roosevelt-sample-app/app.js')
      const exists4 = fs.existsSync('my-roosevelt-sample-app/mvc')
      allThere = exists1 && exists2 && exists3 && exists4
      fs.removeSync('my-roosevelt-sample-app')
      assert.strictEqual(allThere, true)
      done()
    })
  })

  it('should answer prompts and select static site', (done) => {
    const child = spawn('node', ['mkroosevelt.js'])
    const answered = {}
    child.stdout.on('data', (data) => {
      if (!answered[0] && data.includes('What would you like to name your Roosevelt app')) {
        answered[0] = true
        child.stdin.write('\n')
      }
      if (!answered[1] && data.includes('Which type of app do you want?')) {
        answered[1] = true
        child.stdin.write('2\n')
      }
    })
    child.on('close', () => {
      let allThere = false
      const exists = fs.existsSync('my-roosevelt-sample-app/statics/pages/index.js')
      allThere = exists
      fs.removeSync('my-roosevelt-sample-app')
      assert.strictEqual(allThere, true)
      done()
    })
  })

  it('should answer prompts and select SPA', (done) => {
    const child = spawn('node', ['mkroosevelt.js'])
    const answered = {}
    child.stdout.on('data', (data) => {
      if (!answered[0] && data.includes('What would you like to name your Roosevelt app')) {
        answered[0] = true
        child.stdin.write('\n')
      }
      if (!answered[1] && data.includes('Which type of app do you want?')) {
        answered[1] = true
        child.stdin.write('3\n')
      }
    })
    child.on('close', () => {
      let allThere = false
      const exists = fs.existsSync('my-roosevelt-sample-app/mvc/models/getRandomNumber.js')
      allThere = exists
      fs.removeSync('my-roosevelt-sample-app')
      assert.strictEqual(allThere, true)
      done()
    })
  })

  it('should not prompt when given one at command line', (done) => {
    const child = spawn('node', ['mkroosevelt.js', 'blah'])
    child.on('close', () => {
      let allThere = false
      const exists1 = fs.existsSync('blah')
      const exists2 = fs.existsSync('blah/.gitignore')
      const exists3 = fs.existsSync('blah/app.js')
      const exists4 = fs.existsSync('blah/mvc')
      allThere = exists1 && exists2 && exists3 && exists4
      fs.removeSync('blah')
      assert.strictEqual(allThere, true)
      done()
    })
  })
})
