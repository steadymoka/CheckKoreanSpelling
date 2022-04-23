const { format } = require('date-fns')
const esbuild = require('esbuild')
const { nodeExternalsPlugin } = require('esbuild-node-externals')
const glob = require('fast-glob')
const path = require('path')
const rimraf = require('rimraf')

const cwd = path.resolve(__dirname, '..')

async function build() {
  await new Promise((resolve) => rimraf('./dist-server', { cwd }, resolve))
  const files = await glob('server/**/*.{js,jsx,ts,tsx}', { cwd })
  await esbuild.build({
    entryPoints: files,
    outdir: 'dist-server',
    bundle: false,
    platform: 'node',
    target: 'node14',
    define: {
      'process.env.BUILD_DATE': JSON.stringify(format(Date.now(), 'yyyyMMddHMS')),
      'process.env.APP_VERSION': JSON.stringify(require('../package.json').version),
    },
    sourcemap: false,
    loader: { '.ts': 'ts' },
    format: 'cjs',
    plugins: [nodeExternalsPlugin()],
  })
  console.log('\n⚡ Esbuild Done! Have a happy Coooooding! ⚡\n')
}

module.exports = {
  build,
}

if (require.main === module) {
  build()
}
