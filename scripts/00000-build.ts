import { $ } from "./lib/util.js";

await $`xcodebuild -project DemoApp/DemoApp.xcodeproj -scheme DemoApp -configuration Release -derivedDataPath ./derived-data/with-init -destination generic/platform=ios ${"OTHER_CFLAGS=$(inherited) -DExecuteSomethingBeforeMainIterateAllObjcClasses"} -allowProvisioningUpdates`;
