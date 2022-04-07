// import styled, { keyframes } from "styled-components";
// import { m } from "framer-motion";

export type GaugeProps = {
  /** In percentage */
  value: number;
};

export const Gauge = (_props: GaugeProps) => null;

// export type GaugeProps = {
//   /** In percentage */
//   value: number;
// };

// export const Gauge = ({
//   value,
//   counter = true,
//   stroke,
//   // emptyStroke = "#e2e2e2",
//   emptyStroke = stroke,
//   emptyStrokeOpacity = 0.25,
//   // emptyStrokeOpacity = 1,
//   duration = 3,
//   delay = 0.5,
//   size = 100,
//   strokeWidth = 6,
// }) => {
//   const radius = 45;
//   const circumference = Math.ceil(2 * Math.PI * radius);
//   const fillPercents = Math.abs(
//     Math.ceil((circumference / 100) * (value - 100))
//   );

//   const transition = {
//     duration: duration,
//     delay: delay,
//     ease: "easeIn",
//   };

//   const variants = {
//     hidden: {
//       strokeDashoffset: circumference,
//       transition,
//     },
//     show: {
//       strokeDashoffset: fillPercents,
//       transition,
//     },
//   };

//   return (
//     <>
//       <Flex justifyContent="center" alignItems="center">
//         {counter && (
//           <Box
//             position="absolute"
//             fontSize={size >= 100 ? 6 : 3}
//             fontWeight={2}
//             color="text500"
//           >
//             <Counter valueTo={value} totalDuration={duration + delay} />%
//           </Box>
//         )}
//         <Box height={size}>
//           <svg
//             viewBox="0 0 100 100"
//             version="1.1"
//             xmlns="http://www.w3.org/2000/svg"
//             width={size}
//             height={size}
//           >
//             <circle
//               cx="50"
//               cy="50"
//               r={radius}
//               className="circle"
//               strokeWidth={strokeWidth}
//               stroke={emptyStroke}
//               strokeOpacity={emptyStrokeOpacity}
//               fill="transparent"
//             />
//           </svg>
//           <svg
//             viewBox="0 0 100 100"
//             width={size}
//             height={size}
//             style={{
//               position: "absolute",
//               transform: "rotate(-90deg)",
//               overflow: "visible",
//               marginLeft: -size,
//             }}
//           >
//             <m.circle
//               cx="50"
//               cy="50"
//               r={radius}
//               strokeWidth={strokeWidth}
//               stroke={stroke}
//               fill="transparent"
//               strokeDashoffset={fillPercents}
//               strokeDasharray={circumference}
//               variants={variants}
//               initial="hidden"
//               animate={"show"}
//             />
//           </svg>
//         </Box>
//       </Flex>
//     </>
//   );
// };
