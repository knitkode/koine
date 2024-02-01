// import type { I18n } from "../types";
import { type GetFsDataOptions, getFsData } from "./getFsData";
import type { I18nGenerate } from "./types";
import { type WriteSourceOptions, writeSource } from "./writeSource";
import { type WriteSummaryOptions, writeSummary } from "./writeSummary";

type SharedOptions = Pick<
  I18nGenerate.Config,
  "defaultLocale" | "hideDefaultLocaleInUrl"
> &
  GetFsDataOptions;

type WithOptionalSharedOptions<T extends { [key: string]: any }> = Partial<
  Pick<T, keyof SharedOptions>
> &
  Omit<T, keyof SharedOptions>;

export async function write(
  options: SharedOptions & {
    source: WithOptionalSharedOptions<WriteSourceOptions>;
    summary: WithOptionalSharedOptions<WriteSummaryOptions>;
  },
) {
  const data = await getFsData({ ...options, ignore: [options.source.output] });

  await Promise.all([
    writeSource({ ...options, ...data, ...options.source }),
    writeSummary({ ...options, ...data, ...options.summary }),
  ]);

  return data;
}
