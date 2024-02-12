import path from "path";
import fs from "fs";
import readline from "readline";

/** Reads the contents of an Advent of Code "input.txt" file.
 *
 *  @param filepath {string}
 *  @param dirname {string} A global NodeJS variable, Syntax: `__dirname`. */
export function readFileContents(filepath: string, dirname: string): string {
	const resolvedFilepath = path.resolve(dirname, filepath);
	return fs.readFileSync(resolvedFilepath, { encoding: "utf-8" }).replace(/\r/g, "");
}

/** Adds 2 numbers together (For use in a "reduce"). */
export function add(a: number, b: number) {
	return a + b;
}

/** Calculates the sum of a list of numbers. */
export function sumOf(numbers: number[]) {
	return numbers.reduce(add);
}

/** Performs `String.prototype.padStart` on a number.
 *
 *  @remark This is intended for formatting logged data. */
export function numPadStart(num: number, length: number, fillString: string = " ") {
	return num.toString().padStart(length, fillString);
}
