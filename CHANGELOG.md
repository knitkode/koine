## [1.0.6](https://github.com/knitkode/koine/compare/v1.0.5...v1.0.6) (2022-04-12)

### Bug Fixes

- **setup:** add types as deps to avoid some npm installs ([9aae17e](https://github.com/knitkode/koine/commit/9aae17e6c91fde152f2b6f78a828ced36c173e43))
- **setup:** ci ([9353774](https://github.com/knitkode/koine/commit/93537740451accf34adcd64cf604228135905325))
- **setup:** ci ([244fc26](https://github.com/knitkode/koine/commit/244fc263fc16718ada2bda018e94e009f0fab614))
- **setup:** ci ([f18a424](https://github.com/knitkode/koine/commit/f18a424c2906034bd2d31174f083f13016200de7))
- **setup:** ci ([e84537a](https://github.com/knitkode/koine/commit/e84537a7dd70d251fe8f11d4084574a024977187))
- **setup:** compile and tree shake correctly ([73454e5](https://github.com/knitkode/koine/commit/73454e574438442e7d4aa3d69c17aeebcc53ca75))
- **setup:** husky ([ad2f810](https://github.com/knitkode/koine/commit/ad2f8101a5cecb0ffe8344fd7b49ff410251d365))
- **setup:** remove main/module entries in package jsons as web:rollup automatically update them regardless of whether we want it to output esm or not, we output esm with js:tsc for better tree shaking in fact, follow https://github.com/nrwl/nx/issues/7517 https://github.com/nrwl/nx/issues/9498 ([c82c49c](https://github.com/knitkode/koine/commit/c82c49c3bdcc44d28e8325eb4b4192bf35c87aea))
- **setup:** remove swc configs ([4e1d6cc](https://github.com/knitkode/koine/commit/4e1d6cc8668a56de2302801c5b947f3329ea39f7))
- **setup:** rollup configs, build-clean task is needed or index.js is picked up by bundlers regardless of main module in package.json ([b2ebdad](https://github.com/knitkode/koine/commit/b2ebdada69cdb64f48cc173fbe3f69c9903e5524))
- **setup:** settings back ([2b043b3](https://github.com/knitkode/koine/commit/2b043b34a7f5bc2170acaaeb6b7090e71db7e7ce))
- **setup:** stupid tree shaking and nx rollup, neds duplication ([ace7508](https://github.com/knitkode/koine/commit/ace7508d5b4e34c9ce84fd872ef2476d96424133))
- **setup:** task orchestration and ci fix ([61e46c0](https://github.com/knitkode/koine/commit/61e46c04a3ab54cd867cba907c18e19cfd3cd584))
- **setup:** tree shaking seems to work even if all next in same package ([462cc36](https://github.com/knitkode/koine/commit/462cc3677d0b83451d9170930eb7b68c7b441d35))
- **setup:** trigger ci ([63bbaa5](https://github.com/knitkode/koine/commit/63bbaa5fd4cca5f97ce1559e3b40366d25bdc7d8))
- **setup:** use index.esm.ts file to fool rollup misbehaviour instead of running a mv operation ([0d0df31](https://github.com/knitkode/koine/commit/0d0df310ef8933ff4c718eb0e54f72a09075bd2e))

### Other

- Merge branch 'main' of github.com:knitkode/koine into main ([e2d1bde](https://github.com/knitkode/koine/commit/e2d1bde6ccdf415542acc24b6d895ea548a4510e))

## [1.0.5](https://github.com/knitkode/koine/compare/v1.0.4...v1.0.5) (2022-04-08)

### Bug Fixes

- **setup:** correct rollup and use fragments ([edb8613](https://github.com/knitkode/koine/commit/edb8613c9abce8dea44750caeb6f720b12abddaa))
- **setup:** correct rollup and use fragments ([3da9eaa](https://github.com/knitkode/koine/commit/3da9eaad89eeb92734d7411e1d50c13e9dfd25b7))

### Other

- Merge branch 'main' of github.com:knitkode/koine into main ([47c1a97](https://github.com/knitkode/koine/commit/47c1a97ee78efd7bc20fe1df3c8978745f45d0e3))

## [1.0.4](https://github.com/knitkode/koine/compare/v1.0.3...v1.0.4) (2022-04-08)

### Bug Fixes

- **deps:** update ([e92ac04](https://github.com/knitkode/koine/commit/e92ac040de1c912adbca27c62e878bb3c2480cb0))
- **setup:** wip trigger ([7791c82](https://github.com/knitkode/koine/commit/7791c821d6d062f033aa55abc4160531aff2b1f3))

### Other

- Merge branch 'main' of github.com:knitkode/koine into main ([7ae2062](https://github.com/knitkode/koine/commit/7ae20623919657791066315733e299a8fd4a5ff4))

## [1.0.3](https://github.com/knitkode/koine/compare/v1.0.2...v1.0.3) (2022-04-08)

### Chores

- **setup:** fix deps ([a1489dd](https://github.com/knitkode/koine/commit/a1489ddd125d922406959e499c8636d305668d66))
- **setup:** trigger ci ([4efa526](https://github.com/knitkode/koine/commit/4efa526f276c8d272acc3ea6c047ff4f9384accf))

### Other

- Merge branch 'main' of github.com:knitkode/koine into main ([c106b44](https://github.com/knitkode/koine/commit/c106b44d137de7d7a1b55dfeaa57c18230b3d32c))

## [1.0.2](https://github.com/knitkode/koine/compare/v1.0.1...v1.0.2) (2022-04-08)

### Bug Fixes

- **setup:** deps ([23f7767](https://github.com/knitkode/koine/commit/23f776728656557cee2bd86c74698c3e7d2bf182))
- **setup:** use nx cloud ([2964a1a](https://github.com/knitkode/koine/commit/2964a1a8597d3283a865fa69bd78174fdb3fdb40))

### Chores

- **setup:** fix build for next ([0b68a99](https://github.com/knitkode/koine/commit/0b68a992921ae60a7bd3812edef43500bb5ea32d))

# <<<<<<< HEAD

## [1.0.1](https://github.com/knitkode/koine/compare/v1.0.0...v1.0.1) (2022-04-08)

### Chores

- **setup:** deps ([e9dc480](https://github.com/knitkode/koine/commit/e9dc480a8e984b7e2a1bf08928dfdecfbb438656))
- **setup:** stick to react 17 for now and remove react imports types, use namespace ([deba63f](https://github.com/knitkode/koine/commit/deba63f5acefb15d67f9b8cdd0431da0fe1ad206))
- **setup:** trigger ci ([a5cbe4a](https://github.com/knitkode/koine/commit/a5cbe4a80754463a8d7ac8f42bb8305bd7365500))

### Other

- Merge branch 'main' of github.com:knitkode/koine into main ([08f036a](https://github.com/knitkode/koine/commit/08f036a1386d678603046fc9088b36b651c931a2))

# 1.0.0 (2022-04-07)

### Chores

- **setup:** cz ([b8f3440](https://github.com/knitkode/koine/commit/b8f34405567dc1e7453b2df3bdd86b88ed71225e))
- **setup:** initial commit ([7d6b2f6](https://github.com/knitkode/koine/commit/7d6b2f60481a5a46398f3cdfe6ded1404ded88fa))
- **setup:** nx workspace extend missing on ci ([0b2606d](https://github.com/knitkode/koine/commit/0b2606dd320fc670ffe1996051001e1f706ecce6))
- **setup:** readmes ([95213dd](https://github.com/knitkode/koine/commit/95213dd3c11bf695ff9f1f7c6458a8b85aae7bee))
- **setup:** trigger ci ([21a9816](https://github.com/knitkode/koine/commit/21a9816fda744e10e83407db522f15ed9c559b7a))
- **setup:** vscode settings ([ce11fff](https://github.com/knitkode/koine/commit/ce11fffef2673ea8ab828449a8a6a8d36fa5ca80))

### Other

- nx init ([918301b](https://github.com/knitkode/koine/commit/918301b64cfcd1554e2153a7a0dd708132c49f9d))
- initial commit ([36e775e](https://github.com/knitkode/koine/commit/36e775e6c1ee0245618d3305b640f8d61d30f61e))
  > > > > > > > e775a2877183033d391ba1c503c2ad38927ae6f5
