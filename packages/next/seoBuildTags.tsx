import React from "react";
import { isArray } from "@koine/utils";
import type { SeoProps } from "./Seo";
import type { SeoDefaultsProps } from "./SeoDefaults";

type BuildTagsParams = SeoProps & SeoDefaultsProps;

/** <meta key={key} name={key} content={value} /> */
type MetaNames = Record<string, string>;

/** <meta key={key} property={key} content={value} /> */
type MetaProperties = Record<string, string>;

const defaults = {
  tplTitle: "",
};

/**
 * Comparing to `next-seo` we do a couple of things in addition while many
 * others are removed.
 *
 * - Add `seo` meta object coming from a CMS probably
 * - Add `ogimage` and `openGraph.image` as single image source
 * - Add `og` alias to define `openGraph`
 * - Add check for `title` equal to `templateTitle` to avoid meta titles like
 *   "My site | My site" often happening in homepages
 * - Remove the open graph videos and images
 *
 * - Shorter code
 *
 * @returns
 */
export const seoBuildTags = ({
  seo,
  hidden,
  keywords,
  title = "",
  titleTemplate,
  defaultTitle,
  noindex,
  nofollow,
  description,
  languageAlternates = [],
  twitter,
  facebook,
  openGraph,
  og: ogAlias,
  canonical,
  metaTags,
  linkTags,
}: BuildTagsParams = {}) => {
  const render: React.ReactNode[] = [];
  const $names: MetaNames = {};
  const $properties: MetaProperties = {};

  if (titleTemplate) {
    defaults.tplTitle = titleTemplate;
  }

  title = title || seo?.title || "";

  if (title) {
    if (defaults.tplTitle && defaults.tplTitle !== title) {
      title = defaults.tplTitle.replace(/%s/g, title);
    }
  } else if (defaultTitle) {
    title = defaultTitle;
  }

  if (title) {
    render.push(<title key="title">{title}</title>);
    $properties["og:title"] = title; // overridden later...
  }

  $names["robots"] = `${noindex || hidden ? "noindex" : "index"},${
    nofollow || hidden ? "nofollow" : "follow"
  }`;

  description = description || seo?.description;
  if (description) {
    $names["description"] = description;
    $properties["og:description"] = description; // overridden later...
  }

  keywords = keywords || seo?.keywords;
  if (keywords) {
    $names["keywords"] = isArray(keywords) ? keywords.join(", ") : keywords;
  }

  if (languageAlternates?.length > 0) {
    languageAlternates.forEach((languageAlternate) => {
      render.push(
        <link
          rel="alternate"
          key={`languageAlternate-${languageAlternate.hrefLang}`}
          hrefLang={languageAlternate.hrefLang}
          href={languageAlternate.href}
        />
      );
    });
  }

  if (canonical) {
    render.push(<link rel="canonical" href={canonical} key="canonical" />);
    $properties["og:url"] = canonical;
  }

  if (facebook?.appId) $properties["fb:app_id"] = facebook.appId;
  if (twitter) {
    if (twitter.cardType) $names["twitter:card"] = twitter.cardType;
    if (twitter.site) $names["twitter:site"] = twitter.site;
    if (twitter.handle) $names["twitter:creator"] = twitter.handle;
  }

  const og = ogAlias || openGraph;
  if (og?.title) $properties["og:title"] = og?.title;
  if (og?.description) $properties["og:description"] = og?.description;
  if (og?.url) $properties["og:url"] = og.url;
  if (og?.type) $properties["og:type"] = og.type.toLowerCase();
  if (og?.locale) $properties["og:locale"] = og.locale;
  if (og?.site_name) $properties["og:site_name"] = og.site_name;

  const ogimage = og?.image || seo?.ogimage;
  if (ogimage) $properties["og:image"] = ogimage;

  Object.keys($names).forEach((key) => {
    render.push(<meta key={key} name={key} content={$names[key]} />);
  });

  Object.keys($properties).forEach((key) => {
    render.push(<meta key={key} property={key} content={$properties[key]} />);
  });

  if (metaTags && metaTags.length > 0) {
    metaTags.forEach((tag) => {
      render.push(
        <meta
          key={`meta:${
            tag.keyOverride ?? tag.name ?? tag.property ?? tag.httpEquiv
          }`}
          {...tag}
        />
      );
    });
  }

  if (linkTags?.length) {
    linkTags.forEach((tag) => {
      render.push(
        <link key={`link${tag.keyOverride ?? tag.href}${tag.rel}`} {...tag} />
      );
    });
  }

  // TODO: alternates and canonical
  // canonical = 'https://www.domain.com/';
  // languageAlternates={[{
  //   hrefLang: 'en',
  //   href: 'https://www.domain.com/en',
  // }]}
  // <link rel="alternate" hreflang="x-default" href="https://www.domain.com/nl/">
  // <link rel="alternate" hreflang="nl" href="https://www.domain.com/nl/">
  // <link rel="alternate" hreflang="en" href="https://www.domain.com/en/">

  return render;
};

export default seoBuildTags;
