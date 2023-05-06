import {
  resolve,
  rollup,
  nodeResolve,
  commonjs,
  typescript,
  esbuild,
  parseJson,
  readFileSync,
} from '../utils'

import { hooksRoot } from '../utils/paths'

const pkgPath = resolve(hooksRoot, 'package.json')
const pkg = parseJson(readFileSync(pkgPath, 'utf-8'))

export const buildHooks = async () => {
  const bundle = await rollup({
    input: `${hooksRoot}/index.ts`,
    plugins: [
      nodeResolve({
        modulePaths: [resolve(hooksRoot, 'node_modules')],
      }),
      commonjs(),
      esbuild({
        sourceMap: true,
        target: 'ESNext',
      }),
      typescript({ tsconfig: `${hooksRoot}/tsconfig.json` }),
    ],
    external: [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.devDependencies || {})],
    watch: {
      exclude: ['./node_modules/**', './dist/**'],
    },
  })
  bundle.write({
    format: 'esm',
    dir: resolve(hooksRoot, 'dist'),
    preserveModules: true,
    sourcemap: true,
  })
}
