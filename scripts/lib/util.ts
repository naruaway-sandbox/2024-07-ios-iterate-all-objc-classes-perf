import { execa } from "execa";

export const $ = execa({ verbose: "short" });
