import * as fs from "node:fs/promises";

const parseSeeds = (line) => {
  return line
    .split(":")[1]
    .split(" ")
    .filter((item) => item)
    .map((item) => Number(item));
};

const transformSeeds = (gardenMaps, seeds) => {
  gardenMaps.forEach((gardenMap) => {
    seeds = seeds.map((seed) => {
      let newSeed = -1;
      // optimize here?
      gardenMap.forEach((record) => {
        if (
          newSeed === -1 &&
          seed >= record[1] &&
          seed < record[1] + record[2]
        ) {
          newSeed = seed + (record[0] - record[1]);
        }
      });
      if (newSeed < 0) {
        newSeed = seed;
      }
      return newSeed;
    });
  });
  return seeds;
};

const main = async () => {
  const file = await fs.open("input.txt");

  let seeds,
    index = 0,
    gardenMaps = [],
    group = -1;

  for await (const line of file.readLines()) {
    if (index === 0) {
      seeds = parseSeeds(line);
    } else if (!line) {
      continue;
    } else if (line.includes(":")) {
      group++;
    } else {
      if (!Array.isArray(gardenMaps[group])) {
        gardenMaps[group] = [];
      }
      gardenMaps[group].push(
        line
          .split(" ")
          .filter((item) => item)
          .map((item) => Number(item))
      );
    }
    index++;
  }

  console.log(
    "Part 1: ",
    transformSeeds(gardenMaps, seeds).sort((a, b) => a - b)[0]
  );

  //part2

  let smallestSeed = Infinity;
  for (let x = 0; x < seeds.length; x += 2) {
    let value = seeds[x];
    let iterations = seeds[x + 1];
    let previousValue;
    let jumpNumber = Infinity;

    gardenMaps.forEach((gardenMap) => {
      gardenMap.forEach((record) => {
        jumpNumber = jumpNumber < record[2] ? jumpNumber : record[2];
      });
    });

    for (let y = 0; y < iterations; y += jumpNumber) {
      let sum = transformSeeds(gardenMaps, [value])[0];
      smallestSeed = smallestSeed > sum ? sum : smallestSeed;
      if (previousValue + jumpNumber != sum) {
        for (let z = value - jumpNumber; z <= value; z += 1) {
          let innerSum = transformSeeds(gardenMaps, [z])[0];
          smallestSeed = smallestSeed > innerSum ? innerSum : smallestSeed;
        }
      }
      previousValue = sum;
      value += jumpNumber;
    }
  }

  console.log("part 2: ", smallestSeed);
};

main();
