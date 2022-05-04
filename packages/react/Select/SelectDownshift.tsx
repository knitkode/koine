import type { Option } from "../types.js";

// TODO: remove, just use mui version...
export type SelectProps = {
  options?: Option[];
};
export const Select = null;

// import { useSelect } from "downshift";

// export type SelectProps = {
//   options?: Option[];
// };

// export const Select = ({ options = [] }: SelectProps) => {
//   const {
//     isOpen,
//     selectedItem,
//     getToggleButtonProps,
//     getLabelProps,
//     getMenuProps,
//     highlightedIndex,
//     getItemProps,
//   } = useSelect({ items: options });
//   return (
//     <div>
//       <label {...getLabelProps()}>Choose an element:</label>
//       <button type="button" {...getToggleButtonProps()}>
//         {selectedItem || "Elements"}
//       </button>
//       <ul {...getMenuProps()}>
//         {isOpen &&
//           options.map((item, index) => (
//             <li
//               style={
//                 highlightedIndex === index ? { backgroundColor: "#bde4ff" } : {}
//               }
//               key={`${item.value}${index}`}
//               {...getItemProps({ item, index })}
//             >
//               {item.label}
//             </li>
//           ))}
//       </ul>
//     </div>
//   );
// };
