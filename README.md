# 2024-07-ios-iterate-all-objc-classes-perf

## How to run the benchmark

## Prerequisite

- You should have Xcode (I tested on Xcode 15.3) on your macOS
- Please use Node.js (at least v22, I used v22.4.1) and make sure to run `corepack enable` for the first time.

Then please run the following:

```
pnpm install
```

## Build the app for two variants

The following will build the apps for two variants.
One variant is called "without-init" and the other is called "with-init".
The former does not run anything in `ExecuteSomethingBeforeMain.m` and the latter runs a set of heavy operations which involves iterating through all the Objective-C classes.

```
pnpm exec tsx ./scripts/00000-build.ts
```

## Run the benchmark

The following will run the benchmark. xctrace files will be stored under the "traces" directory.

```
BENCHMARK_TARGET_IOS_DEVICE_UDID=YOUR_DEVICE_UDID_HERE pnpm exec tsx ./scripts/00100-run-benchmark.ts
```

## Convert collected xctrace files in the benchmark into JSON

```
pnpm exec tsx ./scripts/00200-dump-data.ts
```

## View the benchmark result in the web UI

```
pnpm run ui
```
