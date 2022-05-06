# Koine

This project was generated using [Nx](https://nx.dev).

## Getting started

```bash
npm i @koine/next
# or
npm i @koine/react
# or
npm i @koine/utils
```

## Dev notes

## Nxplugins used

- [@jscutlery/semver](https://github.com/jscutlery/semver)

### Folder organization

Deep import paths considered as public and safe always need a folder with an `index.ts` file (see e.g. the [`@koine/next/app` folder](./packages/next/app/)). Once bundled these folders will contain an automatically generated `package.json` file that will help bundlers getting the right `cjs`/`esm` version of the file and correctly applying tree shaking.

> Most problems solved by this structure emerged in the `@koine/next` package when using the `app` and `document` wrapper. Without this structure [next.js](https://nextjs.org/) was not compiling the files correctly. Same for all components, the best *tree-shaked* output is obtained with the `esm` as in the current folder organization, inspired by [`@mui` packages](https://github.com/mui/material-ui) build output.

### React components structure

- About the react component object dot notation (e.g. `Dialog.Root`) see [@headless-ui technique](https://github.com/tailwindlabs/headlessui/blob/main/packages/%40headlessui-react/src/components/dialog/dialog.tsx#L550)

- About storybook having problmes to generate docs from props @see:
  - https://github.com/storybookjs/storybook/issues/5073
  - https://github.com/storybookjs/storybook/issues/12292