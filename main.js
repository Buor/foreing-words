//SECTIONS
const sectionEnterWords = document.querySelector(".enter_words")
const sectionTrainWords = document.querySelector(".train_words")

//ENTER WORDS
const textareaWords = document.getElementById("textareaInputWords")
const buttonEnterWords = document.getElementById("buttonEnterWords")
const enterWordsMessage = document.getElementById("enterWordsMessage")

//TRAIN WORDS
const inputWordTranslation = document.getElementById("inputWordTranslation")
const trainWordsWord = document.getElementById("trainWordsWord")
const trainWordsResult = document.querySelector(".train_words_result")
const buttonDontKnow = document.getElementById("buttonDontKnow")

//КНОПКИ ЗАГРУЗКИ И СОХРАНЕНИЯ
const buttonLoad = document.getElementById("buttonLoad")
const buttonSave = document.getElementById("buttonSave")

//СЕКЦИИ ЗАГРУЗКИ И СОХРАНЕНИЯ
const bubbleSections = document.querySelectorAll("._bubbleSection")
const bubbleWrappers = document.querySelectorAll("._bubbleWrapper")
const sectionSaveProgress = document.querySelector(".save_progress")
const sectionLoadProgress = document.querySelector(".load_progress")

const savedDataElement = document.getElementById("savedData")

const textareaLoadData = document.getElementById("textareaLoadData")
const buttonLoadData = document.getElementById("buttonLoadData")
//--------------------------------------//

//ОБЪЯВЛЕНИЕ ОСНОВНЫХ ПРОГРАММНЫХ ПЕРЕМЕННЫХ
let globalWordsArray = []
let currentWord = null
let currentWordIndex = null
//--------------------------------------//

//РЕГИСТРАЦИЯ ОБРАБОТЧИКОВ СОБЫТИЙ
buttonEnterWords.addEventListener("click", extractWordsFromTextarea)
inputWordTranslation.addEventListener("input", handleInputWordTranslationChange)
buttonDontKnow.addEventListener("click", skipWord)

bubbleSections.forEach((bubbleSection) =>
    bubbleSection.addEventListener("click", (e) => {
        bubbleSection.style.display = "none"
    })
)

bubbleWrappers.forEach((bubbleWrapper) =>
    bubbleWrapper.addEventListener("click", (e) => e.stopPropagation())
)

window.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        skipWord()
    }
})

buttonLoad.addEventListener(
    "click",
    (e) => (sectionLoadProgress.style.display = "flex")
)
buttonSave.addEventListener("click", (e) => {
    sectionSaveProgress.style.display = "flex"
    saveAndShowProgress()
})
//--------------------------------------//

//МГНОВЕННО ВЫПОЛНЯЕМЫЙ КОД
// sectionTrainWords.hidden = true
enterWordsMessage.hidden = true
bubbleSections.forEach(
    (bubbleSection) => (bubbleSection.style.display = "none")
)

//--------------------------------------//

//ФУНКЦИИ ПРОГРАММЫ
function extractWordsFromTextarea(e) {
    try {
        const wordsArray = Array.from(
            textareaWords.value
                .toLowerCase()
                .matchAll(
                    /(?<number>\d*)[).] (?<word>[^-]+)- ?(?<translations>[^\n]*)/g
                )
        )

        //Убрать лишние пробелы в словах
        for (let word of wordsArray) {
            word.groups.word = word.groups.word.trim()
        }

        globalWordsArray = wordsArray.map((word) => ({
            word: word.groups.word,
            translations: word.groups.translations
                .split(",")
                .map((translation) => translation.trim()),
            score: 0,
        }))

        toggleSectionsVisibility()
        refreshWord()
    } catch (e) {
        showTemporaryMessage()
    }
}

function handleInputWordTranslationChange(e) {
    if (
        currentWord.translations.some(
            (translation) => translation === e.target.value.toLowerCase()
        )
    ) {
        showResult("Правильно!", "green")
        currentWord.score++
        refreshWord()
    }
}

function skipWord(e) {
    showResult(
        `Переводы слову/фразе ${
            currentWord.word
        } - ${currentWord.translations.join(", ")}`
    )
    refreshWord()
}

function refreshWord() {
    let index = Math.floor(Math.random() * globalWordsArray.length)
    currentWord = globalWordsArray[index]
    currentWordIndex = index

    inputWordTranslation.value = ""
    trainWordsWord.innerHTML = currentWord.word
}

function toggleSectionsVisibility() {
    sectionTrainWords.hidden = false
    sectionEnterWords.hidden = true
}

function showResult(result, color = "white") {
    trainWordsResult.innerHTML = result
    trainWordsResult.style.color = color
}

//ФУНКЦИЯ, СОХРАНЯЮЩАЯ ПРОГРЕСС ИГРЫ
function saveAndShowProgress() {
    let savedData = {
        globalWordsArray,
        currentWord,
        currentWordIndex,
    }

    let savedDataJSON = JSON.stringify(savedData, null, 2)
    savedDataElement.textContent = savedDataJSON
}

//ФУНКЦИЯ, ЗАГРУЖАЮЩАЯ ПРОГРЕСС ИГРЫ
function loadProgress() {
    try {
        const loadedData = textareaLoadData.value
        const JSONParsedData = JSON.parse(loadedData)

        globalWordsArray = JSONParsedData.globalWordsArray
        refreshWord()
    } catch {
        console.log("Ошибка! Не удалось загрузить данные!")
        resetData()
    }
    let savedData = {
        globalWordsArray,
        currentWord,
        currentWordIndex,
    }

    let savedDataJSON = JSON.stringify(savedData, null, 2)
    savedDataElement.textContent = savedDataJSON
}
//--------------------------------------//

function resetData() {
    globalWordsArray = []
    currentWord = null
    currentWordIndex = null
}

function showMessage(messageElement, message, ms = -1) {
    messageElement.hidden = false
    messageElement.textContent = message
    
    if(ms !== -1)
        setTimeout(() => messageElement.hidden = true, ms)
}
