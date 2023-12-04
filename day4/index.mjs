import * as fs from "node:fs/promises";

const formatLine = (line) => {
  const [winningNumbers, cardNumbers] = line.split(":")[1].split("|");
  const winningArray = winningNumbers.split(" ").filter((item) => !!item);
  const cardArray = cardNumbers.split(" ").filter((item) => !!item);
  return { cardArray, winningArray };
};

const part1 = async () => {
  const file = await fs.open("input.txt");
  let totalPoints = 0;

  for await (const line of file.readLines()) {
    const { cardArray, winningArray } = formatLine(line);
    let cardPoints = 0;
    for (const card of cardArray) {
      if (winningArray.includes(card)) {
        cardPoints = cardPoints > 0 ? cardPoints * 2 : 1;
      }
    }
    totalPoints += cardPoints;
  }
  console.log(totalPoints);
};

const resolveGame = (lines, index) => {
  let matches = 0,
    childMatches = 0;
  lines[index].winningArray.forEach((winningNumber) => {
    if (lines[index].cardArray.includes(winningNumber)) {
      matches++;
    }
  });
  for (let x = 1; x <= matches; x++) {
    childMatches += resolveGame(lines, index + x);
  }
  return childMatches + matches;
};

const part2 = async () => {
  const file = await fs.open("input.txt");

  const lines = [];
  for await (const line of file.readLines()) {
    lines.push(formatLine(line));
  }
  let totalPoints = lines.length;

  lines.forEach((line, index) => {
    totalPoints += resolveGame(lines, index);
  });

  console.log(totalPoints);
};

part1();
part2();
