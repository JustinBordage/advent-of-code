import { readFileContents } from "../../common/helpers";
import { ColorQuantities, ColorQuantityResults, GameData, SetResult } from "./types";

function parseSetResult(setResult: string): SetResult {
	const [rawQuantity, color] = setResult.split(" ");
	const quantity = parseInt(rawQuantity);

	return {
		color,
		quantity,
	};
}

function parseGameData(rawGameData: string): GameData {
	const [rawGameId, rawGameSetData] = rawGameData.split(": ");

	const gameId = parseInt(rawGameId.slice(5));

	const results = rawGameSetData
		.split("; ")
		.flatMap(gameResultSet => gameResultSet.split(", "))
		.reduce((resultMap: ColorQuantityResults, setResult: string) => {
			const { color, quantity } = parseSetResult(setResult);

			const colorResult = resultMap[color] ?? [];
			resultMap[color] = colorResult.concat(quantity);

			return resultMap;
		}, {});

	return {
		gameId,
		results,
	};
}

function extractHighestColorResults(results: ColorQuantityResults): SetResult[] {
	return Object.entries(results)
	             .map(([color, resultValues]) => ({
	                color,
	                quantity: Math.max(...resultValues)
				 }));
}

function isPossibleGame(availColorQuantities: ColorQuantities, highestColorSetResults: SetResult[]) {
	return highestColorSetResults.every(({ color, quantity }) => (
		quantity <= (availColorQuantities[color] ?? 0)
	));
}

function calcIdSumOfPossibleGames(availColorQuantities: ColorQuantities, inputData: GameData[]): number {
	return inputData.reduce((gameIdSum, { gameId, results }) => {
		const highestColorSetResults = extractHighestColorResults(results);

		if (isPossibleGame(availColorQuantities, highestColorSetResults)) {
			gameIdSum += gameId;
		}

		return gameIdSum;
	}, 0);
}

function calcCubeSetPower(results: ColorQuantityResults): number {
	return extractHighestColorResults(results)
		.reduce((acc, { quantity }) => acc * quantity, 1);
}

function calcSumOfCubeSetPower(inputData: GameData[]) {
	return inputData.reduce((cubeSetPowerSum, { results }) => (
		cubeSetPowerSum + calcCubeSetPower(results)
	), 0);
}

// ===== Day 2: Cube Conundrum =====
// https://adventofcode.com/2023/day/2
function executeAdventOfCodeDay2() {
	const inputData = readFileContents("./input.txt", __dirname)
		.split("\n")
		.map(parseGameData);

	const availColorQuantities: ColorQuantities = {
		"red": 12,
		"green": 13,
		"blue": 14,
	};

	const partOneAnswer = calcIdSumOfPossibleGames(availColorQuantities, inputData);
	const partTwoAnswer = calcSumOfCubeSetPower(inputData);

	// Status of challenge:
	//  Part 1 - Solved
	//  Part 2 - Solved
	console.log({ partOneAnswer, partTwoAnswer });
}

executeAdventOfCodeDay2();

