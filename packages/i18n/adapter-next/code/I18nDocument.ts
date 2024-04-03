/**
 * @see https://nextjs.org/docs/pages/building-your-application/routing/custom-document
 * @see https://gist.github.com/marteinn/00b96acf83047d8521a14d52cc276b77
 */
import type { I18nCompiler } from "../../compiler/types";

export default ({}: I18nCompiler.AdapterArg<"next">) => `
import NextDocument, {
  type DocumentContext,
  type DocumentInitialProps,
  Head,
  Html,
  Main,
  NextScript,
} from "next/document";
import { defaultLocale } from "./defaultLocale";
import type { I18n } from "./types";

type I18nDocumentInitialProps = DocumentInitialProps & I18nDocumentProps;

type I18nDocumentContextProp = {
  pageProps?: { i18n?: { locale?: I18n.Locale } };
};

export type I18nDocumentProps = {
  htmlProps: {
    lang: string;
    dir?: string;
  };
};

/**
 * To use in \`_document.tsx\` file extending your component
 * 
 * **For Pages Router only**
 */
export class I18nDocument extends NextDocument<I18nDocumentProps> {
  static override async getInitialProps(
    ctx: DocumentContext,
  ): Promise<I18nDocumentInitialProps> {
    let lang = defaultLocale;
    const originalRenderPage = ctx.renderPage;

    ctx.renderPage = () =>
      originalRenderPage({
        enhanceApp: (App) => (_props) => {
          const props = _props as unknown as I18nDocumentContextProp;
          try {
            lang = props?.pageProps?.i18n?.locale || defaultLocale;
          } catch (e) {
            // fallback to defaultLocale;
          }
          return <App {..._props} />;
        },
        enhanceComponent: (Component) => Component,
      });

    const initialProps = await NextDocument.getInitialProps(ctx);

    return { ...initialProps, htmlProps: { lang } };
  }

  override render() {
    const { htmlProps } = this.props;

    return (
      <Html {...htmlProps}>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default I18nDocument;
`;
