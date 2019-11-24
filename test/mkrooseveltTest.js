/* eslint-env mocha */
const assert = require('assert')
const spawn = require('child_process').spawn
const fs = require('fs-extra')

describe('Create Roosevelt app', function () {
  it('should answer name prompt', function (done) {
    const child = spawn('node', ['mkroosevelt.js'])
    child.stdout.on('data', function (data) {
      if (data.includes('What would you like to name your Roosevelt app')) {
        child.stdin.write('\n')
      }
    })
    child.on('close', function () {
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

  it('should not prompt a name when given one at command line', function (done) {
    const child = spawn('node', ['mkroosevelt.js', 'blah'])
    child.on('close', function () {
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
