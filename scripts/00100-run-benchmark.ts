import * as fs from "node:fs/promises";
import { $ } from "./lib/util.js";

if (!process.env["BENCHMARK_TARGET_IOS_DEVICE_UDID"]) {
  throw new Error(
    'Please supply BENCHMARK_TARGET_IOS_DEVICE_UDID environment variable. You can get your own device UDID by running "xcrun xctrace list devices"',
  );
}

const deviceUdid = process.env["BENCHMARK_TARGET_IOS_DEVICE_UDID"];

const installApp = async (params: {
  deviceUdid: string;
  variant: "with-init" | "without-init";
}) => {
  await $`xcrun devicectl device install app --device ${params.deviceUdid} ./derived-data/${params.variant}/Build/Products/Release-iphoneos/DemoApp.app`;
};

const runBenchmark = async (params: {
  deviceUdid: string;
  variant: "with-init" | "without-init";
}) => {
  const outputDir = `traces/${params.variant}`;
  await fs.mkdir(outputDir, { recursive: true });
  await $`xcrun xctrace record --device ${params.deviceUdid} --template ${"App Launch"} --time-limit 1s --launch DemoApp --output ${outputDir}`;
};

const variants = ["with-init", "without-init"] as const;
for (let i = 0; i < 1000; ++i) {
  for (const variant of variants) {
    await installApp({ deviceUdid, variant });
    await runBenchmark({ deviceUdid, variant });
  }
}
