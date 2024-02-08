function run(fn: Function, count: number, ...args: any[]) {
	const start = performance.now();

	for (let i = 0; i < count; ++i) {
		fn.apply(null, args);
	}

	return performance.now() - start;
}

export function evalPerformance<T extends Function>(fnList: T[], ...args: any[]) {
	[10, 100, 1000, 10000, 100000].forEach(count => {
		fnList.forEach(fn => {
			const elapsedTime = run(fn, count, ...args);
			console.log(fn.name, `Avg: ${(elapsedTime / count).toFixed(5)}ms | ${count} Cycles`);
		});
	});
}