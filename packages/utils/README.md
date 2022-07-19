# @koine/utils

Libraries to encapsulate and re-export from here, the selection is based on:

- [x] full typescript support
- [x] treeshake-ability
- [x] docs in source comments

- [mesqueeb/merge-anything](https://github.com/mesqueeb/merge-anything)
- [mesqueeb/filter-anything](https://github.com/mesqueeb/filter-anything)
- [mesqueeb/case-anything](https://github.com/mesqueeb/case-anything)
- [mesqueeb/nestify-anything](https://github.com/mesqueeb/nestify-anything)
- [mesqueeb/fast-sort (fork)](https://github.com/mesqueeb/fast-sort (fork))
- [mesqueeb/compare-anything](https://github.com/mesqueeb/compare-anything)
- [mesqueeb/copy-anything](https://github.com/mesqueeb/copy-anything)
- [mesqueeb/flatten-anything](https://github.com/mesqueeb/flatten-anything)

About ts utilities types @see:

- [sindresorhus/type-fest](https://github.com/sindresorhus/type-fest)
- [millsp/ts-toolbelt](https://github.com/millsp/ts-toolbelt)
- [ts-essentials](https://github.com/ts-essentials/ts-essentials)

For inspiration look at [1loc.dev](https://1loc.dev).

About utilities useful examples @see:

- [chakra-ui](https://github.com/chakra-ui/chakra-ui/blob/main/packages/utils/src)

TODO: We could also re-exports direct dependencies of packages that we often use
anyway like [those of `yup`](https://github.com/jquense/yup/blob/master/package.json#L103):

- [tiny-case](https://github.com/jquense/tiny-case)
- [property-expr](https://github.com/jquense/expr/blob/master/index.js)
- [toposort](https://github.com/marcelklehr/toposort)

## Code

- Transformative functions like `truncate` or `titleCase` should allow for nullable inputs as much as possible, acceptin both `undefined` and `null`.
