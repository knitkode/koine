# @koine/i18n

## Features

## Co-locate multiple internationalised projects within the same monorepo

The compiled output allows to easily manage multile applications and their translations independently within the same monorepo.

**Further reading**

This was achieved preferring types compilation (the `I18n` namespace) rather than relying on [module augmentation](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation) where interface merging of possibly exported shared types from `@koine/i18n` could have achieved the same (see [`i18next` approach](https://www.i18next.com/overview/typescript#create-a-declaration-file)). That in fact would have not allow types to be scoped to the specific i18n compiled project, especially important within a monorepo. It was taken into consideration even a class based approach possibly achieved by something like this:

```ts
// in `@koine/i18n/types.ts`:
export class I18nClass<Locales extends {}, ...all other configurable interfaces as generics> {
  public Locale: keyof Locales;

  constructor(locales: Locales) {
    this.Locale = Object.keys(locales)[0] as keyof Locales;
  }
}

// somewhere in the project using @koine/i18n
import { I18n } from "@/i18n";

const myLocale: I18n["Locale"] = "";

```
This was discarded for a better _dx_ as using `I18n["Locale"]` is not as nice as using the namespace form of this `I18n.Locale`.
For a better _dx_ it was also decided not to export any `I18n` namespace from `@koine/i18n` to avoid amibguity in the IDE autocomplete feature as the same namespace is always exported from the compiled output.
