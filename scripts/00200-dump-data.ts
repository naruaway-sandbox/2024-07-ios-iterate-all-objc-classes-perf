import { getData } from "./lib/data.js";
import * as fs from "node:fs/promises";
import * as path from "node:path";

const outputPath = path.join(import.meta.dirname, "data.json");
console.log(`Writing to ${outputPath}`);
await fs.writeFile(outputPath, JSON.stringify(await getData()));
