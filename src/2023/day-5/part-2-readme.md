## --- Day 5: If You Give A Seed A Fertilizer (Part 2) ---

Everyone will starve if you only plant such a small number of seeds. Re-reading the almanac, it looks like the `seeds:` line actually describes **_ranges of seed numbers_**.

The values on the initial `seeds:` line come in pairs. Within each pair, the first value is the **_start_** of the range and the second value is the **_length_** of the range. So, in the first line of the example above:

`seeds: 79 14 55 13`

This line describes two ranges of seed numbers to be planted in the garden. The first range starts with seed number `79` and contains `14` values: `79`, `80`, ..., `91`, `92`. The second range starts with seed number `55` and contains `13` values: `55`, `56`, ..., `66`, `67`.

Now, rather than considering four seed numbers, you need to consider a total of **_27_** seed numbers.

In the above example, the lowest location number can be obtained from seed number `82`, which corresponds to soil `84`, fertilizer `84`, water `84`, light `77`, temperature `45`, humidity `46`, and **_location_** `46`. So, the lowest location number is `46`.

Consider all of the initial seed numbers listed in the ranges on the first line of the almanac. **_What is the lowest location number that corresponds to any of the initial seed numbers?_**