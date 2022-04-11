import { forwardRef } from "react";

export type TypeStairsProps = {
  children: string;
  limit?: number;
};

export const TypeStairs = forwardRef(
  ({ children, limit }: TypeStairsProps, ref) => {
    // split in rows or just use one row if there is no limit
    const rows = limit ? splitTextIntoRows(children, limit) : [children];

    return rows.length > 1 ? (
      <>
        {rows.map((row, rowIndex) => {
          return (
            <span key={`row-${rowIndex}`}>
              {renderRow(row, rowIndex, ref)}
              {rowIndex !== rows.length - 1 && <br />}
            </span>
          );
        })}
      </>
    ) : (
      renderRow(rows[0], 0, ref)
    );
  }
);

/**
 * every number chars find a space and break, then restart the gradient weight
 * @see https://stackoverflow.com/a/25770787
 */
function splitTextIntoRows(input = "", limit = 18) {
  const rows = [];
  const arr = input.split(" ");
  let currow = arr[0];
  let rowlen = currow.length;
  for (let i = 1; i < arr.length; i++) {
    const word = arr[i];
    rowlen += word.length + 1;
    if (rowlen <= limit) {
      currow += " " + word;
    } else {
      rows.push(currow);
      currow = word;
      rowlen = word.length;
    }
  }
  rows.push(currow);
  return rows;
}

function renderRow(
  row: string,
  rowIndex: number,
  ref: React.ForwardedRef<any>
) {
  const letters = row.split("");
  let fontWeightIdx = 1;
  // const fontWeight = Math.min(fontWeightIdx * 100, 800);

  return (
    <>
      {letters.map((letter, letterIndex) => {
        const fontWeight = Math.min(fontWeightIdx * 100, 800);
        // don't waste a fontWeight for a white space
        if (letter !== " ") {
          fontWeightIdx++;
        }

        return (
          <span
            key={`letter-${rowIndex}-${letterIndex}`}
            style={{ fontWeight }}
            ref={ref}
          >
            {letter}
          </span>
        );
      })}
    </>
  );
}
