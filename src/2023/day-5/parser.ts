import { Almanac, ConversionRow, ConversionTable } from "./types";

const SEEDS_PREFIX_LENGTH = 7;

function parseSeeds(rawSeeds: string): number[] {
	return rawSeeds
		.slice(SEEDS_PREFIX_LENGTH)
		.trim()
		.split(/\s+/)
		.map((rawSeedValue: string) => parseInt(rawSeedValue));
}

function parseConversionTable(rawMap: string): ConversionTable {
	const [rawConvertTypes, rawConvertRows] = rawMap.split("map:\n");

	const [sourceType, destinationType] = rawConvertTypes
		.match(/(\w+)-to-(\w+)/)!!
		.slice(1);

	const conversionRows = Array
		.from(rawConvertRows.matchAll(/(\d+)\s+(\d+)\s+(\d+)/g))
		.map<ConversionRow>(match => {
			const [destinationStart, sourceStart, rangeLength] = match
				.slice(1)
				.map(val => parseInt(val));

			return {
				source: {
					start: sourceStart,
					end: (sourceStart + rangeLength - 1),
				},
				destination: {
					start: destinationStart,
					end: (destinationStart + rangeLength - 1),
				},
				incrementBy: destinationStart - sourceStart,
			}
		});

	return {
		sourceType,
		destinationType,
		rows: conversionRows,
	};
}

export function parseAlmanac(rawAlmanac: string): Almanac {
	const [rawSeeds, ...rawConversionMaps] = rawAlmanac.split("\n\n");

	return {
		seeds: parseSeeds(rawSeeds),
		conversionTables: rawConversionMaps.map(parseConversionTable)
	};
}