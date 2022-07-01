# Localization

> Notes for translators

## File structure

Each folder represent a sort of encapsulated part of the project, this is mainly for internal development organization.

File names follow this **convention**:

- `~`: for app wide **urls** translated definitions
- `_`: for app wide **common** translations
- `${data}`: dollar prefix for static **data** like arrays, objects, .etc
- `{route-name}`: lower cased for **route/page** specific data
- `{ComponentName}`: pascal cased for **components** specific data

## Interpolation

- Interpolated `string` values are surrounded by `{{ }}`, move them but not delete them.
- Interpolated `HTML` values are written as `<some-name>This is a translation</some-name>`, move them but not delete them.
