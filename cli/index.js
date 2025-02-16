#!/usr/bin/env node

console.log("Hello cli", process.argv);
// npx cli 는 node index.js 와 같은 효과
// npx cli one tow three

// index.js 로 계속 바라보고 실행될 경우
// rimraf 설치 -> cli 관련 파일 삭제 하기
// 1. 파일 확인 : npm ls -g node-cli
// 2. rimraf 설치 : npm i -g rimraf
// 3. cli 관련 파일 삭제 : rimraf cli cli.cmd cli.ps1

const readline = require("readline"); // 노드 내장 모듈
const rl = readline.createInterface({
  input: process.stdin, // 터미널의 input, output
  output: process.stdout,
});
console.clear();
const answerCallback = (answer) => {
  if (answer === "y") {
    console.log("감사합니다.");
    rl.close();
  } else if (answer === "n") {
    console.log("죄송합니다.");
    rl.close();
  } else {
    console.clear();
    console.log("y 또는 n만 입력하세요.");
    rl.question("예제가 재미있습니까? (y/n)", answerCallback);
  }
};
rl.question("예제가 재미있습니까? (y/n)", answerCallback);
