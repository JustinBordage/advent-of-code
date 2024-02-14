/** A pure function that sorts an array of items.
 *
 *  @return The sorted item array.
 *
 *  @remark This only performs a shallow clone. So if sorting a list
 *   of objects, the objects will still be their original references. */
export function mergeSort<T>(arr: T[], compareFn: (a: T, b: T) => boolean): T[] {
	const arrToSort = [...arr];
	doSort(arrToSort, 0, arrToSort.length - 1, compareFn);
	return arrToSort;
}

/** Sorts the array in place */
function doSort<T>(arr: T[], left: number, right: number, compareFn: (a: T, b: T) => boolean) {
	if (left < right) {
		const middle = left + Math.floor((right - left) / 2);
		doSort(arr, left, middle, compareFn);
		doSort(arr , middle + 1, right, compareFn);
		merge(arr, left, middle, right, compareFn);
	}
}

function merge<T>(arr: T[], left: number, middle: number, right: number, compareFn: (a: T, b: T) => boolean) {
	const leftSubArray = arr.slice(left, middle + 1);
	const rightSubArray = arr.slice(middle + 1, right + 1);

	const n1 = middle - left + 1;
	const n2 = right - middle;

	let i = 0, j = 0, k = left;
	while (i < n1 && j < n2) {
		arr[k++] = compareFn(leftSubArray[i], rightSubArray[j])
		           ? leftSubArray[i++]
		           : rightSubArray[j++]
	}

	while (i < n1) {
		arr[k++] = leftSubArray[i++];
	}

	while (j < n2) {
		arr[k++] = rightSubArray[j++];
	}
}