import { Almanac, ConversionData, ConversionTable } from "./types";

const SEEDS_PREFIX_LENGTH = 7;

function parseSeeds(rawSeeds: string): number[] {
	return rawSeeds
		.slice(SEEDS_PREFIX_LENGTH)
		.trim()
		.split(/\s+/)
		.map((rawSeedValue: string) => parseInt(rawSeedValue));
}

function parseConversionTable(rawMap: string): ConversionTable {
	const [rawConvertTypes, rawConvertData] = rawMap.split("map:\n");

	const [sourceType, targetType] = rawConvertTypes
		.match(/(\w+)-to-(\w+)/)!!
		.slice(1);

	const conversionValues = Array
		.from(rawConvertData.matchAll(/(\d+)\s+(\d+)\s+(\d+)/g))
		.map<ConversionData>(match => {
			const [targetStart, sourceStart, rangeLength] = match
				.slice(1)
				.map(val => parseInt(val));

			return {
				sourceStart,
				sourceEnd: (sourceStart + rangeLength - 1),
				targetStart,
				targetEnd: (targetStart + rangeLength - 1),
				incrementBy: targetStart - sourceStart,
			}
		});

	return {
		sourceType,
		targetType,
		data: conversionValues,
	};
}

export function parseAlmanac(rawAlmanac: string): Almanac {
	const [rawSeeds, ...rawConversionMaps] = rawAlmanac.split("\n\n");

	return {
		seeds: parseSeeds(rawSeeds),
		conversionTables: rawConversionMaps.map(parseConversionTable)
	};
}