import { $ } from "./lib/util.js";

const buildApp = async (variant: "with-init" | "without-init") => {
  await $`xcodebuild ${[
    ["-project", "DemoApp/DemoApp.xcodeproj"],
    ["-scheme", "DemoApp"],
    ["-configuration", "Release"],
    ["-derivedDataPath", `./derived-data/${variant}`],
    ["-destination", "generic/platform=ios"],
    "-allowProvisioningUpdates",
    variant === "with-init"
      ? [
          "OTHER_CFLAGS=$(inherited) -DExecuteSomethingBeforeMainIterateAllObjcClasses",
        ]
      : [],
  ].flat()}`;
};

await buildApp("with-init");
await buildApp("without-init");
