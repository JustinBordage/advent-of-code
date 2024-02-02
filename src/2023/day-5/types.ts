export type Almanac = {
	seeds: number[];
	conversionTables: ConversionTable[];
};

export type ConversionTable = {
	sourceType: string; // "seed" in "seed-to-soil map:"
	destinationType: string; // "soil" in "seed-to-soil map:"
	rows: ConversionRow[];
};

export type ConversionRow = {
	source: Range;
	destination: Range;
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