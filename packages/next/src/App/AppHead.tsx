import Head from "next/head";

export type AppHeadProps = unknown;

export const AppHead: React.FC<AppHeadProps> = (props) => {
  return (
    <Head {...props}>
      <meta name="viewport" content="width=device-width" />
    </Head>
  );
};
