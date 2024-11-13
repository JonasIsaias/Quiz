const quizData = [
    { question: "O que é uma variável em JavaScript?", options: ["Um valor que não pode ser alterado", "Um tipo de dado fixo", "Um espaço de memória para armazenar dados", "Uma função que retorna um valor"], answer: "Um espaço de memória para armazenar dados" },
    { question: "Qual é o método para adicionar um item no final de um array?", options: ["push()", "pop()", "shift()", "unshift()"], answer: "push()" },
    { question: "O que faz a palavra-chave 'let' em JavaScript?", options: ["Declara uma variável que pode ser reatribuída", "Declara uma constante que não pode ser reatribuída", "Cria uma função anônima", "Define um tipo de dado"], answer: "Declara uma variável que pode ser reatribuída" },
    { question: "Qual é o operador usado para comparar igualdade em JavaScript?", options: ["==", "===", "!=", "!=="], answer: "===" },
    { question: "O que a função `parseInt('10')` retorna em JavaScript?", options: ["'10'", "10", "NaN", "undefined"], answer: "10" },
    { question: "Como você cria uma função anônima em JavaScript?", options: ["function() {}", "() => {}", "function: {}", "function anon() {}"], answer: "() => {}" },
    { question: "Qual é o resultado de `[] + []` em JavaScript?", options: ["[]", "NaN", "'' (string vazia)", "Error"], answer: "'' (string vazia)" },
    { question: "O que a palavra-chave `const` faz em JavaScript?", options: ["Declara uma variável que não pode ser reatribuída", "Declara uma variável que pode ser reatribuída", "Declara uma constante que é imutável", "Declara uma função"], answer: "Declara uma variável que não pode ser reatribuída" },
    { question: "O que é uma 'closure' em JavaScript?", options: ["Uma função dentro de outra função", "Uma função que retorna outra função", "Uma função que acessa variáveis de seu escopo externo", "Um tipo de objeto especial"], answer: "Uma função que acessa variáveis de seu escopo externo" },
    { question: "O que significa 'hoisting' em JavaScript?", options: ["Eleva a declaração das variáveis para o topo do código", "Atribui um valor para as variáveis automaticamente", "Define a ordem de execução do código", "Não há nada chamado hoisting"], answer: "Eleva a declaração das variáveis para o topo do código" }
];

let currentQuestionIndex = 0;
let userAnswers = new Array(quizData.length).fill(null);
let score = 0;
let timer;
let timeLeft = 60;

document.getElementById("start-btn").addEventListener("click", startQuiz);
document.getElementById("next-btn").addEventListener("click", nextQuestion);
document.getElementById("prev-btn").addEventListener("click", prevQuestion);
document.getElementById("submit-btn").addEventListener("click", submitQuiz);
document.getElementById("reset-btn").addEventListener("click", resetQuiz);

function startQuiz() {
    loadProgress();
    toggleVisibility("start-screen", false);
    toggleVisibility("quiz-container", true);
    resetTimer();
    loadQuestion();
    updateProgressBar();
}

function loadQuestion() {
    const { question, options } = quizData[currentQuestionIndex];
    document.getElementById("question-container").textContent = question;
    
    const optionsContainer = document.getElementById("options-container");
    optionsContainer.innerHTML = '';
    options.forEach(option => createOptionButton(option, optionsContainer));

    const savedAnswer = userAnswers[currentQuestionIndex];
    if (savedAnswer) {
        selectSavedAnswer(savedAnswer, optionsContainer);
    } else {
        document.getElementById("next-btn").disabled = true;
    }
}

function createOptionButton(option, container) {
    const button = document.createElement("button");
    button.textContent = option;
    button.classList.add("option-btn");
    button.onclick = () => handleAnswerSelection(option, button);
    container.appendChild(button);
}

function handleAnswerSelection(answer, button) {
    userAnswers[currentQuestionIndex] = answer;
    saveProgress();

    document.querySelectorAll(".option-btn").forEach(btn => btn.disabled = true);
    button.classList.add("selected");
    document.getElementById("next-btn").disabled = false;
}

function nextQuestion() {
    if (currentQuestionIndex < quizData.length - 1) {
        currentQuestionIndex++;
        loadQuestion();
        updateProgressBar();
    } else {
        validateAllAnswers();
    }
}

function prevQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        loadQuestion();
        updateProgressBar();
    }
}

function validateAllAnswers() {
    if (userAnswers.every(answer => answer !== null)) {
        showResult();
    } else {
        document.getElementById("error-message").textContent = "Responda todas as perguntas antes de enviar.";
        currentQuestionIndex = userAnswers.findIndex(answer => answer === null);
        loadQuestion();
    }
}

function submitQuiz() {
    clearInterval(timer);
    calculateScore();
    displayIncorrectAnswers();
    toggleVisibility("quiz-container", false);
    toggleVisibility("result-container", true);
    clearProgress();
}

function calculateScore() {
    score = userAnswers.reduce((acc, answer, index) => acc + (answer === quizData[index].answer ? 1 : 0), 0);
    document.getElementById("score").textContent = `Você acertou ${score} de ${quizData.length} perguntas!`;
}

function displayIncorrectAnswers() {
    const incorrectList = document.getElementById("incorrect-list");
    incorrectList.innerHTML = '';
    quizData.forEach((question, index) => {
        if (userAnswers[index] !== question.answer) {
            const li = document.createElement("li");
            li.innerHTML = `<strong>Q${index + 1}: ${question.question}</strong><br>
                            Sua resposta: <span class="incorrect">${userAnswers[index] || "Nenhuma resposta"}</span><br>
                            Resposta correta: <span class="correct-answer">${question.answer}</span>`;
            incorrectList.appendChild(li);
        }
    });
}

function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById("timer").textContent = `Tempo restante: ${timeLeft}s`;

        if (timeLeft <= 0) {
            clearInterval(timer);
            alert("Tempo esgotado! O quiz será finalizado.");
            submitQuiz();
        }
    }, 1000);
}

function resetTimer() {
    clearInterval(timer);
    timeLeft = 60;
    startTimer();
}

function resetQuiz() {
    clearInterval(timer); // Pausar o timer para resetá-lo
    currentQuestionIndex = 0;
    userAnswers.fill(null);
    score = 0;
    timeLeft = 60;

    const errorMessage = document.getElementById("error-message");
    if (errorMessage) {
        errorMessage.textContent = ''; // Limpar qualquer mensagem de erro
    }

    toggleVisibility("result-container", false);
    toggleVisibility("start-screen", true);
    toggleVisibility("quiz-container", false);
    
    updateProgressBar();
    clearProgress();
    startTimer();  
}

function updateProgressBar() {
    const progressBar = document.getElementById("progress-bar");
    if (progressBar) {
        const progressPercentage = (currentQuestionIndex / quizData.length) * 100;
        progressBar.style.width = progressPercentage + "%";
    }
}

function toggleVisibility(elementId, isVisible) {
    document.getElementById(elementId).classList.toggle("hidden", !isVisible);
}

// Funções de localStorage
function saveProgress() {
    const quizState = {
        currentQuestionIndex,
        userAnswers,
        timeLeft
    };
    localStorage.setItem("quizState", JSON.stringify(quizState));
}

function loadProgress() {
    const savedProgress = localStorage.getItem("quizState");
    if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        currentQuestionIndex = progress.currentQuestionIndex;
        userAnswers = progress.userAnswers;
        timeLeft = progress.timeLeft;

        toggleVisibility("start-screen", false);
        toggleVisibility("quiz-container", true);
        loadQuestion();
        startTimer();
    }
}

function clearProgress() {
    localStorage.removeItem("quizState");
}

function selectSavedAnswer(savedAnswer, container) {
    const selectedOption = Array.from(container.children).find(btn => btn.textContent === savedAnswer);
    if (selectedOption) {
        selectedOption.classList.add("selected");
        selectedOption.disabled = true;
    }
}