// import type { I18n } from "../types";
import { type GetDataOptions, getData } from "./getData";
import type { I18nCodegen } from "./types";
import { type WriteSourceOptions, writeSource } from "./writeSource";
import { type WriteSummaryOptions, writeSummary } from "./writeSummary";

type SharedOptions = Pick<
  I18nCodegen.Config,
  "defaultLocale" | "hideDefaultLocaleInUrl"
> &
  GetDataOptions;

type WithOptionalSharedOptions<T extends { [key: string]: any }> = Partial<
  Pick<T, keyof SharedOptions>
> &
  Omit<T, keyof SharedOptions>;

export let write = async (
  options: SharedOptions & {
    source: WithOptionalSharedOptions<WriteSourceOptions>;
    summary: WithOptionalSharedOptions<WriteSummaryOptions>;
  },
) => {
  const data = await getData({ ...options, ignore: [options.source.output] });

  await Promise.all([
    writeSource({ ...options, ...data, ...options.source }),
    writeSummary({ ...options, ...data, ...options.summary }),
  ]);

  return data;
};
