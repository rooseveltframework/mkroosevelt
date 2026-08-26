const { describe, it, afterEach } = require('node:test')
const assert = require('node:assert')
const { spawn } = require('node:child_process')
const fs = require('node:fs')
const path = require('node:path')

// each test generates into one of these, and the ones left behind by a failed run would make the next run pass for the wrong reason
const generatedDirs = ['my-roosevelt-sample-app', 'blah']

// answers the prompts as they appear, in order, then resolves once the generator has finished
function generate (args, replies = []) {
  return new Promise((resolve, reject) => {
    const child = spawn('node', ['mkroosevelt.js', ...args])
    let remaining = [...replies]

    child.stdout.on('data', data => {
      if (!remaining.length) return
      if (data.toString().includes(remaining[0].when)) {
        const [{ answer }] = remaining
        remaining = remaining.slice(1)
        child.stdin.write(answer)
      }
    })

    child.on('error', reject)
    child.on('close', () => resolve())
  })
}

const nameQuestion = { when: 'What would you like to name your Roosevelt app', answer: '\n' }
const typeQuestion = answer => ({ when: 'Which type of app do you want?', answer })

function assertGenerated (dir, files) {
  for (const file of files) {
    assert.ok(fs.existsSync(path.join(dir, file)), `${path.join(dir, file)} should have been generated`)
  }
}

describe('Create Roosevelt app', () => {
  afterEach(() => {
    for (const dir of generatedDirs) fs.rmSync(dir, { recursive: true, force: true })
  })

  it('should answer prompts and select MPA', async () => {
    await generate([], [nameQuestion, typeQuestion('\n')])

    assertGenerated('my-roosevelt-sample-app', ['.gitignore', 'app.js', 'mvc'])
  })

  it('should answer prompts and select static site', async () => {
    await generate([], [nameQuestion, typeQuestion('2\n')])

    assertGenerated('my-roosevelt-sample-app', ['statics/pages/index.js'])
  })

  it('should answer prompts and select SPA', async () => {
    await generate([], [nameQuestion, typeQuestion('3\n')])

    assertGenerated('my-roosevelt-sample-app', ['mvc/models/getRandomNumber.js'])
  })

  it('should not prompt when given a directory name at the command line', async () => {
    await generate(['blah'])

    assertGenerated('blah', ['.gitignore', 'app.js', 'mvc'])
  })
})
