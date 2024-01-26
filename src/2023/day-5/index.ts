import { extractFileLines } from "../../common/helpers";
import { Almanac, ConversionData, ConversionMap, ConversionStep, SeedRange } from "./types";

const SEEDS_PREFIX_LENGTH = 7;

function parseSeeds(rawSeeds: string): number[] {
	return rawSeeds
		.slice(SEEDS_PREFIX_LENGTH)
		.trim()
		.split(/\s+/)
		.map((rawSeedValue: string) => parseInt(rawSeedValue));
}

function parseConversionMap(rawMap: string): ConversionMap {
	const [rawConvertTypes, rawConvertData] = rawMap.split("map:\n");

	const [sourceType, targetType] = rawConvertTypes
		.match(/(\w+)-to-(\w+)/)!!
		.slice(1);

	const conversionValues = Array.from(rawConvertData.matchAll(/(\d+)\s+(\d+)\s+(\d+)/g))
	     .map<ConversionData>(match => {
		     const [targetStart, sourceStart, rangeLength] = match
			     .slice(1)
			     .map(val => parseInt(val));

			 return {
				 targetStart,
				 sourceStart,
				 rangeLength,
				 startDelta: targetStart - sourceStart,
			 }
	     });

	return {
		sourceType,
		targetType,
		data: conversionValues,
	};
}

function parseAlmanac(rawAlmanac: string): Almanac {
	const [rawSeeds, ...rawConversionMaps] = rawAlmanac.split("\n\n");

	return {
		seeds: parseSeeds(rawSeeds),
		conversionMaps: rawConversionMaps.map(parseConversionMap)
	};
}

function convertValueToType(conversionData: ConversionData[], value: number) {
	const converter = conversionData.find(({ sourceStart, rangeLength }) => (
		value >= sourceStart && value < sourceStart + rangeLength
	));

	if (!converter) {
		return value;
	} else {
		return value + converter.startDelta;
	}
}

function convertSeedToType(
	conversionMaps: ConversionMap[],
	targetType: string,
	seedValue: number,
): number {
	let currType = "seed";
	let currValue = seedValue;

	while (currType !== targetType) {
		const convertMap = conversionMaps
			.find(convertMap => convertMap.sourceType === currType);

		if (convertMap) {
			currType = convertMap.targetType;
			currValue = convertValueToType(convertMap.data, currValue);
		} else {
			throw new Error(`Failed to convert seed value to type '${targetType}'`);
		}
	}

	return currValue;
}

function findLowestSeedLocation({ seeds, conversionMaps }: Almanac) {
	const seedLocations = seeds.map(seedNum => convertSeedToType(conversionMaps, "location", seedNum));
	return Math.min(...seedLocations);
}

/** This current implementation is a brute force solve... which is NOT ideal.
 *
 * In order to make it not a brute force solve I would have to:
 *  1) Programmatically optimize the conversion maps to go direct from seed to location.
 *  2) Sort the conversion data by target value (So we search the lowest possible values first)
 *  3) Then find the optimized conversion with the lowest seed-to-location
 *     target value where the source range overlaps with one of the seed ranges.
 *  4) Then find the minimum of all these lowest values.
 *
 *  @remark This is a first-pass pseudocode plan. It's likely I'll think of a more efficient process later on.
 *  @remark I will revisit this implementation and optimize it once I finish all the advent challenges for 2023. */
function findLowestSeedLocationInSeedRanges({ seeds, conversionMaps }: Almanac) {
	const seedRanges: SeedRange[] = [];

	for (let seedIndex = 0; seedIndex < seeds.length; seedIndex += 2) {
		const rangeStart = seeds[seedIndex];
		const rangeLength = seeds[seedIndex + 1];

		seedRanges.push({
			rangeStart,
			rangeLength,
		});
	}

	const numOfSeedRanges = seedRanges.length;
	let lowestLocation = Number.MAX_SAFE_INTEGER;
	seedRanges.forEach(({ rangeStart, rangeLength }, rangeIndex) => {
		// Used to visualize the progress of the brute force solve.
		console.log(`Resolving Seed Range ${(rangeIndex + 1)} of ${numOfSeedRanges} | Size: '${rangeLength}'`);

		for (let index = 0; index < rangeLength; index++) {
			const seedNum = rangeStart + index;
			const location = convertSeedToType(conversionMaps, "location", seedNum);
			if (location < lowestLocation) {
				lowestLocation = location;
			}
		}
	});

	return lowestLocation;
}

// ===== Day 5: If You Give A Seed A Fertilizer =====
// https://adventofcode.com/2023/day/5
async function executeAdventOfCodeDay5() {
	const rawAlmanac = (await extractFileLines("./input.txt", __dirname))
		.join("\n");

	const almanac = parseAlmanac(rawAlmanac);

	const partOneAnswer = findLowestSeedLocation(almanac);
	const partTwoAnswer = findLowestSeedLocationInSeedRanges(almanac);

	// Status of challenge:
	//  Part 1 - Solved
	//  Part 2 - Solved (Brute forced)
	console.log({ partOneAnswer, partTwoAnswer });
}

executeAdventOfCodeDay5();