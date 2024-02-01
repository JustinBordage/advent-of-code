export type Almanac = {
	seeds: number[];
	conversionTables: ConversionTable[];
};

export type ConversionTable = {
	sourceType: string; // "seed" in "seed-to-soil map:"
	targetType: string; // "soil" in "seed-to-soil map:"
	data: ConversionData[];
};

export type ConversionData = {
	/** The starting range of the source (Inclusive) */
	sourceStart: number;
	/** The ending range of the source (Inclusive) */
	sourceEnd: number;
	targetStart: number;
	targetEnd: number;
	/** The amount to increment the source
	 *  value by to find to target value. */
	incrementBy: number;
}

export type ConversionRange = {
	/** The amount to increment the source
	 *  value by to find the target value. */
	incrementBy: number;
} & Range;

export type Range = {
	/** The start of the range (Inclusive) */
	start: number,
	/** The end of the range (Inclusive) */
	end: number
};