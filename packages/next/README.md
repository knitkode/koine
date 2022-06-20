# @koine/next

## i18n

To make typescript work nicely with `useT`, `getT` and `T` make sure to enable [`resolveJsonModule`](https://www.typescriptlang.org/tsconfig#resolveJsonModule) in your `tsconfig.json` file:

```json
{
  "compilerOptions": {
    "resolveJsonModule": true,
  }
}
```
