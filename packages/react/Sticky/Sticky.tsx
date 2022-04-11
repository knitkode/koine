export type StickyProps = {};

export const Sticky = null;

// import {
//   FC,
//   Ref,
//   CSSProperties,
//   useState,
//   useCallback,
//   useEffect,
//   useRef,
// } from "react";

// /**
//  * Get current coordinates `left` and `top` of specific element.
//  */
// const offsetRelative = (element: HTMLElement) => {
//   var result = { l: 0, t: 0 };

//   do {
//     let offsetTop = element.offsetTop;
//     let offsetLeft = element.offsetLeft;

//     if (!isNaN(offsetTop)) result.t += offsetTop;

//     if (!isNaN(offsetLeft)) result.l += offsetLeft;

//     // @ts-expect-error just rething everyhting in this file
//     element =
//       "BODY" === element.tagName ? element.parentElement : element.offsetParent;
//   } while (element);

//   return result;
// };

// export type StickyElementProps = {
//   ref: Ref<HTMLDivElement>;
//   sticky?: boolean;
//   style: CSSProperties;
// };

// /**
//  * - `0`: "STATIC": Static position as nothing happened
//  * - `1`: "VIEWPORT-TOP": Sticked to the top screen edge
//  * - `2`: "VIEWPORT-BOTTOM": Sticked to the bottom screen edge
//  * - `4`: "VIEWPORT-UNBOTTOM": ? Scrolling in the middle of the element, neither sticked nor static
//  * - `3`: "CONTAINER-BOTTOM": ?
//  */
// export type StickyStatus = 0 | 1 | 2 | 3;

// type DimensionsBasic = [
//   /** containerTop */
//   number,
//   /** containerHeight */
//   number,
//   /** containerBottom */
//   number,
//   /** elementHeight */
//   number,
//   /** elementWidth */
//   number,
//   /** viewportHeight */
//   number,
//   /** maxTranslateY */
//   number
// ];

// type DimensionsOnScroll = [
//   /** elementLeft */
//   number,
//   /** viewportTop */
//   number,
//   /** viewportBottom */
//   number,
//   /** viewportLeft */
//   number,
//   /** topSpacing */
//   number,
//   /** bottomSpacing */
//   number
//   /** translateY */
//   // number,
//   /** lastTopSpacing */
//   // number,
//   /** lastBottomSpacing */
//   // number,
//   /** lastViewportTop */
//   // number,
// ];

// type Dimensions = DimensionsBasic & DimensionsOnScroll;

// const getDimensionsBasic = (container: HTMLElement, inner: HTMLElement) => {
//   const containerTop = offsetRelative(container).t;
//   const containerHeight = container.clientHeight;
//   const containerBottom = containerTop + containerHeight;
//   const elementHeight = inner.offsetHeight;
//   const elementWidth = inner.offsetWidth;
//   const viewportHeight = window.innerHeight;
//   const maxTranslateY = containerHeight - elementHeight;

//   return [
//     containerTop,
//     containerHeight,
//     containerBottom,
//     elementHeight,
//     elementWidth,
//     viewportHeight,
//     maxTranslateY,
//   ] as DimensionsBasic;
// };

// const getDimensionsOnScroll = (
//   wrapper: HTMLElement,
//   container: HTMLElement,
//   inner: HTMLElement
// ) => {
//   const elementLeft = offsetRelative(wrapper).l;
//   const viewportTop =
//     document.documentElement.scrollTop || document.body.scrollTop;
//   const viewportBottom = viewportTop + window.innerHeight;
//   const viewportLeft =
//     document.documentElement.scrollLeft || document.body.scrollLeft;
//   const topSpacing = 0; // TODO: make it a prop?
//   const bottomSpacing = 0; // TODO: make it a prop?
//   // const lastTopSpacing = topSpacing;
//   // const lastBottomSpacing = bottomSpacing;

//   return [
//     elementLeft,
//     viewportTop,
//     viewportBottom,
//     viewportLeft,
//     topSpacing,
//     bottomSpacing,
//   ] as DimensionsOnScroll;
// };

// // const getTranslateYonScroll = (dimensions: DimensionsOnScroll, status: StickyStatus) => {
// //   if (status === 1) {
// //     // Adjust translate Y in the case decrease top spacing value.
// //     if (dimensions[5] < dims.lastTopSpacing) {
// //       dims.translateY += dims.lastTopSpacing - dims.topSpacing;
// //       this._reStyle = true;
// //     }
// //   } else if (status === 2) {
// //     // Adjust translate Y in the case decrease bottom spacing value.
// //     if (dims.bottomSpacing < dims.lastBottomSpacing) {
// //       dims.translateY += dims.lastBottomSpacing - dims.bottomSpacing;
// //       this._reStyle = true;
// //     }
// //   }
// // }

// export type StickyProps = {
//   /** @default "div" */
//   Wrapper?: FC<StickyElementProps>;
//   /** @default "div" */
//   Inner?: FC<StickyElementProps>;
//   top: number;
// };

// export const Sticky: FC<StickyProps> = ({
//   Wrapper = "div",
//   Inner = "div",
//   children,
//   top,
//   ...props
// }) => {
//   const [sticky, setSticky] = useState(false);
//   const [shouldRestyle, setShouldRestyle] = useState<boolean>();
//   const stickyStatus = useRef<StickyStatus>(0);
//   const [dimensionsBasic, setDimensionsBasic] = useState<DimensionsBasic>();
//   const [dimensionsOnScroll, setDimensionsOnScroll] =
//     useState<DimensionsOnScroll>();
//   const [translateY, setTranslateY] = useState<number>(0);
//   const [styleWrapper, setStyleWrapper] = useState({});
//   const [styleInner, setStyleInner] = useState({});
//   const [innerWidth, setInnerWidth] = useState<string>();
//   const wrapperRef = useRef<HTMLDivElement>(null);
//   const innerRef = useRef<HTMLDivElement>(null);

//   const handleScroll = useCallback(() => {
//     const wrapper = wrapperRef?.current;
//     const container = wrapper?.parentElement || null;
//     const inner = innerRef?.current;
//     if (wrapper && inner && container) {
//       const dimensions = getDimensionsOnScroll(wrapper, container, inner);
//       setDimensionsOnScroll(dimensions);
//     }
//   }, []);

//   const handleResize = useCallback(() => {
//     const container = wrapperRef?.current?.parentElement || null;
//     const inner = innerRef?.current;
//     if (inner && container) {
//       setDimensionsBasic(getDimensionsBasic(container, inner));
//       // if (innerRef?.current) {
//       //   setInnerWidth(window.getComputedStyle(innerRef.current).width);
//       // }
//       // setSticky(wrapperRef.current.getBoundingClientRect().top <= top);
//     }
//   }, []);

//   useEffect(() => {
//     const container = wrapperRef?.current?.parentElement || null;
//     const inner = innerRef?.current;
//     if (inner && container) {
//       setDimensionsBasic(getDimensionsBasic(container, inner));
//     }

//     window.addEventListener("scroll", handleScroll, { passive: true });
//     window.addEventListener("resize", handleResize, { passive: true });
//     return () => {
//       window.removeEventListener("scroll", () => handleScroll);
//       window.removeEventListener("resize", () => handleResize);
//     };
//   }, [wrapperRef, innerRef, handleScroll, handleResize]);

//   // useEffect(() => {
//   //   if (sticky) {
//   //     setStyleInner({
//   //       position: "fixed",
//   //       zIndex: 1,
//   //       top,
//   //       width: innerWidth,
//   //     });
//   //   } else {
//   //     setStyleInner({});
//   //   }
//   // }, [sticky, top, innerWidth]);

//   return (
//     <Wrapper
//       ref={wrapperRef}
//       sticky={Wrapper === "div" ? undefined : sticky}
//       style={{
//         position: "relative",
//       }}
//     >
//       <Inner ref={innerRef} style={styleInner}>
//         {children}
//       </Inner>
//     </Wrapper>
//   );
// };
