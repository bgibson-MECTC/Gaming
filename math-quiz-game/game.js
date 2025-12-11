/* =======================================================
   MATH QUIZ GAME
   Main Game Engine
   ======================================================= */

/* =======================================================
   GLOBAL VARIABLES
   ======================================================= */

let playerName = "";
let currentScore = 0;
let currentQuestionIndex = 0;
let allQuestions = [];
let timer = 20;
let timerInterval;

/* =======================================================
   SCREEN HANDLING
   ======================================================= */

function showScreen(id) {
    document.querySelectorAll(".screen").forEach(s => s.classList.add("hidden"));
    document.getElementById(id).classList.remove("hidden");
    document.getElementById(id).classList.add("visible");
}

/* =======================================================
   INITIALIZATION
   ======================================================= */

document.addEventListener("DOMContentLoaded", async () => {
    await loadQuestions();
    setupEventListeners();
});

async function loadQuestions() {
    try {
        const response = await fetch("questions.json");
        allQuestions = await response.json();
        console.log(`Loaded ${allQuestions.length} questions`);
    } catch (error) {
        console.error("Error loading questions:", error);
        // Fallback questions if file doesn't load
        allQuestions = [
            {
                "question": "What is 5 + 3?",
                "answers": [
                    { "text": "6", "correct": false },
                    { "text": "7", "correct": false },
                    { "text": "8", "correct": true },
                    { "text": "9", "correct": false }
                ],
                "rationale": "5 + 3 = 8. This is basic addition.",
                "points": 100
            },
            {
                "question": "What is 12 × 4?",
                "answers": [
                    { "text": "44", "correct": false },
                    { "text": "48", "correct": true },
                    { "text": "52", "correct": false },
                    { "text": "56", "correct": false }
                ],
                "rationale": "12 × 4 = 48. Multiply 12 by 4.",
                "points": 100
            },
            {
                "question": "What is 25 - 17?",
                "answers": [
                    { "text": "6", "correct": false },
                    { "text": "7", "correct": false },
                    { "text": "8", "correct": true },
                    { "text": "9", "correct": false }
                ],
                "rationale": "25 - 17 = 8. This is basic subtraction.",
                "points": 100
            },
            {
                "question": "What is 64 ÷ 8?",
                "answers": [
                    { "text": "6", "correct": false },
                    { "text": "7", "correct": false },
                    { "text": "8", "correct": true },
                    { "text": "9", "correct": false }
                ],
                "rationale": "64 ÷ 8 = 8. This is basic division.",
                "points": 100
            },
            {
                "question": "What is 7 × 9?",
                "answers": [
                    { "text": "56", "correct": false },
                    { "text": "63", "correct": true },
                    { "text": "72", "correct": false },
                    { "text": "81", "correct": false }
                ],
                "rationale": "7 × 9 = 63. Multiply 7 by 9.",
                "points": 100
            }
        ];
    }
}

function setupEventListeners() {
    document.getElementById("startGameBtn").addEventListener("click", startGame);
    document.getElementById("skipBtn").addEventListener("click", skipQuestion);
    document.getElementById("nextBtn").addEventListener("click", nextQuestion);
    document.getElementById("restartGameBtn").addEventListener("click", restartGame);
}

/* =======================================================
   GAME START
   ======================================================= */

function startGame() {
    playerName = document.getElementById("playerNameInput").value.trim();
    
    if (!playerName) {
        alert("Please enter your name!");
        return;
    }
    
    currentScore = 0;
    currentQuestionIndex = 0;
    
    document.getElementById("playerNameLabel").textContent = playerName;
    document.getElementById("currentScore").textContent = currentScore;
    
    showScreen("gameScreen");
    loadQuestion();
}

/* =======================================================
   QUESTION LOADING
   ======================================================= */

function loadQuestion() {
    if (currentQuestionIndex >= allQuestions.length) {
        endGame();
        return;
    }
    
    const question = allQuestions[currentQuestionIndex];
    
    document.getElementById("questionText").textContent = question.question;
    document.getElementById("rationaleBox").classList.add("hidden");
    document.getElementById("nextBtn").classList.add("hidden");
    
    // Clear and populate answers
    const answersContainer = document.getElementById("answersContainer");
    answersContainer.innerHTML = "";
    
    question.answers.forEach((answer, index) => {
        const btn = document.createElement("button");
        btn.className = "answer-btn";
        btn.textContent = answer.text;
        btn.addEventListener("click", () => selectAnswer(index));
        answersContainer.appendChild(btn);
    });
    
    // Start timer
    timer = 20;
    document.getElementById("timer").textContent = timer;
    clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);
}

/* =======================================================
   TIMER
   ======================================================= */

function updateTimer() {
    timer--;
    document.getElementById("timer").textContent = timer;
    
    if (timer <= 0) {
        clearInterval(timerInterval);
        handleTimeout();
    }
}

function handleTimeout() {
    const question = allQuestions[currentQuestionIndex];
    const answersContainer = document.getElementById("answersContainer");
    const buttons = answersContainer.querySelectorAll(".answer-btn");
    
    buttons.forEach((btn, index) => {
        btn.disabled = true;
        if (question.answers[index].correct) {
            btn.classList.add("correct");
        }
    });
    
    showRationale("Time's up! No points awarded.");
}

/* =======================================================
   ANSWER SELECTION
   ======================================================= */

function selectAnswer(answerIndex) {
    clearInterval(timerInterval);
    
    const question = allQuestions[currentQuestionIndex];
    const answersContainer = document.getElementById("answersContainer");
    const buttons = answersContainer.querySelectorAll(".answer-btn");
    
    // Disable all buttons
    buttons.forEach(btn => btn.disabled = true);
    
    const isCorrect = question.answers[answerIndex].correct;
    
    // Highlight correct and incorrect answers
    buttons.forEach((btn, index) => {
        if (question.answers[index].correct) {
            btn.classList.add("correct");
        } else if (index === answerIndex && !isCorrect) {
            btn.classList.add("incorrect");
        }
    });
    
    if (isCorrect) {
        currentScore += question.points;
        document.getElementById("currentScore").textContent = currentScore;
        showRationale("Correct! " + question.rationale);
    } else {
        showRationale("Incorrect. " + question.rationale);
    }
}

/* =======================================================
   RATIONALE DISPLAY
   ======================================================= */

function showRationale(text) {
    const rationaleBox = document.getElementById("rationaleBox");
    rationaleBox.textContent = text;
    rationaleBox.classList.remove("hidden");
    
    document.getElementById("nextBtn").classList.remove("hidden");
}

/* =======================================================
   SKIP QUESTION
   ======================================================= */

function skipQuestion() {
    clearInterval(timerInterval);
    
    const question = allQuestions[currentQuestionIndex];
    const answersContainer = document.getElementById("answersContainer");
    const buttons = answersContainer.querySelectorAll(".answer-btn");
    
    buttons.forEach((btn, index) => {
        btn.disabled = true;
        if (question.answers[index].correct) {
            btn.classList.add("correct");
        }
    });
    
    showRationale("Question skipped. " + question.rationale);
}

/* =======================================================
   NEXT QUESTION
   ======================================================= */

function nextQuestion() {
    currentQuestionIndex++;
    loadQuestion();
}

/* =======================================================
   END GAME
   ======================================================= */

function endGame() {
    showScreen("finalScreen");
    
    document.getElementById("finalScore").textContent = currentScore;
    
    let message = "";
    const percentage = (currentScore / (allQuestions.length * 100)) * 100;
    
    if (percentage >= 90) {
        message = "Outstanding! You're a math genius! 🌟";
    } else if (percentage >= 70) {
        message = "Great job! You know your math! 👏";
    } else if (percentage >= 50) {
        message = "Good effort! Keep practicing! 📚";
    } else {
        message = "Keep trying! Practice makes perfect! 💪";
    }
    
    document.getElementById("finalMessage").textContent = message;
}

/* =======================================================
   RESTART GAME
   ======================================================= */

function restartGame() {
    clearInterval(timerInterval);
    currentScore = 0;
    currentQuestionIndex = 0;
    showScreen("introScreen");
    document.getElementById("playerNameInput").value = "";
}
