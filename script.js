const questions = [
  {
    question: "Which function displays text or a value on the screen in Python?",
    options: ["show()", "print()", "display()", "write()"],
    answer: 1,
    explanation: "The print() function displays text and values in the output."
  },
  {
    question: "Which symbol is used to start a single-line comment in Python?",
    options: ["//", "<!--", "#", "/*"],
    answer: 2,
    explanation: "A hash symbol (#) starts a single-line comment in Python."
  },
  {
    question: "What is the data type of the value 3.14?",
    options: ["int", "str", "bool", "float"],
    answer: 3,
    explanation: "A number with a decimal point is a float in Python."
  },
  {
    question: "Which operator checks whether two values are equal?",
    options: ["=", "==", "!=", "<="],
    answer: 1,
    explanation: "The == operator compares two values for equality; = assigns a value."
  },
  {
    question: "What is the result of 5 // 2 in Python?",
    options: ["2", "2.5", "3", "1"],
    answer: 0,
    explanation: "The // operator performs floor division, so 5 // 2 gives 2."
  },
  {
    question: "Which collection stores items in an ordered, changeable sequence?",
    options: ["tuple", "set", "list", "string"],
    answer: 2,
    explanation: "A list is ordered and mutable, so its items can be changed."
  },
  {
    question: "Which keyword is used to define a function in Python?",
    options: ["function", "def", "fun", "make"],
    answer: 1,
    explanation: "Python functions are defined with the def keyword."
  },
  {
    question: "What does len('Python') return?",
    options: ["5", "7", "6", "Python"],
    answer: 2,
    explanation: "The string 'Python' contains six characters, so len() returns 6."
  },
  {
    question: "Which loop is commonly used to go through each item in a list?",
    options: ["for", "repeat", "loop", "each"],
    answer: 0,
    explanation: "A for loop can iterate through each item in a list."
  },
  {
    question: "Which value represents a condition that is true in Python?",
    options: ["TRUE", "'True'", "yes", "True"],
    answer: 3,
    explanation: "Python's Boolean true value is written True with a capital T."
  }
];

const QUIZ_TIME_SECONDS = 10 * 60;

const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const startBtn = document.getElementById("start-btn");
const nextBtn = document.getElementById("next-btn");
const restartBtn = document.getElementById("restart-btn");
const questionCount = document.getElementById("question-count");
const liveScore = document.getElementById("live-score");
const timerDisplay = document.getElementById("timer");
const progressBar = document.getElementById("progress-bar");
const questionText = document.getElementById("question-text");
const optionsContainer = document.getElementById("options");
const feedback = document.getElementById("feedback");
const timeNote = document.getElementById("time-note");

let currentQuestion = 0;
let score = 0;
let answered = false;
let timeRemaining = QUIZ_TIME_SECONDS;
let timerInterval = null;
let quizFinished = false;

function showScreen(screen) {
  [startScreen, quizScreen, resultScreen].forEach(item => item.classList.add("hidden"));
  screen.classList.remove("hidden");
}

function startQuiz() {
  clearInterval(timerInterval);
  currentQuestion = 0;
  score = 0;
  answered = false;
  timeRemaining = QUIZ_TIME_SECONDS;
  quizFinished = false;
  timerDisplay.classList.remove("timer-warning");
  timeNote.classList.add("hidden");
  showScreen(quizScreen);
  updateTimerDisplay();
  renderQuestion();
  timerInterval = setInterval(tickTimer, 1000);
}

function tickTimer() {
  if (quizFinished) return;
  timeRemaining -= 1;
  updateTimerDisplay();

  if (timeRemaining <= 60) timerDisplay.classList.add("timer-warning");
  if (timeRemaining <= 0) {
    timeRemaining = 0;
    updateTimerDisplay();
    finishQuiz(true);
  }
}

function updateTimerDisplay() {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  timerDisplay.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function renderQuestion() {
  answered = false;
  const item = questions[currentQuestion];
  questionCount.textContent = `Question ${currentQuestion + 1} of ${questions.length}`;
  liveScore.textContent = `Score: ${score}`;
  progressBar.style.width = `${(currentQuestion / questions.length) * 100}%`;
  questionText.textContent = item.question;
  optionsContainer.innerHTML = "";
  feedback.textContent = "";
  feedback.className = "feedback";
  nextBtn.disabled = true;
  nextBtn.textContent = currentQuestion === questions.length - 1 ? "See Results →" : "Next Question →";

  item.options.forEach((optionText, index) => {
    const button = document.createElement("button");
    button.className = "option";
    button.type = "button";
    button.innerHTML = `<span class="option-letter">${String.fromCharCode(65 + index)}</span><span></span>`;
    button.querySelector("span:last-child").textContent = optionText;
    button.addEventListener("click", () => selectAnswer(index));
    optionsContainer.appendChild(button);
  });
}

function selectAnswer(selectedIndex) {
  if (answered || quizFinished) return;
  answered = true;
  const item = questions[currentQuestion];
  const optionButtons = [...optionsContainer.querySelectorAll(".option")];
  optionButtons.forEach((button, index) => {
    button.disabled = true;
    if (index === item.answer) button.classList.add("correct");
    if (index === selectedIndex && selectedIndex !== item.answer) button.classList.add("wrong");
  });

  if (selectedIndex === item.answer) {
    score++;
    feedback.textContent = `Correct! ${item.explanation}`;
    feedback.classList.add("good");
  } else {
    feedback.textContent = `Not quite. ${item.explanation}`;
    feedback.classList.add("bad");
  }
  liveScore.textContent = `Score: ${score}`;
  nextBtn.disabled = false;
}

function finishQuiz(timeExpired = false) {
  if (quizFinished) return;
  quizFinished = true;
  clearInterval(timerInterval);
  showResults(timeExpired);
}

function showResults(timeExpired = false) {
  showScreen(resultScreen);
  timeNote.classList.toggle("hidden", !timeExpired);
  const percentage = Math.round((score / questions.length) * 100);
  document.getElementById("final-score").textContent = score;
  document.getElementById("percentage-text").textContent = `${percentage}% score`;
  document.getElementById("result-bar").style.width = `${percentage}%`;

  let title, message, icon;
  if (timeExpired) {
    title = "Time is up!";
    message = "Your quiz ended when the 10-minute time limit ran out.";
    icon = "⏰";
  } else if (percentage === 100) {
    title = "Perfect score!";
    message = "Excellent work. You answered every question correctly.";
    icon = "🏆";
  } else if (percentage >= 70) {
    title = "Great job!";
    message = "You have a strong result. Keep practising to learn even more.";
    icon = "🎉";
  } else if (percentage >= 40) {
    title = "Good effort!";
    message = "You are making progress. Review the explanations and try again.";
    icon = "📚";
  } else {
    title = "Keep learning!";
    message = "Every attempt helps you improve. Review the questions and give it another try.";
    icon = "🌱";
  }
  document.getElementById("result-title").textContent = title;
  document.getElementById("result-message").textContent = message;
  document.getElementById("result-icon").textContent = icon;
}

startBtn.addEventListener("click", startQuiz);
nextBtn.addEventListener("click", () => {
  if (quizFinished || !answered) return;
  if (currentQuestion < questions.length - 1) {
    currentQuestion++;
    renderQuestion();
  } else {
    finishQuiz(false);
  }
});
restartBtn.addEventListener("click", startQuiz);
