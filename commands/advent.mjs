/** Expects the following command format:
 *      `npm run advent day-{number} [y2023|y23]` (Year is optional)
 *
 *  This is using JavaScript here instead of TypeScript, so ts-node doesn't
 *  have to compile this file & then the advent challenge file separately. */

import { execSync } from "child_process";
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const DEFAULT_ADVENT_OF_CODE_YEAR = "2023";

const COLOR_RED = "\x1b[31m";
const COLOR_RESET = "\x1b[0m";

/** Logs an error message in red text to the console.
 *
 *  @param errorMsg {string} */
function logError(errorMsg) {
	console.log(`${COLOR_RED}${errorMsg}${COLOR_RESET}`);
}

/** Resolves a filepath relative to this file.
 *
 *  @param filepath {string}
 *  @return {string} */
function resolvePath(filepath) {
	const __filename = fileURLToPath(import.meta.url);
	const __dirname = path.dirname(__filename);

	return path.resolve(__dirname, filepath);
}

/** Finds a command argument that matches the Regex pattern.
 *
 *  @template {string | null} T
 *  @param regex {RegExp}
 *  @param defaultValue {T}
 *  @return {string | T} */
function getCommandArgByPattern(regex, defaultValue) {
	return process.argv.find(arg => regex.test(arg)) ?? defaultValue;
}

function executeAdventOfCodeChallenge() {
	const adventDay = getCommandArgByPattern(/day-\d+/, null);
	let adventYear = getCommandArgByPattern(/y(\d{2}|\d{4})/, DEFAULT_ADVENT_OF_CODE_YEAR);

	if (!adventDay) {
		logError("The Advent of Code day is missing or invalid!\nPlease ensure 'day-#' is present within the command.")
		return;
	}

	if (adventYear.length === 2) {
		adventYear = `20${adventYear}`;
	}

	const resolvedPath = resolvePath(`../src/${adventYear}/${adventDay}`);
	if (!fs.existsSync(resolvedPath)) {
		const day = adventDay.slice(4);
		logError(`Could not find Advent of Code Challenge Day ${day}, ${adventYear}`);
		return;
	}

	execSync(`npx ts-node ${resolvedPath}`, { stdio: "inherit" });
}

executeAdventOfCodeChallenge();