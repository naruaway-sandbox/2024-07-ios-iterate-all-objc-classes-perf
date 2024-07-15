import { XMLParser } from "fast-xml-parser";
import assert from "node:assert";
import { $ } from "./util.js";
const xp = new XMLParser();
import * as z from "zod";
import * as fs from "node:fs/promises";
import * as fsSync from "node:fs";
import { setTimeout as sleep } from "node:timers/promises";

declare module "node:fs/promises" {
  const glob: (pathWithGlob: string) => AsyncIterable<string>;
}

const withRetry = async <T>(fn: () => Promise<T>): Promise<T> => {
  let err: unknown;
  for (let i = 0; i < 5; ++i) {
    try {
      return await fn();
    } catch (e) {
      err = e;
      console.warn(`Retrying due to ${e}`);
      await sleep(5000);
    }
  }
  throw new Error("after retries, it still fails", { cause: err });
};

const parseXctraceToXml = async (tracePath: string): Promise<string> => {
  return await withRetry(async () => {
    if (
      !(
        fsSync.existsSync(tracePath + ".xml") &&
        (await fs.readFile(tracePath + ".xml", "utf8")).includes(
          "Static Runtime Initialization",
        )
      )
    ) {
      await $`xcrun xctrace export --xpath ${'/trace-toc/run[@number="1"]/data/table[@schema="life-cycle-period"]'} --input ${tracePath} --output ${tracePath}.xml`;
    }
    const xmlContents = await fs.readFile(`${tracePath}.xml`, "utf8");
    if (!xmlContents.includes("Static Runtime Initialization")) {
      throw new Error(`Generated XML seems to be broken: ${xmlContents}`);
    }
    return xmlContents;
  });
};

const singleton = <T>(xs: T[]): T => {
  assert(xs.length === 1);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return xs[0]!;
};

const parseXmlToGetDurationMs = (xmlContents: string): number => {
  const stages = z
    .strictObject({
      startTime: z.number(),
      duration: z.number(),
      name: z.string(),
    })
    .array()
    .parse(
      xp.parse(xmlContents)["trace-query-result"].node.row.map((item: any) => ({
        startTime: item["start-time"],
        duration: item.duration,
        name: item["app-period"],
      })),
      /* eslint-enable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-explicit-any */
    );

  const staticRuntimeInitialization = singleton(
    stages.filter(
      (x) => x.name === "Initializing - Static Runtime Initialization",
    ),
  );

  const durationMs =
    (staticRuntimeInitialization.startTime +
      staticRuntimeInitialization.duration) /
    10 ** 6;

  return durationMs;
};

export const getData = async () => {
  const variants = ["with-init", "without-init"] as const;
  const result: Record<
    (typeof variants)[number],
    { traceFileName: string; staticRuntimeInitializationFinished: number }[]
  > = { "with-init": [], "without-init": [] };
  for (const variant of variants) {
    for await (const entry of fs.glob(`traces/${variant}/*.trace`)) {
      const staticRuntimeInitializationFinished = parseXmlToGetDurationMs(
        await parseXctraceToXml(entry),
      );
      result[variant].push({
        traceFileName: entry,
        staticRuntimeInitializationFinished,
      });
    }
  }
  return result;
};

export type Data = Awaited<ReturnType<typeof getData>>;
