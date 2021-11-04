const findForm = document.querySelector('.find-form')
const keywordInput = findForm.querySelector('.keyword')
const invalidFeedback = findForm.querySelector('.invalid-feedback')
const wordSection = document.querySelector('.word')
const speechAudio = document.querySelector('.speech-audio')

const getWord = async () => {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${keywordInput.value}`)
    const data = await response.json()
    const result = await data
    showWord(result[0])
}

findForm.addEventListener('submit', (e) => {
    e.preventDefault()
    if(keywordInput.value.length > 0) {
        getWord()
        invalidFeedback.innerText = ''
    } else {
        invalidFeedback.innerText = 'Please enter the word you wanna find.'
    }
})

const showWord = (result) => {
    if(!result) {
        let notyf = new Notyf({
            duration: 1800,
            types: [{type: 'error', background: 'grey'}]
        })
        notyf.open({type: 'error', message: 'Sorry your word not found.'})
    } else {
        wordSection.classList.add('open')
    }

    let partOfSpeechs = []
    let synonyms = []
    let antonyms = []

    result.meanings.forEach((meaning) => {
        partOfSpeechs.push(meaning.partOfSpeech)
    })

    let synonymResults = result.meanings[0].definitions[0].synonyms
    let antonymResults = result.meanings[0].definitions[0].antonyms
    let exampleResult = result.meanings[0].definitions[0].example

    synonymResults.forEach((synonymsResult) => {
        synonyms.push(synonymsResult)
    })
    
    antonymResults.forEach((antonymResult) => {
        antonyms.push(antonymResult)
    })

    let wordHTML = `<div class="container">
    <a role="button" class="back-link" onclick="backButton()">Find another word</a>
    <h1 class="title">${result.word}</h1>
    <p class="text-grey"><i class="fas fa-fw fa-volume-up speech-btn" onclick="playSpeech(this)" data-audio="${result.phonetics[0].audio}"></i>${result.phonetics[0].text}</p>
    <ul class="details">
        <li>
            <p>Origin</p>
            <p class="text-grey">${(result.origin) ? result.origin : 'Unknown'}</p>
        </li>
        <li>
            <p>Part of Speech</p>
            <p class="text-grey">${partOfSpeechs.join(', ')}</p>
        </li>
        <li>
            <p>Definition</p>
            <p class="text-grey">${result.meanings[0].definitions[0].definition}</p>
        </li>
        <li>
            <p>Example</p>
            <p class="text-grey">${(exampleResult) ? exampleResult : '-'}</p>
        </li>
        <li>
            <p>Synonyms</p>
            <p class="text-grey">${(synonyms <= 0) ? '-' : synonyms.join(', ')}</p>
        </li>
        <li>
            <p>Antonyms</p>
            <p class="text-grey">${(antonyms <= 0) ? '-' : antonyms.join(', ')}</p>
        </li>
    </ul>
</div>`

    wordSection.innerHTML = wordHTML
}

const backButton = () => {
    wordSection.classList.remove('open')
}

const playSpeech = (el) => {
    speechAudio.src = el.getAttribute('data-audio')
    speechAudio.play()
}