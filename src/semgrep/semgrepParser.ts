import { readFileSync } from "fs";
import path from "path";

export async function parseSemgrep(jsonPath: any): Promise<any> {
    let jsonString = readFileSync(jsonPath, { encoding: "utf8" });
    let jsonParsed = JSON.parse(jsonString);
    return { parsed: jsonParsed, path: path.dirname(jsonPath) + '/' };
}