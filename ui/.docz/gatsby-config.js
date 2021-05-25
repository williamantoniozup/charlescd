const { mergeWith } = require('docz-utils')
const fs = require('fs-extra')

let custom = {}
const hasGatsbyConfig = fs.existsSync('./gatsby-config.custom.js')

if (hasGatsbyConfig) {
  try {
    custom = require('./gatsby-config.custom')
  } catch (err) {
    console.error(
      `Failed to load your gatsby-config.js file : `,
      JSON.stringify(err),
    )
  }
}

const config = {
  pathPrefix: '/',

  siteMetadata: {
    title: 'Ui',
    description:
      'Charles C.D. | Fastest hypothesis validation with Circle Deployment',
  },
  plugins: [
    {
      resolve: 'gatsby-plugin-typescript',
      options: {
        isTSX: true,
        allExtensions: true,
      },
    },
    {
      resolve: 'gatsby-theme-docz',
      options: {
        themeConfig: {},
        src: './',
        gatsbyRoot: null,
        themesDir: 'src',
        mdxExtensions: ['.md', '.mdx'],
        docgenConfig: {},
        menu: [],
        mdPlugins: [],
        hastPlugins: [],
        ignore: [],
        typescript: true,
        ts: false,
        propsParser: true,
        'props-parser': true,
        debug: false,
        native: false,
        openBrowser: null,
        o: null,
        open: null,
        'open-browser': null,
        root: '/Users/leandroqueiroz/zup/charlescd/ui/.docz',
        base: '/',
        source: './',
        'gatsby-root': null,
        files: '**/*.{md,markdown,mdx}',
        public: '/public',
        dest: '.docz/dist',
        d: '.docz/dist',
        editBranch: 'master',
        eb: 'master',
        'edit-branch': 'master',
        config: '',
        title: 'Ui',
        description:
          'Charles C.D. | Fastest hypothesis validation with Circle Deployment',
        host: 'localhost',
        port: 3000,
        p: 3000,
        separator: '-',
        paths: {
          root: '/Users/leandroqueiroz/zup/charlescd/ui',
          templates:
            '/Users/leandroqueiroz/zup/charlescd/ui/node_modules/docz-core/dist/templates',
          docz: '/Users/leandroqueiroz/zup/charlescd/ui/.docz',
          cache: '/Users/leandroqueiroz/zup/charlescd/ui/.docz/.cache',
          app: '/Users/leandroqueiroz/zup/charlescd/ui/.docz/app',
          appPackageJson: '/Users/leandroqueiroz/zup/charlescd/ui/package.json',
          appTsConfig: '/Users/leandroqueiroz/zup/charlescd/ui/tsconfig.json',
          gatsbyConfig:
            '/Users/leandroqueiroz/zup/charlescd/ui/gatsby-config.js',
          gatsbyBrowser:
            '/Users/leandroqueiroz/zup/charlescd/ui/gatsby-browser.js',
          gatsbyNode: '/Users/leandroqueiroz/zup/charlescd/ui/gatsby-node.js',
          gatsbySSR: '/Users/leandroqueiroz/zup/charlescd/ui/gatsby-ssr.js',
          importsJs:
            '/Users/leandroqueiroz/zup/charlescd/ui/.docz/app/imports.js',
          rootJs: '/Users/leandroqueiroz/zup/charlescd/ui/.docz/app/root.jsx',
          indexJs: '/Users/leandroqueiroz/zup/charlescd/ui/.docz/app/index.jsx',
          indexHtml:
            '/Users/leandroqueiroz/zup/charlescd/ui/.docz/app/index.html',
          db: '/Users/leandroqueiroz/zup/charlescd/ui/.docz/app/db.json',
        },
      },
    },
  ],
}

const merge = mergeWith((objValue, srcValue) => {
  if (Array.isArray(objValue)) {
    return objValue.concat(srcValue)
  }
})

module.exports = merge(config, custom)
