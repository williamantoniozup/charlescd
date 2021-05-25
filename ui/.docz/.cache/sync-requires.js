

// prefer default export if available
const preferDefault = m => (m && m.default) || m


exports.components = {
  "component---cache-dev-404-page-js": (preferDefault(require("/Users/leandroqueiroz/zup/charlescd/ui/.docz/.cache/dev-404-page.js"))),
  "component---readme-md": (preferDefault(require("/Users/leandroqueiroz/zup/charlescd/ui/README.md"))),
  "component---src-docz-text-mdx": (preferDefault(require("/Users/leandroqueiroz/zup/charlescd/ui/src/docz/Text.mdx"))),
  "component---src-pages-404-js": (preferDefault(require("/Users/leandroqueiroz/zup/charlescd/ui/.docz/src/pages/404.js")))
}

