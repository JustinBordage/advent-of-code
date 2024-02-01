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
			console.log(fn.name, count, `${run(fn, count, ...args).toFixed(5)}ms`);
		});
	});
}