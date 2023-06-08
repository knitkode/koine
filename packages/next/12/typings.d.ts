/**
 * Next utility types
 */
declare type PageServer<P> = import("next").InferGetServerSidePropsType<P>;
declare type PageStatic<P> = import("next").InferGetStaticPropsType<P>;
declare type DataServer<P, Q, T> = import("next").GetServerSideProps<P, Q, T>;
declare type DataStatic<P, T> = import("next").GetStaticProps<P, T>;
declare type DataStaticPaths<P> = import("next").GetStaticPaths<P>;
declare type DataStaticPathsResult<P> = import("next").GetStaticPathsResult<P>;

/**
 * Extend NodeJS `process.env` with variables used by @koine
 */
declare namespace NodeJS {
  interface ProcessEnv {
    AUTH_ROUTE_LOGIN: string;
    AUTH_ROUTE_PROFILE: string;
    AUTH_ROUTE_REGISTER: string;
    AUTH_ROUTES_SECURED: string;
  }
}
