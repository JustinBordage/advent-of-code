import { extractFileLines, sumOf } from "../../common/helpers";
import { ScratchCard } from "./types";

function parseNumsList(rawNumsList: string): number[] {
	return rawNumsList.trim()
	                  .split(/\s+/g)
	                  .map(rawNum => parseInt(rawNum));
}

function parseScratchCard(rawScratchCard: string): ScratchCard {
	const [rawCardInfo, rawCardValues] = rawScratchCard.split(": ");
	const cardId = parseInt(rawCardInfo.slice(4).trimStart());

	const [rawWinningNums, rawGameNums] = rawCardValues.split(/\s*\|\s*/);

	const winningNumbers = parseNumsList(rawWinningNums);
	const gameNumbers = parseNumsList(rawGameNums);
	const numOfMatches = countMatches(winningNumbers, gameNumbers);

	return {
		cardId,
		numOfMatches,
	}
}

function countMatches(winningNumbers: number[], gameNumbers: number[]) {
	let numOfMatches = 0;

	for (const gameNum of gameNumbers) {
		if (winningNumbers.length === 0) {
			break;
		}

		const matchIndex = winningNumbers.indexOf(gameNum);
		if (matchIndex !== -1) {
			winningNumbers.splice(matchIndex, 1);
			numOfMatches++;
		}
	}

	return numOfMatches;
}

function calcCardPoints(numOfMatches: number) {
	if (numOfMatches === 0) return 0;

	return Math.pow(2, numOfMatches - 1);
}

function sumOfScratchCardPoints(scratchCards: ScratchCard[]) {
	return scratchCards.reduce((totalPoints, scratchCard) => (
		totalPoints + calcCardPoints(scratchCard.numOfMatches)
	), 0);
}

function sumOfAllScratchCardCopies(scratchCards: ScratchCard[]): number {
	/** Key is the Card ID, value is the number of copies for that card. */
	const cardCopies = new Map(scratchCards.map(({ cardId }) => [cardId, 1]));
	const highestCardId = Math.max(...cardCopies.keys());

	scratchCards.forEach(({ cardId, numOfMatches }) => {
		const currCardCopies = cardCopies.get(cardId) ?? 0;

		const untilId = Math.min(cardId + numOfMatches, highestCardId);
		for (let nextId = cardId + 1; nextId <= untilId; nextId++) {
			const otherCardCopies = cardCopies.get(nextId) ?? 0;
			cardCopies.set(nextId, otherCardCopies + currCardCopies);
		}
	});

	return sumOf(Array.from(cardCopies.values()));
}

// ===== Day 4: Scratchcards =====
// https://adventofcode.com/2023/day/4
async function executeAdventOfCodeDay4() {
	const scratchCards = (await extractFileLines("./input.txt", __dirname))
		.map(parseScratchCard);

	const partOneAnswer = sumOfScratchCardPoints(scratchCards);
	const partTwoAnswer = sumOfAllScratchCardCopies(scratchCards);
	console.log({ partOneAnswer, partTwoAnswer });
}

executeAdventOfCodeDay4();