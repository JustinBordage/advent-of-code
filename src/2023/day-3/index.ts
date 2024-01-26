import { extractFileLines, sumOf } from "../../common/helpers";
import { PartNumber, SymbolParts } from "./types";

const SYMBOL_PATTERN = /[*\-$@=#+/%&]/g;
const PART_NUMBER_PATTERN = /\d+/g;

function extractAllPartNumbers(inputLine: string): PartNumber[] {
	return Array.from(inputLine.matchAll(PART_NUMBER_PATTERN))
	            .map(match => {
		            const numberText = match[0];
		            const startPos = match.index!!;

		            return {
			            value: parseInt(numberText),
			            startPos: startPos,
			            endPos: startPos + numberText.length,
		            }
	            });
}

function extractSymbolParts(
	rawInput: string[],
	extractedParts: PartNumber[][],
	pattern: RegExp,
): SymbolParts[] {
	return rawInput.reduce(
		(
			symbolParts: SymbolParts[],
            currLine: string,
            lineNum: number
        ) => {
			const potentialParts = [
				...(extractedParts[lineNum - 1] ?? []),
				...extractedParts[lineNum],
				...(extractedParts[lineNum + 1] ?? []),
			];

			for (const match of currLine.matchAll(pattern)) {
				const adjacentPartNumbers = potentialParts
					.filter(partNum => isAdjacent(partNum, match.index!!))
					.map(partNum => partNum.value);

				if (adjacentPartNumbers.length > 0) {
					symbolParts.push({
						symbol: match[0],
		                partNumbers: adjacentPartNumbers,
					});
				}
			}

			return symbolParts;
		},
		[],
	);
}

/** Tests if the number is either horizontally adjacent to the number
 *  either on the same line or on an adjacent line (Includes diagonals).
 *
 *  @remark Assumes that the part number is either on the
 *   same line as the symbol or vertically adjacent to one. */
function isAdjacent(partNum: PartNumber, symbolPos: number): boolean {
	return symbolPos >= partNum.startPos - 1 && symbolPos <= partNum.endPos;
}

function sumOfPartNumbers(symbolParts: SymbolParts[]): number {
	return symbolParts
		.reduce((sum, { partNumbers }) => {
			return sum + sumOf(partNumbers);
		}, 0);
}

function sumOfGearRatios(symbolParts: SymbolParts[]): number {
	return symbolParts
		.reduce((sum, { symbol, partNumbers }) => {
			if (symbol !== "*" || partNumbers.length !== 2) {
				return sum;
			}

			return sum + (partNumbers[0] * partNumbers[1]);
		}, 0);
}

// ===== Day 3: Gear Ratios =====
// https://adventofcode.com/2023/day/3
async function executeAdventOfCodeDay3() {
	const rawInputData = await extractFileLines("./input.txt", __dirname);

	const partNumberPositions = rawInputData.map(extractAllPartNumbers);
	const symbolParts = extractSymbolParts(rawInputData, partNumberPositions, SYMBOL_PATTERN);

	const partOneAnswer = sumOfPartNumbers(symbolParts);
	const partTwoAnswer = sumOfGearRatios(symbolParts);

	// Status of challenge:
	//  Part 1 - Solved
	//  Part 2 - Solved
	console.log({ partOneAnswer, partTwoAnswer });
}

executeAdventOfCodeDay3();