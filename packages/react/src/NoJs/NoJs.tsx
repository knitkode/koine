export type NoJsProps = object;

export const NoJs = (_props: NoJsProps) => {
  return (
    <script
      id="no-js"
      dangerouslySetInnerHTML={{
        __html: `document.querySelector("html").className=document.querySelector("html").className.replace(/no-js/,"") + "js";`,
      }}
    ></script>
  );
};
