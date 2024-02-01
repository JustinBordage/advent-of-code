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

function mergeConversionTables(source: ConversionTable, target: ConversionTable): ConversionTable {
	if (source.targetType != target.sourceType) {
		throw new Error("Merge is not possible, the target & source types don't match!");
	}

	const intersectRanges: ConversionRange[] = [];
	const trimmedRanges: ConversionRange[] = [];
	const sourceRanges = source.data.map<ConversionRange>(sRange => ({
		start: sRange.targetStart,
		end: sRange.targetEnd,
		incrementBy: sRange.incrementBy
	}));

	target.data
	      .forEach(({ sourceStart, sourceEnd, incrementBy }) => {
		      const targetRange: ConversionRange = { start: sourceStart, end: sourceEnd, incrementBy };
		      const overlappingSourceRanges = sourceRanges.filter(sourceRange => hasOverlap(targetRange, sourceRange));

		      // Adds the non-intersecting parts of the target ranges to the new list of conversions.
		      trimmedRanges.push(...trimIntersectingRanges(targetRange, overlappingSourceRanges));

		      // Adds the intersecting parts of the target ranges
		      // to the list of intersecting conversion ranges.
		      const targetIncrementBy = targetRange.incrementBy;
		      overlappingSourceRanges
			      .forEach(({ incrementBy: sourceIncrementBy, ...sourceRange }) => {
				      const intersectRange = getIntersectingRange(sourceRange, targetRange);
				      if (intersectRange === null) return;

				      intersectRanges.push({
					      start: intersectRange.start - sourceIncrementBy,
					      end: intersectRange.end - sourceIncrementBy,
					      incrementBy: targetIncrementBy + sourceIncrementBy,
				      });
			      });
	      });

	// Adds the non-intersecting parts of the source
	// ranges to the new list of conversions.
	source.data
		.forEach(({ sourceStart, sourceEnd, incrementBy }) => {
			// This is NOT the same as "sourceRanges" declared above. This
			// one uses "source(Start/End)" instead of "target(Start/End).
			const sourceRange: ConversionRange = { start: sourceStart, end: sourceEnd, incrementBy };
			trimmedRanges.push(...trimIntersectingRanges(sourceRange, intersectRanges));
		});

	return {
		sourceType: source.sourceType,
		targetType: target.targetType,
		data: trimmedRanges
			.concat(...intersectRanges)
			.map(({ start, end, incrementBy }) => ({
				sourceStart: start,
				sourceEnd: end,
				targetStart: start + incrementBy,
				targetEnd: end + incrementBy,
				incrementBy: incrementBy,
			})),
	};
}

function findTableOfSourceType(conversionTables: ConversionTable[], desiredSourceType: string): ConversionTable | null {
	return conversionTables.find(({ sourceType }) => sourceType === desiredSourceType) ?? null;
}

/** While this flatten function is faster than my
 *  previous brute force attempt, it contains A LOT
 *  of nested loops, which is less than satisfactory.
 *
 *  I'll revisit this at a later date to make it better. */
export function flattenConversionTables(conversionTables: ConversionTable[], targetType: string): ConversionTable {
	let currConversionTable = findTableOfSourceType(conversionTables, "seed");
	if (currConversionTable === null) throw new Error("Initial Seed table not found!");

	while (currConversionTable.targetType !== targetType) {
		const { targetType } = currConversionTable;
		const targetTable = findTableOfSourceType(conversionTables, targetType);

		if (targetTable === null) {
			throw new Error(`Failed to merge table @ step '${targetType}'`);
		}

		currConversionTable = mergeConversionTables(currConversionTable, targetTable);
	}

	return currConversionTable
}