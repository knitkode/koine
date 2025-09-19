# Translations action

## Usage

in `<repo-root>/.github/workflows/i18n.yml`:

```yml
name: i18n

on:
  push:
    # branches-ignore:    
    #   - staging
    #   - production

# uncomment this if your repo is private
# permissions: write-all

jobs:
  i18n:
    runs-on: ubuntu-latest
    steps:
      - uses: knitkode/koine/actions/i18n@main
```

## Inspiration

- [`stefanzweifel/git-auto-commit-action`](https://github.com/stefanzweifel/git-auto-commit-action)
- [`4till2/generate-content-map-action`](https://github.com/4till2/generate-content-map-action)
- example of composite github action with auto-commit [`Alfresco/alfresco-build-tools`](https://github.com/Alfresco/alfresco-build-tools/blob/master/.github/actions/pre-commit/action.yml)
