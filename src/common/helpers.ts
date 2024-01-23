import path from "path";
import fs from "fs";
import readline from "readline";

/** Determines if the provided filepath is a relative path. */
function isRelativePath(filepath: string): boolean {
	return /^\.{1,2}[\/\\]/.test(filepath);
}

/** Extracts all the lines from an Advent of Code
 *  "input.txt" file and formats it into a string array.
 *
 *  @param filepath {string}
 *  @param dirname {string | undefined} Only required if the filepath is a relative path. */
export async function extractFileLines(filepath: string, dirname?: string): Promise<string[]> {
	const paths = [filepath];
	if (isRelativePath(filepath)) {
		if (!dirname) {
			throw new Error("A relative filepath MUST also have the `__dirname` passed in as the second argument.");
		}

		paths.unshift(dirname);
	}

	const resolvedFilepath = path.resolve(...paths);
	const filestream = fs.createReadStream(resolvedFilepath);
	const lineReader = readline.createInterface({
		input: filestream,
		crlfDelay: Infinity,
	});

	const fileLines: string[] = [];
	for await (const line of lineReader) {
		fileLines.push(line)
	}

	return fileLines;
}

/** Adds 2 numbers together (For use in a "reduce"). */
export function add(a: number, b: number) {
	return a + b;
}

/** Calculates the sum of a list of numbers. */
export function sumOf(numbers: number[]) {
	return numbers.reduce(add);
}


