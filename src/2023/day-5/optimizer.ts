import { ConversionRange, ConversionTable, Range } from "./types";

function hasOverlap(a: Range, b: Range): Boolean {
	return a.end >= b.start && b.end >= a.start;
}

function removeOverlap(rangeToTrim: ConversionRange, otherRange: ConversionRange): ConversionRange[] {
	if (!hasOverlap(rangeToTrim, otherRange)) {
		return [rangeToTrim];
	}

	const result: ConversionRange[] = [];

	if (rangeToTrim.start < otherRange.start) {
		result.push({
			start: rangeToTrim.start,
			end: otherRange.start - 1,
	        incrementBy: rangeToTrim.incrementBy,
		});
	}

	if (otherRange.end < rangeToTrim.end) {
		result.push({
            start: otherRange.end + 1,
            end: rangeToTrim.end,
            incrementBy: rangeToTrim.incrementBy,
        });
	}

	return result;
}

function getIntersectingRange(range1: Range, range2: Range): Range | null {
	const intersectStart = Math.max(range1.start, range2.start);
	const intersectEnd = Math.min(range1.end, range2.end);
	if (intersectStart > intersectEnd) return null;

	return {
		start: intersectStart,
		end: intersectEnd,
	};
}

/** Trims any intersecting ranges from the target range. */
function trimIntersectingRanges(rangeToTrim: ConversionRange, otherRanges: ConversionRange[]): ConversionRange[] {
	return otherRanges.reduce((trimmedRange, other) => {
		return trimmedRange.flatMap(trimRange => removeOverlap(trimRange, other));
	}, [rangeToTrim]);
}

function mergeConversionTables(sourceTable: ConversionTable, destTable: ConversionTable): ConversionTable {
	if (sourceTable.destinationType != destTable.sourceType) {
		throw new Error("Merge is not possible, the destination & source types don't match!");
	}

	const intersectRanges: ConversionRange[] = [];
	const trimmedRanges: ConversionRange[] = [];
	const sourceRanges = sourceTable.rows.map<ConversionRange>(({ destination, incrementBy }) => ({
		start: destination.start,
		end: destination.end,
		incrementBy: incrementBy
	}));

	destTable.rows
	      .forEach(({ source, incrementBy: destIncrementBy }) => {
		      const destRange: ConversionRange = { start: source.start, end: source.end, incrementBy: destIncrementBy };
		      const overlappingSourceRanges = sourceRanges.filter(sourceRange => hasOverlap(destRange, sourceRange));

		      // Adds the non-intersecting parts of the destination ranges to the new list of conversions.
		      trimmedRanges.push(...trimIntersectingRanges(destRange, overlappingSourceRanges));

		      // Adds the intersecting parts of the destination ranges
		      // to the list of intersecting conversion ranges.
		      overlappingSourceRanges
			      .forEach(({ incrementBy: sourceIncrementBy, ...sourceRange }) => {
				      const intersectRange = getIntersectingRange(sourceRange, destRange);
				      if (intersectRange === null) return;

				      intersectRanges.push({
					      start: intersectRange.start - sourceIncrementBy,
					      end: intersectRange.end - sourceIncrementBy,
					      incrementBy: destIncrementBy + sourceIncrementBy,
				      });
			      });
	      });

	// Adds the non-intersecting parts of the source
	// ranges to the new list of conversions.
	sourceTable.rows
		.forEach(({ source, incrementBy }) => {
			// This is NOT the same as "sourceRanges" declared above. This
			// loop uses the "source" range instead of the "destination" range.
			const sourceRange: ConversionRange = { start: source.start, end: source.end, incrementBy };
			trimmedRanges.push(...trimIntersectingRanges(sourceRange, intersectRanges));
		});

	return {
		sourceType: sourceTable.sourceType,
		destinationType: destTable.destinationType,
		rows: trimmedRanges
			.concat(...intersectRanges)
			.map(({ start, end, incrementBy }) => ({
				source: {
					start,
					end
				},
				destination: {
					start: start + incrementBy,
					end: end + incrementBy,
				},
				incrementBy: incrementBy,
			})),
	};
}

function findTableOfSourceType(conversionTables: ConversionTable[], targetType: string): ConversionTable | null {
	return conversionTables.find(({ sourceType }) => sourceType === targetType) ?? null;
}

/** While this flatten function is faster than my
 *  previous brute force attempt, it contains A LOT
 *  of nested loops, which is less than satisfactory.
 *
 *  I'll revisit this at a later date to make it better. */
export function flattenConversionTables(conversionTables: ConversionTable[], destinationType: string): ConversionTable {
	let currConversionTable = findTableOfSourceType(conversionTables, "seed");
	if (currConversionTable === null) throw new Error("Initial Seed table not found!");

	while (currConversionTable.destinationType !== destinationType) {
		const { destinationType } = currConversionTable;
		const destinationTable = findTableOfSourceType(conversionTables, destinationType);

		if (destinationTable === null) {
			throw new Error(`Failed to merge table @ step '${destinationType}'`);
		}

		currConversionTable = mergeConversionTables(currConversionTable, destinationTable);
	}

	return currConversionTable
}