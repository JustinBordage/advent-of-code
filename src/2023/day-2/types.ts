export interface SetResult {
	color: string,
	quantity: number
}

/** `Key` is the Color name, `Value` is the quantity for the given color. */
export type ColorQuantities = Record<string, number>;

/** `Key` is the Color name, `Value` are the quantities found in each Set Result, collected into an array. */
export type ColorQuantityResults = Record<string, number[]>;

export interface GameData {
	gameId: number;
	results: ColorQuantityResults;
}