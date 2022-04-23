const esbuild = require('esbuild')
const { nodeExternalsPlugin } = require('esbuild-node-externals')
const glob = require('fast-glob')
const path = require('path')
const rimraf = require('rimraf')

const cwd = path.resolve(__dirname, '..')

;(async () => {
  await new Promise((resolve) => rimraf('./dist-infra', { cwd }, resolve))
  const files = await glob('infra/**/*.{js,jsx,ts,tsx}', { cwd })
  await esbuild.build({
    entryPoints: files,
    outdir: 'dist-infra',
    bundle: false,
    platform: 'node',
    target: 'node14',
    sourcemap: false,
    loader: { '.ts': 'ts' },
    format: 'cjs',
    plugins: [nodeExternalsPlugin()],
  })
  console.log('⚡ Done')
})()
