const minimalNumInput = document.querySelector("#minimalInput");
const maximalNumInput = document.querySelector("#maximalInput");
const operandInput = document.querySelector("#operand");
const startBtn = document.getElementById("startBtn");
const questionLabel = document.getElementById("questionLabel");
const answerInput = document.querySelector("#inputAnswer");
const checkBtn = document.getElementById("checkBtn");
const message = document.getElementById("message");
const saveBtn = document.getElementById("saveBtn");

let min;
let max;
let operand;
let answer;
let num1;
let num2;

let data = [];

//When starting new game the check button should be disabled
const newGame = () => {
  checkBtn.disabled = true;
};

//Function that generates random number between min and max
const generateRandom = (min, max) => {
  let num = Math.floor(Math.random() * (max - min + 1)) + min;
  return num;
};

//Function reloadList loads data from local storage
const reloadList = () => {
  const jsonStr = localStorage.getItem("game");
  //check if no json
  if (!jsonStr) {
    return;
  }
  // parse json
  data = JSON.parse(jsonStr);

  //update the html
  for (let item of data) {
    updateListHtml(
      item.num1,
      item.num2,
      item.operand,
      item.userGuess,
      item.correctAnswer
    );
  }
};

//Function checkValidInputs checks if user inputs are valid before pressing start
const checkValidInputs = (minimal, maximal, operand, num1, num2) => {
  //Checking if:
  //The operand is allowed
  //The operand input is empty
  //Minimal num is "" or NaN
  //Maximal num is "" or NaN
  let operands = ["*", "/", "+", "-"];
  if (!operands.includes(operand) || !operand || !minimal || !maximal) {
    message.innerText = `Hey there! Make sure to fill out all the fields correctly 😃`;
    questionLabel.innerText = "? = ";
    return false;
  } else {
    //if all inputs are correct update the question label and return true
    const str = `${num1} ${operand} ${num2} = `;
    questionLabel.innerText = str;
    startBtn.disabled = false;
    return true;
  }
};

const updateListHtml = (num1, num2, operand, answer, correctAnswer) => {
  const list = document.getElementById("listQuestions");
  const listItem = document.createElement("li");
  listItem.classList.add(
    "list-group-item",
    "d-flex",
    "justify-content-between",
    "align-items-start",
    "listItem"
  );

  const div1 = document.createElement("div");
  div1.classList.add("ms-2", "me-auto");
  div1.innerText = `Question:`;

  const div2 = document.createElement("div");
  div2.classList.add("fw-bold");
  div2.innerText = `${num1} ${operand} ${num2} = ${answer}`;

  const span = document.createElement("span");
  span.classList.add("badge", "rounded-pill");
  // if answer is correct make the span green
  //if answer is wrong make the span red
  if (answer === correctAnswer) {
    span.innerText = "Correct";
    span.classList.add("bg-success");
  } else {
    span.innerText = "Wrong";
    span.classList.add("bg-danger");
  }

  list.appendChild(listItem);
  listItem.appendChild(div1);
  div1.appendChild(div2);
  listItem.appendChild(span);
  // console.log(span);
};

startBtn.addEventListener("click", (e) => {
  e.preventDefault();
  min = +minimalNumInput.value;
  max = +maximalNumInput.value;
  operand = operandInput.value;
  num1 = generateRandom(min, max);
  num2 = generateRandom(min, max);

  // when clicking on the start button check if inputs are valid and disable or enable check button
  // if (checkValidInputs(min, max, operand, num1, num2)) {
  //   checkBtn.disabled = false;
  // }
  //update the check button state based on whatever the checkValidInputs function returns
  checkBtn.disabled = !checkValidInputs(min, max, operand, num1, num2);
});

checkBtn.addEventListener("click", (e) => {
  e.preventDefault();
  //declaring variable for storing the correct answer
  let correctAnswer;
  //Creating an object of data to store in local storage
  const gameData = {
    num1: num1,
    num2: num2,
    operand: operand,
    userGuess: +document.getElementById("inputAnswer").value,
    correctAnswer: correctAnswer,
  };
  //Only after user answers the question showing the save button
  const saveBtn = document.getElementById("saveBtn");
  saveBtn.style.display = "block";

  //evaluate correct answer
  if (operand == "+") {
    correctAnswer = num1 + num2;
  } else if (operand == "-") {
    correctAnswer = num1 - num2;
  } else if (operand == "*") {
    correctAnswer = num1 * num2;
  } else if (operand == "/") {
    correctAnswer = num1 / num2;
  }

  const value = gameData.userGuess;
  //Move this to seperate function
  if (!value || typeof value == "string") {
    const inputValue = document.getElementById("inputAnswer");
    inputValue.value = "";
    inputValue.setAttribute("placeholder", "Please enter a valid number");
    document.getElementById("saveBtn").style.display = "none";
    return;
  } else if (value === correctAnswer) {
    message.textContent = "Your answer is correcrt! 🥳";
  } else {
    message.textContent = "Your answer is wrong! 😭";
  }

  gameData.correctAnswer = correctAnswer;
  data.push(gameData);

  updateListHtml(
    gameData.num1,
    gameData.num2,
    gameData.operand,
    gameData.userGuess,
    gameData.correctAnswer
  );
  newGame();
});

saveBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const jsonStr = JSON.stringify(data);
  localStorage.setItem("game", jsonStr);
});
reloadList();
newGame();
