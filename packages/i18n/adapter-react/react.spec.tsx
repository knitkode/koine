// import { screen } from "@testing-library/dom";
// import "@testing-library/jest-dom";
// import { render } from "@testing-library/react";
// import ReactDOMServer from "react-dom/server";

// // import RSC from "../__mocks__/single-language/.code"

describe("Server Side rendering", () => {
  it("should SSR", () => {
    expect("TODO:").toBe("TODO:");
  });
});

// describe("Server Side rendering", () => {
//   it("should SSR", () => {
//     const ui = <div data-testid="rsc">Test</div>;
//     const container = document.createElement("div");
//     document.body.appendChild(container);
//     container.innerHTML = ReactDOMServer.renderToString(ui);

//     // Hydrate the React Component and DOM node rendered on the server-side.
//     render(ui, { hydrate: true, container });
//     expect(screen.getByTestId("rsc")).toHaveTextContent("Test");
//   });
// });
