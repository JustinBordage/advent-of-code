export type Almanac = {
	seeds: number[];
	conversionMaps: ConversionMap[];
};

export type ConversionMap = {
	sourceType: string; // "seed" in "seed-to-soil map:"
	targetType: string; // "soil" in "seed-to-soil map:"
	data: ConversionData[];
};

export type ConversionData = {
	targetStart: number;
	sourceStart: number;
	/** Number of values in range (Including the start) */
	rangeLength: number;
	/** The difference between the targetStart & the sourceStart */
	startDelta: number;
}

export type ConversionStep = {
	/** "seed", "soil", "location", etc. */
	type: string;
	/** The current value according to the type. */
	value: number;
}

export type SeedRange = {
	rangeStart: number;
	rangeLength: number;
}