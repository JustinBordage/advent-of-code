import { extractFileLines } from "../../common/helpers";

// ===== Day X: Advent Challenge =====
// https://adventofcode.com/2023/day/X
async function executeAdventOfCodeDayX() {
	const rawInput = (await extractFileLines("./input.txt", __dirname));
	// TODO: Add rawInput parser here

	const partOneAnswer = "???";
	const partTwoAnswer = "???";
	console.log({ partOneAnswer, partTwoAnswer });
}

executeAdventOfCodeDayX();