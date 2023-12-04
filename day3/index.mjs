import * as fs from "node:fs/promises";

const getParts = async (parseFunction) => {
  const file = await fs.open("input.txt");

  let lines = [];
  let acc = 0;

  for await (const line of file.readLines()) {
    const matches = [...line.matchAll(/\d+/g)];
    const gears = line.matchAll(/\*/g);
    lines.push({ line, matches, gears });
    if (lines.length === 1) {
      continue;
    } else if (lines.length === 2) {
      acc += parseFunction(lines, 0);
      continue;
    } else if (lines.length > 3) {
      lines.shift();
    }

    acc += parseFunction(lines);
  }
  lines.shift();
  acc += parseFunction(lines);

  console.log(acc);
};

const parseLines = (inputLines, lineNumber = 1) => {
  let sum = 0;
  for (const match of inputLines[lineNumber].matches) {
    let isValid = false;
    const searchRange = {
      start: match.index - 1,
      end: match.index + match[0].length,
    };
    inputLines.forEach((lineObject) => {
      if (
        lineObject.line
          .substring(searchRange.start, searchRange.end + 1)
          .match(/@|\+|=|\*|\?|\^|\$|%|&|#|\/|\\|\||-/)
      ) {
        isValid = true;
      }
    });
    if (isValid) {
      sum += Number(match[0]);
    }
  }
  return sum;
};

const parseLines2 = (inputLines, lineNumber = 1) => {
  let sum = 0;
  for (const match of inputLines[lineNumber].gears) {
    let validNumbers = [];
    const searchRange = {
      start: match.index - 1,
      end: match.index + match[0].length,
    };
    for (const lineObject of inputLines) {
      let result = lineObject.line
        .substring(searchRange.start, searchRange.end + 1)
        .matchAll(/\d/g);

      let addedMatches = [];
      for (const resultMatch of result) {
        let digitIndex = searchRange.start + resultMatch.index;

        for (const lineNumberMatch of lineObject.matches) {
          if (
            digitIndex >= lineNumberMatch.index &&
            digitIndex < lineNumberMatch.index + lineNumberMatch[0].length &&
            !addedMatches.includes(lineNumberMatch.index)
          ) {
            validNumbers.push(lineNumberMatch[0]);
            addedMatches.push(lineNumberMatch.index);
          }
        }
      }
    }
    sum +=
      validNumbers.length === 2
        ? Number(validNumbers[0]) * Number(validNumbers[1])
        : 0;
  }
  return sum;
};

getParts(parseLines);
getParts(parseLines2);
