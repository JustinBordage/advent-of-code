import { extractFileLines } from "../../common/helpers";
import { parseAlmanac } from "./parser";
import { flattenConversionTables } from "./optimizer";
import { ConversionTable, ConversionData, Range } from "./types";

// ======= Part 1 =======

function convertValueToType(conversionTable: ConversionTable, value: number): number {
	const conversion = conversionTable.data.find(({ sourceStart, sourceEnd }) => {
		return value >= sourceStart && value <= sourceEnd;
	});

	return value + (conversion?.incrementBy ?? 0);
}

export function findLowestSeedLocation(seeds: number[], seedToLocationTable: ConversionTable): number {
	const seedLocations = seeds
		.map(seedNum => convertValueToType(seedToLocationTable, seedNum));

	return Math.min(...seedLocations);
}

// ======= Part 2 =======

export function extractSeedRanges(seeds: number[]): Range[] {
	const seedRanges: Range[] = [];

	for (let seedIndex = 0; seedIndex < seeds.length; seedIndex += 2) {
		const start = seeds[seedIndex];
		const size = seeds[seedIndex + 1];
		seedRanges.push({
            start: start,
            end: start + size - 1,
        });
	}

	return seedRanges;
}

/** Finds the lowest point where the ranges intersect, or return null if they don't intersect. */
function findLowestIntersectionPoint(seedRange: Range, conversionRange: ConversionData): number | null {
	const lowerBound = Math.max(seedRange.start, conversionRange.sourceStart);
	const upperBound = Math.min(seedRange.end, conversionRange.sourceEnd);
	return lowerBound <= upperBound ? lowerBound : null;
}

export function findLowestSeedLocationInSeedRanges(seeds: number[], seedToLocationTable: ConversionTable): number {
	const targetConversionData = seedToLocationTable.data.sort((tableA, tableB) => tableA.targetStart - tableB.targetStart);
	const seedRanges = extractSeedRanges(seeds);

	const intersections: number[] = [];
	let index = 0;

	while (intersections.length === 0 && index < targetConversionData.length) {
		const conversionRange = targetConversionData[index];

		seedRanges.forEach((seedRange) => {
			const intersect = findLowestIntersectionPoint(seedRange, conversionRange);
			if (intersect !== null) intersections.push(intersect + conversionRange.incrementBy);
		});

		index++;
	}

	return Math.min(...intersections);
}

// ===== Day 5: If You Give A Seed A Fertilizer =====
// https://adventofcode.com/2023/day/5
async function executeAdventOfCodeDay5() {
	const rawAlmanac = (await extractFileLines("./input.txt", __dirname))
		.join("\n");

	// Avg: 0.14593ms | 10000 Cycles
	const { seeds, conversionTables } = parseAlmanac(rawAlmanac);

	// Avg: 21.76205ms | 10000 Cycles
	const seedToLocationTable = flattenConversionTables(conversionTables, "location");

	// Avg: 0.00793ms | 10000 Cycles
	const partOneAnswer = findLowestSeedLocation(seeds, seedToLocationTable);

	// Avg: 0.02797ms | 10000 Cycles
	const partTwoAnswer = findLowestSeedLocationInSeedRanges(seeds, seedToLocationTable);

	// Status of challenge:
	//  Part 1 - Solved
	//  Part 2 - Solved
	console.log({ partOneAnswer, partTwoAnswer });
}

executeAdventOfCodeDay5();