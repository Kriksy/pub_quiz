const textIntroContainer = document.getElementById("quiz-text-intro")
const topicsContainer = document.getElementById("quiz-topics")

const questionContainer = document.getElementById("quiz-question")
const optionsContainer = document.getElementById("quiz-options")
const resultContainer = document.getElementById("quiz-result")

const topics = quizData.map(quizTopicData => quizTopicData.topic)

/* 
    startQuizApp() är huvudfunktionen som startar appen. 
*/
function startQuizApp() {
    displayIntroText()
    displayTopicOptions()
}

/* 
    displayIntroText() uppdaterar HTML elementet med id "quiz-text-box" med intro text.
*/
function displayIntroText() {
    // 
    textIntroContainer.innerHTML = `
    <p>
    Hallå där och välkommen till vår pub-quiz!
    Här i vårt hörn av glädje och kloka huvuden, är det dags att sätta på sig tänkarmössan och välja ditt vapen ämne.
    </p>    
    <p>
    Tryck på ett ämne nedan och låt oss börja festen!
    </p>
    `
}

/* 
    displayTopicOptions() uppdaterar HTML element med id "quiz-topics" med knappval för quiz ämnen
*/
function displayTopicOptions() {
    // Hämta topics från quiz data (quiz.js)
    const topics = quizData.map(quizTopicData => quizTopicData.topic)
    // Skapa HTML knappar för varje ämne med en onclick funktion.
    topics.forEach(topic => {
        let topicElementButton = document.createElement("button")
        topicElementButton.id = `topic-button-${topic}`
        topicElementButton.innerText = topic
        topicElementButton.onclick = function () {
            displayConfirmQuizTopic(topic)
        }
        // Lägg till knapparna till div element
        topicsContainer.appendChild(topicElementButton)
    })
}

/* 
    displayConfirmQuizTopic() uppdaterar HTML element med id "quiz-topics" med knappval för quiz ämnen
*/
function displayConfirmQuizTopic(topic) {
    hideElement(topicsContainer)

    // Hämta intro text från det valde ämnet från quiz data (quiz.js)
    const topicIntro = quizData.find(element => element.topic == topic).introductionText

    // Uppdatera HTML quiz-text-box text med ämnets intro text
    textIntroContainer.innerText = topicIntro

    // Skapa en knapp med en onclick funktion för att påbörja quizet med valda ämnet
    let confirmTopicButtonElement = document.createElement("button")
    confirmTopicButtonElement.innerText = `Start Quiz`
    confirmTopicButtonElement.onclick = function () {
        startQuiz(topic)
    }

    topicsContainer.innerHTML = ""
    optionsContainer.innerHTML = ""
    optionsContainer.appendChild(confirmTopicButtonElement)
    showElement(optionsContainer)
}

/*  
    startQuiz() uppdaterar globala variabeln questions 
    och startar spelet genom att visa första frågan i listan av frågor från quiz.js
*/
function startQuiz(topic) {

    // Uppdatera globala variabeln "questions"
    questions = quizData.find(element => element.topic == topic).questions
    hideElement(textIntroContainer)
    displayQuestion()
}

/* 
    displayQuestion() uppdaterar sidan med nuvarande fråga
 */
function displayQuestion() {
    showElement(questionContainer)
    showElement(optionsContainer)
    questionContainer.innerHTML = ""
    optionsContainer.innerHTML = "";

    // Hämta nuvarande fråga
    const currentQuestion = questions[currentQuestionIndex];

    // Kontrollera om objektet för nuvarande fråga innehåller en bild som ska visas och behöver läggas till HTML elementet.
    if (currentQuestion.hasOwnProperty("image")) {
        questionContainer.innerHTML = `
        <div>
            <p>${currentQuestion.question}</p>
        </div>
        <div class="center">
            <img src="${currentQuestion.image}" class="question-image"/>
        </div>
        `
    } else {
        questionContainer.innerText = currentQuestion.question;
    }

    // Kontrollera om nuvarande frågan är en textfråga eller flervalsfråga. 
    if (currentQuestion.questionType == "text") { // Skapa text input för textfrågor

        const optionsWithInputElement = document.createElement("div")
        optionsWithInputElement.className = "quiz-options-with-input"


        const inputElement = document.createElement("input")
        inputElement.id = "input-answer"
        inputElement.type = "text"
        inputElement.placeholder = "Skriv din gissning!"
        const submitElement = document.createElement("button")
        submitElement.innerText = "Skicka gissning och gå vidare!"
        submitElement.onclick = function () {
            // Hämta text värdet från input HTML elementet vid klick
            const input = document.getElementById("input-answer")
            checkAnswerAndDisplayNext(input.value.trim())
        }
        optionsWithInputElement.appendChild(inputElement)
        optionsWithInputElement.appendChild(submitElement)
        optionsContainer.appendChild(optionsWithInputElement)
    } else { // Skapa knappar för flervalsfråga med alternativen som finns i "options" för nuvarande fråga (i quiz.js)

        currentQuestion.options.forEach((option) => {
            const buttonElement = document.createElement("button")
            buttonElement.innerText = option
            // Lägger till en onclick funktion för knappen som ska hanterar nästa handling
            buttonElement.onclick = () => checkAnswerAndDisplayNext(option);
            optionsContainer.appendChild(buttonElement)
        });


    }


}

/* 
    checkAnswerAndDisplayNext() kontrollerar svaret och visar nästa fråga
*/
function checkAnswerAndDisplayNext(userAnswer) {
    const currentQuestion = questions[currentQuestionIndex];
    // Kontrollera om svaret är rätt
    const correctGuess = userAnswer.toLowerCase() === currentQuestion.correctAnswer.toLowerCase()
    // Öka globala variabeln för användarens poäng om svaret är rätt
    if (correctGuess) {
        userScore++;
    }
    // Lägg till frågan med rätt svar, användarens svar och om det var rätt eller inte.
    result.push({
        question: currentQuestion.question,
        answer: currentQuestion.correctAnswer,
        userAnswer: userAnswer,
        correctGuess: correctGuess,
    })

    // Öka nuvarande index för att hämta nästa fråga
    currentQuestionIndex++;

    // Fortsätt visa nästa fråga tills att det inte finns några fler i listan "questions"
    if (currentQuestionIndex < questions.length) {
        displayQuestion();
    } else {


        displayResult();
    }
}

// displayResult() uppdaterar sidan och visar resultatet för användaren
function displayResult() {

    // Skapa p element med intro text
    const resultIntroElement = document.createElement("p")
    resultIntroElement.innerText = `Stort grattis! Du har just avslutat vårt episka quiz. Här är dina poäng – förhoppningsvis närmare stjärnorna än någonsin. Kom och fira med oss, för som vi säger: 'Inget quiz, ingen vinst, ingen fest!' Skål!`

    // Skapa tabell element med svar utifrån sparad resultat i den globala variabeln result
    const tableElement = document.createElement("table")
    const tableHeaderElement = document.createElement("tr")
    tableHeaderElement.innerHTML = `
    <th>Fråga</th>
    <th>Korrekt Svar</th>
    <th>Poäng</th>
    `
    tableElement.appendChild(tableHeaderElement)
    result.forEach(function (v) {
        const trElement = document.createElement("tr")
        trElement.innerHTML = `
        <td>${v.question}</td>
        <td>${v.answer}</td>
        <td>${v.correctGuess ? "1" : "0"}</td>
        `
        tableElement.appendChild(trElement)
    })

    // Skapa p element med summering av resultatet
    const resultScoreElement = document.createElement("p")
    resultScoreElement.innerText = `Ditt resultat: ${userScore} av ${questions.length} rätt!`
    resultScoreElement.className = "center"

    // Lägg till alla element in result containern
    resultContainer.innerHTML = ''
    resultContainer.appendChild(resultIntroElement)
    resultContainer.appendChild(tableElement)
    resultContainer.appendChild(resultScoreElement)

    hideElement(questionContainer)
    hideElement(optionsContainer)
    optionsContainer.innerHTML = ""
    showElement(resultContainer)
}

// hideElement() "gömmer" ett html element mha css .hide i styles.css 
function hideElement(htmlElement) {
    htmlElement.classList.add("hide")
}

// showElement() "visar" ett html element mha css .hide i styles.css 
function showElement(htmlElement) {
    htmlElement.classList.remove("hide")
}


// =====================================================
// Globala Variablar
// =====================================================
let userScore = 0;
let currentQuestionIndex = 0
let questions = []
let result = []

// Applikations Start
startQuizApp()
