export enum HandType {
	HIGH_CARD,
	ONE_PAIR,
	TWO_PAIR,
	THREE_OF_A_KIND,
	FULL_HOUSE,
	FOUR_OF_A_KIND,
	FIVE_OF_A_KIND,
}

/** Contains a player's cards & their bid.
 *
 *  @remark Couldn't think of a better name. */
export interface CamelPlay {
	cardValues: number[];
	type: HandType;
	bid: number;
}