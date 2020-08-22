const os = require('os')
const fs = require('fs')
const path = require('path')
const { promisify } = require('util')
const { exec } = require('child_process')

const directory = path.join(os.tmpdir(), 'skarllet-agent-modules')

// Creates a temporary folder to hold the module data
// if it doesn't exists
if (!fs.existsSync(directory))
  fs.mkdirSync(directory)

module.exports = {
  directory,

  install: async module => {
    const packageNameRegex = /(@?\S+\/?\S+)@(\d+\.\d+\.\d+)/g

    const { stdout } = await promisify(exec)(`npm i ${ module }`, { cwd: directory })
    const [ string ] = stdout.match(packageNameRegex)

    console.log(string, stdout)

    return { 
      name: string.substring(0, string.lastIndexOf('@')), 
      version: string.substring(string.lastIndexOf('@') + 1, string.length + 1)
    }
  },

  require: module => require(require.resolve(module, { paths: [ directory ] })),
}