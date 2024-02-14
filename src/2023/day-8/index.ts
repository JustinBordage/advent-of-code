import { readFileContents } from "../../common/helpers";
import { MapInstructions, MapNode, NodePos } from "./types";

function parseNode(rawNode: string): [NodePos, MapNode] {
	const [nodePos, rawDestinations] = rawNode.split(/ = /);

	const [leftDestination, rightDestination] = rawDestinations
		?.replace(/^\(|\)$/g, "")
		?.split(", ");

	return [
		nodePos,
		{
			L: leftDestination,
			R: rightDestination
		},
	];
}

function parseMapInstructions(rawInput: string): MapInstructions {
	const [rawDirections, rawNodes] = rawInput.split(/\n\n/);

	if (/[^LR]/.test(rawDirections)) {
		throw new Error("Failed to parse map directions.");
	}
	const directions = Array.from(rawDirections) as ("L" | "R")[];

	const nodeEntries = rawNodes.split("\n").map(parseNode);
	const nodes = new Map(nodeEntries);

	return {
		directions,
		numOfDirections: directions.length,
		nodes,
	};
}

function countStepsToDestination(
	instructions: MapInstructions,
	startingPos: NodePos,
	targetPos: string,
) {
	let currPos = startingPos;
	let currStep: number = 0;

	while (currPos !== targetPos) {
		const { directions, numOfDirections, nodes } = instructions;
		const direction = directions[currStep % numOfDirections];

		currPos = nodes.get(currPos)!![direction];
		currStep++;
	}

	return currStep;
}

// ===== Day 8: Haunted Wasteland =====
// https://adventofcode.com/2023/day/8
function executeAdventOfCodeDay8() {
	const rawInput = readFileContents("./input.txt", __dirname);

	const instructions = parseMapInstructions(rawInput);

	const partOneAnswer = countStepsToDestination(instructions, "AAA", "ZZZ");
	const partTwoAnswer = "???";
	console.log({ partOneAnswer, partTwoAnswer });
}

executeAdventOfCodeDay8();