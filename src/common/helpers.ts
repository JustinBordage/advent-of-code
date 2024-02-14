import path from "path";
import fs from "fs";

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

/** Creates an array with the range of numbers.
 *
 *  @param start The first number in the range (Inclusive).
 *  @param end The last number in the range (Exclusive).
 *
 *  @remark This is being kept for use in
 *   early prototyping of AoC solutions. */
export function createIntRangeArray(start: number, end: number) {
	return Array.from(Array(end - start).keys()).map((_, i) => i + start);
}

/** Checks if the value is within the bounds of a range.
 *
 *  @param value The value to check.
 *  @param lowerLimit The lower bounds to check (Inclusive).
 *  @param upperLimit The upper bounds to check (Inclusive). */
export function isWithinBounds(value: number, lowerLimit: number, upperLimit: number): boolean {
	return value >= lowerLimit && value <= upperLimit;
}