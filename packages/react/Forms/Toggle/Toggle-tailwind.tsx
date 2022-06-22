// /**
//  * @file
//  *
//  * About accessibility:
//  * - minimum target size of 44px https://www.w3.org/TR/WCAG21/#target-size
//  *
//  * @see tests on tailwind playground:
//  * - https://play.tailwindcss.com/RVldIcmZa5
//  */
//  import { type FormControlState } from "../FormControl";
//  import { FormControlStatefulElement } from "../FormControlStatefulElement";

//  export type ToggleProps = React.ComponentProps<"span">;

//  export const Toggle = ({ className = "", ...props }: ToggleProps) => {
//    return (
//      <span
//        className={`relative my-0 -mx-1 inline-flex h-8 w-8 items-center justify-center p-1 ${className}`}
//        {...props}
//      />
//    );
//  };

//  export type ToggleLabelProps = React.ComponentProps<"span">;

//  export const ToggleLabel = ({ className = "", ...props }: ToggleLabelProps) => {
//    return (
//      <span
//        className={`text-grey-200 ml-3 select-none ${className}`}
//        {...props}
//      />
//    );
//  };

//  export type ToggleLabelSubProps = React.ComponentProps<"small">;

//  export const ToggleLabelSub = ({
//    className = "",
//    ...props
//  }: ToggleLabelSubProps) => {
//    return (
//      <span
//        className={`text-xs opacity-70 ${className}`}
//        {...props}
//      />
//    );
//  };

//  export type ToggleIndicatorProps = FormControlState & {
//    className?: string;
//  };

//  export const ToggleIndicator = ({
//    className,
//    ...props
//  }: ToggleIndicatorProps) => {
//    return (
//      <FormControlStatefulElement
//        as="span"
//        className={`relative flex h-[24px] w-[24px] rounded-md border border-solid ${className}`}
//        {...props}
//      />
//    );
//  };

//  export type ToggleIndicatorFgProps = React.ComponentProps<"svg">;

//  export const ToggleIndicatorFg = ({
//    className = "",
//    ...props
//  }: ToggleIndicatorFgProps) => {
//    return (
//      <svg
//        className={`on-toggle-checked:scale-100 absolute left-0 h-full w-full scale-0 transition-transform ${className}`}
//        {...props}
//      />
//    );
//  };

//  export type ToggleIndicatorSquaredProps = ToggleIndicatorProps;

//  export const ToggleIndicatorSquared = (props: ToggleIndicatorSquaredProps) => {
//    return (
//      <ToggleIndicator {...props}>
//        <ToggleIndicatorFg viewBox="0 0 24 24">
//          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
//        </ToggleIndicatorFg>
//      </ToggleIndicator>
//    );
//  };

//  export type ToggleIndicatorRoundedProps = ToggleIndicatorProps & {
//    /** @default 6 */
//    r?: number;
//  };

//  export const ToggleIndicatorRounded = ({
//    r = 6,
//    ...props
//  }: ToggleIndicatorRoundedProps) => {
//    return (
//      <ToggleIndicator {...props}>
//        <ToggleIndicatorFg viewBox="0 0 24 24">
//          <circle
//            r={r}
//            cx="12"
//            cy="12"
//          />
//        </ToggleIndicatorFg>
//      </ToggleIndicator>
//    );
//  };
