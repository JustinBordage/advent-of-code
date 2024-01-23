export interface SymbolParts {
	symbol: string;
	/** The part numbers that are
	 *  adjacent to the symbol. */
	partNumbers: number[];
}

export interface PartNumber {
	/** The value of the numeric string */
	value: number;
	startPos: number;
	endPos: number;
}