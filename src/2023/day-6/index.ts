import { readFileContents } from "../../common/helpers";
import { RaceInfo } from "./types";

function parseRaceInfoPart1(rawInput: string[]) {
	const parsedStats = rawInput.map(rawStats => rawStats
		.replace(/^\w+:\s+/, "")
		.trimEnd()
		.split(/\s+/)
		.map(rawStat => parseInt(rawStat))
	);

	const raceTimes = parsedStats[0];
	const raceDistanceRecords = parsedStats[1];

	if (raceTimes.length !== raceDistanceRecords.length) {
		throw new Error("Failed to parse race info.");
	}

	const raceInfoList: RaceInfo[] = [];
	for (let i = 0; i < raceTimes.length; i++) {
		raceInfoList.push({
			duration: raceTimes[i],
			distanceRecord: raceDistanceRecords[i],
		});
	}

	return raceInfoList;
}

function parseRaceStatsPart2(rawInput: string[]): RaceInfo {
	const [duration, distanceRecord] = rawInput.map(text => {
		const rawStat = text.replace(/^\w+:|\s+/g, "");
		return parseInt(rawStat);
	});

	return {
		duration,
		distanceRecord,
	};
}

function isWinningCharge(raceInfo: RaceInfo, timeCharged: number): boolean {
	const distanceTravelled = (raceInfo.duration - timeCharged) * timeCharged;
	return distanceTravelled > raceInfo.distanceRecord;
}

/** Searches for the shortest charge time that will still win the race.
 *
 *  @remark This is based on a binary search. */
function findLowestWinningChargeTime(raceInfo: RaceInfo): number | null {
	let left = 0;
	let right = raceInfo.duration - 1;

	while (left <= right) {
		const timeCharged = left + Math.ceil((right - left) / 2);

		if (!isWinningCharge(raceInfo, timeCharged)) {
			// Search Upper Half
			left = timeCharged + 1;
		} else if (isWinningCharge(raceInfo, timeCharged - 1)) {
			// Search Lower Half
			right = timeCharged - 1;
		} else {
			return timeCharged;
		}
	}

	return null;
}

/** Evaluates the margin of error for a given race. */
function evalMarginOfError(raceInfo: RaceInfo) {
	const lowestChargeToWin = findLowestWinningChargeTime(raceInfo);
	if (lowestChargeToWin === null) return 0;

	return raceInfo.duration - (lowestChargeToWin * 2) + 1;
}

function calcProductOfMarginOfError(raceInfoList: RaceInfo[]) {
	return raceInfoList.reduce(
		(product, raceInfo) => {
			return product * evalMarginOfError(raceInfo);
		},
		1,
	);
}

function solvePart1(rawInput: string[]): number {
	const raceInfoPart1 = parseRaceInfoPart1(rawInput);
	return calcProductOfMarginOfError(raceInfoPart1);
}

function solvePart2(rawInput: string[]): number {
	const raceInfoPart2 = parseRaceStatsPart2(rawInput);
	return evalMarginOfError(raceInfoPart2);
}

// ===== Day 6: Wait For It =====
// https://adventofcode.com/2023/day/6
function executeAdventOfCodeDay6() {
	const rawInput = readFileContents("./input.txt", __dirname)
		.split("\n");

	// Avg: 0.01280ms | 10 Cycles
	// Avg: 0.00300ms | 100 Cycles
	// Avg: 0.00216ms | 1000 Cycles
	// Avg: 0.00245ms | 10000 Cycles
	// Avg: 0.00198ms | 100000 Cycles
	const partOneAnswer = solvePart1(rawInput);

	// Avg: 0.00816ms | 10 Cycles
	// Avg: 0.00242ms | 100 Cycles
	// Avg: 0.00161ms | 1000 Cycles
	// Avg: 0.00162ms | 10000 Cycles
	// Avg: 0.00093ms | 100000 Cycles
	const partTwoAnswer = solvePart2(rawInput);

	// Status of challenge:
	//  Part 1 - Solved
	//  Part 2 - Solved
	console.log({ partOneAnswer, partTwoAnswer });
}

executeAdventOfCodeDay6();