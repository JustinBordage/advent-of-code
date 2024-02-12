import { readFileContents } from "../../common/helpers";
import { mergeSort } from "./sorting-algo";
import { CamelPlay, HandType } from "./types";

function getJokerOffset(cardCounts: Map<string, number>) {
	const jokerCount = cardCounts.get("J") ?? 0;
	if (jokerCount !== 0) cardCounts.delete("J");
	return jokerCount;
}

function evalHandType(cardsInHand: string, withJokers: boolean): HandType {
	const cardCounts = new Map<string, number>();
	for (const card of cardsInHand) {
		cardCounts.set(
			card,
			(cardCounts.get(card) ?? 0) + 1,
		);
	}

	const jokerOffset = withJokers ? getJokerOffset(cardCounts) : 0;
	const cardQuantities = Array.from(cardCounts.values())
	                            .toSorted((a, b) => b - a);
	cardQuantities[0] += jokerOffset;

	switch (cardQuantities.length) {
		case 1:
			return HandType.FIVE_OF_A_KIND;
		case 2:
			return cardQuantities[0] === 4
			       ? HandType.FOUR_OF_A_KIND
			       : HandType.FULL_HOUSE;
		case 3:
			return cardQuantities[0] === 2
			       ? HandType.TWO_PAIR
			       : HandType.THREE_OF_A_KIND;
		case 4:
			return HandType.ONE_PAIR;
		case 5:
		default:
			return HandType.HIGH_CARD;
	}
}

function useEvalCardValue(withJokers: boolean): (card: string) => number {
	const jCardValue = !withJokers ? 11 : 1;

	return (card: string) => {
		switch (card) {
			case "A":
				return 14;
			case "K":
				return 13;
			case "Q":
				return 12;
			case "J":
				return jCardValue;
			case "T":
				return 10;
			default:
				return parseInt(card);
		}
	};
}

function parseGameData(rawCamelCardsData: string[], withJokers: boolean): CamelPlay[] {
	const evalCardValue = useEvalCardValue(withJokers);
	return rawCamelCardsData.map<CamelPlay>(rawHandAndBid => {
		const [cardsInHand, bid] = rawHandAndBid.split(" ");

		return {
			cardValues: Array.from(cardsInHand).map(evalCardValue),
			type: evalHandType(cardsInHand, withJokers),
			bid: parseInt(bid),
		};
	});
}

function calcTotalWinnings(rawInput: string[], withJokers: boolean) {
	const camelCardPlays = parseGameData(rawInput, withJokers);

	return mergeSort(camelCardPlays, (a, b) => {
		if (a.type !== b.type) {
			return b.type > a.type;
		} else {
			const divergentIndex = a.cardValues.findIndex((card, index) => card !== b.cardValues[index]);
			return divergentIndex !== -1 && a.cardValues[divergentIndex] < b.cardValues[divergentIndex];
		}
	})
	.reduce((winningsSum, { bid }, rankIndex) => {
		return winningsSum + bid * (rankIndex + 1);
	}, 0);
}

// ===== Day 7: Camel Cards =====
// https://adventofcode.com/2023/day/7
function executeAdventOfCodeDay7() {
	const rawInput = readFileContents("./input.txt", __dirname).split("\n");

	// Avg: 1.52312ms | 10 Cycles
	// Avg: 0.99500ms | 100 Cycles
	// Avg: 0.99167ms | 1000 Cycles
	// Avg: 1.02064ms | 10000 Cycles
	// Avg: 1.02346ms | 100000 Cycles
	const partOneAnswer = calcTotalWinnings(rawInput, false);

	// Avg: 1.21712ms | 10 Cycles
	// Avg: 1.09650ms | 100 Cycles
	// Avg: 1.08500ms | 1000 Cycles
	// Avg: 1.02506ms | 10000 Cycles
	// Avg: 1.03768ms | 100000 Cycles
	const partTwoAnswer = calcTotalWinnings(rawInput, true);

	// Status of challenge:
	//  Part 1 - Solved
	//  Part 2 - Solved
	console.log({ partOneAnswer, partTwoAnswer });
}

executeAdventOfCodeDay7();