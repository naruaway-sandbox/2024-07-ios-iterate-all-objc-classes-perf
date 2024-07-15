import dataRaw from "../scripts/data.json";
import type { Data } from "../scripts/lib/data.js";
import * as d3 from "d3-array";

const data = dataRaw as Data;

export const App = () => {
  const getX = (value: number) => {
    return value * 3;
  };
  return (
    <div className="p-5">
      {(["without-init", "with-init"] as const).map((variant) => {
        const items = data[variant];
        const median = d3.median(
          items.map((x) => x.staticRuntimeInitializationFinished),
        )!;
        return (
          <div key={variant}>
            <div>
              {variant}: median: {median.toFixed(0)} ms, ({items.length} data
              points)
            </div>
            <div className="m-3 h-[40px] w-[600px] relative border border-[rgba(0,0,0,0.4)]">
              {items.map((item, i) => (
                <div
                  key={i}
                  className="absolute top-[15px] h-[calc(100%-30px)]"
                  onClick={() => {
                    console.log(item);
                  }}
                  style={{
                    left: getX(item.staticRuntimeInitializationFinished),
                    borderLeft: "1px solid rgba(0, 0, 0, 0.1)",
                  }}
                />
              ))}
              <div
                className="absolute top-0 bottom-0 h-full"
                style={{
                  left: getX(median),
                  borderLeft: "1px solid rgba(0, 0, 0, 0.9)",
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
