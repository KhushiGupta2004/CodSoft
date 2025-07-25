let currentQuestionIndex = 0;
let selectedQuestions = [];
let score = 0;
const totalQuestions = 5;

const startBtn = document.getElementById('start-btn');
const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');
const optionsContainer = document.getElementById('options-container');
const submitBtn = document.getElementById('submit-btn');
const resultText = document.getElementById('result-text');
const restartBtn = document.getElementById('restart-btn');

startBtn.addEventListener('click', () => {
  // Do not hide start screen yet
  score = 0;
  currentQuestionIndex = 0;
  resultScreen.classList.add('hidden');
  startQuiz();
});

submitBtn.addEventListener('click', () => {
  const selectedOption = document.querySelector('input[name="option"]:checked');
  if (!selectedOption) return alert("Please select an option!");
  selectedQuestions[currentQuestionIndex].userAnswer = selectedOption.value;
  if (selectedOption.value === selectedQuestions[currentQuestionIndex].answer) {
    score++;
  }
  currentQuestionIndex++;
  if (currentQuestionIndex < totalQuestions) {
    loadQuestion(currentQuestionIndex);
  } else {
    quizScreen.classList.add('hidden');
    showResult();
  }
});

restartBtn.addEventListener('click', () => {
  score = 0;
  currentQuestionIndex = 0;
  resultScreen.classList.add('hidden');
  quizScreen.classList.remove('hidden');
  startQuiz();
});

function startQuiz() {
  fetch(`https://opentdb.com/api.php?amount=${totalQuestions}&type=multiple`)
    .then(response => response.json())
    .then(data => {
      selectedQuestions = data.results.map(q => ({
        question: decodeHTML(q.question),
        options: shuffleArray([q.correct_answer, ...q.incorrect_answers].map(decodeHTML)),
        answer: decodeHTML(q.correct_answer)
      }));
      loadQuestion(0);
      startScreen.classList.add('hidden');
      quizScreen.classList.remove('hidden');
    })
    .catch(() => {
      optionsContainer.innerHTML = 'Failed to load questions. Please try again.';
      submitBtn.disabled = true;
    });
}

function loadQuestion(index) {
  optionsContainer.innerHTML = '';
  const q = selectedQuestions[index];
  const qDiv = document.createElement('div');
  qDiv.className = 'question-block';
  qDiv.innerHTML = `<p><strong>Q${index + 1}:</strong> ${q.question}</p>`;
  q.options.forEach(option => {
    const label = document.createElement('label');
    label.innerHTML = `
      <input type="radio" name="option" value="${option}"> ${option}
    `;
    qDiv.appendChild(label);
  });
  optionsContainer.appendChild(qDiv);
  submitBtn.disabled = false;
}

function showResult() {
  resultScreen.classList.remove('hidden');
  let resultHtml = `You scored <span class="score">${score} out of ${totalQuestions}</span>!`;
  let wrongAnswers = [];
  selectedQuestions.forEach((q, idx) => {
    const userAnswer = q.userAnswer;
    if (userAnswer !== q.answer) {
      wrongAnswers.push({
        question: q.question,
        correct: q.answer,
        user: userAnswer || 'No answer selected'
      });
    }
  });
  if (wrongAnswers.length > 0) {
    resultHtml += '<br><br><strong>Correct answers for questions you missed:</strong><ul>';
    wrongAnswers.forEach(item => {
      resultHtml += `<li><b>${item.question}</b><br>Your answer: ${item.user}<br>Correct answer: ${item.correct}</li>`;
    });
    resultHtml += '</ul>';
  }
  resultText.innerHTML = resultHtml;
}

function decodeHTML(html) {
  var txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
}

function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}
