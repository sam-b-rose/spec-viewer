const fs = require('fs')
const { execSync } = require('child_process')
const { resolve } = require('path')
const dirTree = require('directory-tree')
const glob = require('glob')
const find = require('lodash/find')
const kebabCase = require('lodash/kebabCase')

const specsPath = resolve(__dirname, '../specs')
const tree = dirTree(specsPath, { exclude: /.DS_Store|README.md/ })

function clean(branch) {
  const isSpec = find(branch.children, ['type', 'file'])
  let cmd = `git rev-list --timestamp HEAD ${branch.path.replace(
    /(\s+)/g,
    '\\$1'
  )}`
  let output = execSync(cmd, { encoding: 'utf8' })
  const epoch = new Date(0)
  const mtime = epoch.setUTCSeconds(
    +output
      .trim()
      .split(' ')
      .shift()
  )
  branch.label = branch.name
  branch.value = kebabCase(branch.name)
  branch.mtime = mtime
  branch.isSpec = isSpec

  if (!isSpec) return branch.children.map(clean)

  delete branch.children
  const relativePath = branch.path.replace(specsPath, 'specs')
  cmd = `git rev-list --count HEAD ${branch.path.replace(/(\s+)/g, '\\$1')}`
  output = execSync(cmd, { encoding: 'utf8' })
  const version = +output.trim()
  const href = encodeURIComponent(relativePath)
  const matches = glob.sync(`${branch.path}/preview/*.png`)
  const preview = matches[0]
    ? `${href}/preview${matches[0].substring(matches[0].lastIndexOf('/'))}`
    : `./images/sketch-measure.png`
  branch.version = version
  branch.href = href
  branch.preview = preview
  return branch
}

clean(tree)
const specs = [
  {
    label: 'All',
    value: 'all',
    children: tree.children,
    isSpec: false
  }
]

fs.writeFileSync(
  resolve(__dirname, './dist/specs.json'),
  JSON.stringify(specs),
  'utf-8'
)
