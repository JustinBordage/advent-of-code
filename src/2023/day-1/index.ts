import { readFileContents } from "../../common/helpers";

function extractCalibrationValue(rawCalibrationValue: string): number {
	const rawNumValues = rawCalibrationValue.match(/\d/g);
	if (rawNumValues === null) return 0;

	const firstNum = rawNumValues[0];
	const lastNum = rawNumValues[rawNumValues.length - 1];
	return parseInt(`${firstNum}${lastNum}`.padStart(2, "0"));
}

const SUBSTITUTIONS: Record<string, number> = {
	"one": 1,
	"two": 2,
	"three": 3,
	"four": 4,
	"five": 5,
	"six": 6,
	"seven": 7,
	"eight": 8,
	"nine": 9,
} as const;
const SUBSTITUTION_PATTERN = new RegExp(`(?=(${Object.keys(SUBSTITUTIONS).join("|")}))`, "g");

function substituteTextDigits(rawVal: string): string {
	// This could be made more efficient by only
	// replacing the first and last matches.
	return rawVal.replace(
		SUBSTITUTION_PATTERN,
		(_, match) => `${SUBSTITUTIONS[match]}`
	);
}

function calcCalibrationSum(rawCalibrationValues: string[]): number {
	return rawCalibrationValues.reduce((calibrationSum, rawVal) => {
		return calibrationSum + extractCalibrationValue(rawVal);
	}, 0);
}

// ===== Day 1: Trebuchet?! =====
// https://adventofcode.com/2023/day/1
function executeAdventOfCodeDay1() {
	const inputData = readFileContents("./input.txt", __dirname).split("\n");
	const substitutedInputData = inputData.map(substituteTextDigits);

	const partOneAnswer = calcCalibrationSum(inputData);
	const partTwoAnswer = calcCalibrationSum(substitutedInputData);

	// Status of challenge:
	//  Part 1 - Solved
	//  Part 2 - Solved
	console.log({ partOneAnswer, partTwoAnswer });
}

executeAdventOfCodeDay1();