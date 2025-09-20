const wordInput = document.getElementById("word-input");
const defineButton = document.getElementById("word-button");
const phoneticContainer = document.getElementById("phonetic-display");
const synonymContainer = document.getElementById("synonym-display");
const defContainer = document.getElementById("definition-display");
const audioPlayer = document.getElementById("audio");
const previousWordDisplay = document.getElementById("prev-word-display");

const previousWords = [];

defineButton.addEventListener("click", function () {
  const word = wordInput.value;
  defineWord(word);
});

const defineWord = (word) => {
  fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
      displayWordInfo(data);
    })
    .catch((error) => {
      displayError(error);
      console.error(error);
    });
};

const displayWordInfo = (data) => {
  const dataObject = data[0];
  const word = dataObject.word;

  const wordDisplay = document.getElementById("display-word");
  wordDisplay.textContent = `${word}`;

  if (!previousWords.includes(word)) {
    previousWords.push(word);
  } else {
    console.log(`${word} already in Word Library`);
  }

  phoneticContainer.textContent = "";
  synonymContainer.textContent = "";
  defContainer.textContent = "";
  audioPlayer.src = "";

  phoneticContainer.textContent = "PHONETICS";
  synonymContainer.textContent = "SYNONYMS";
  defContainer.textContent = "DEFINITIONS";

  dataObject.phonetics.forEach((audio) => {
    audioPlayer.src = audio.audio;
    console.log(audio.audio);
  });

  dataObject.phonetics.forEach((phonetic) => {
    const displayPhonetic = document.createElement("p");
    displayPhonetic.textContent = phonetic.text;
    phoneticContainer.appendChild(displayPhonetic);
  });

  dataObject.meanings.forEach((meaning) => {
    meaning.synonyms.forEach((synonym) => {
      const displaySynonym = document.createElement("p");
      displaySynonym.textContent = `${synonym}`;
      synonymContainer.appendChild(displaySynonym);
    });

    meaning.definitions.forEach((definition) => {
      const definitionList = document.createElement("ul");
      const liElement = document.createElement("li");
      liElement.textContent = `${meaning.partOfSpeech}: ${definition.definition}`;
      definitionList.appendChild(liElement);
      defContainer.appendChild(definitionList);
    });
  });
  if (synonymContainer.textContent === "SYNONYMS") {
    const displayError = document.createElement("p");
    displayError.textContent = "No Synonyms found.";
    synonymContainer.appendChild(displayError);
  }
  if (phoneticContainer.textContent === "PHONETICS") {
    const displayError = document.createElement("p");
    displayError.textContent = "No Phonetics found.";
    phoneticContainer.appendChild(displayError);
  }
  if (defContainer.textContent === "DEFINITIONS") {
    const displayError = document.createElement("p");
    displayError.textContent = "No Defintions found.";
    defContainer.appendChild(displayError);
  }

  if (previousWords.length > 0) {
    displaypreviousWords();
    console.log(previousWords);
  }
};

const displayError = (error) => {
  phoneticContainer.textContent = "";
  synonymContainer.textContent = "";
  defContainer.textContent = "";
  audioPlayer.src = "";
  const errorDisplay = document.getElementById("display-word");
  errorDisplay.textContent = `Ran into an error looking your word up, please try again...`;
};

const displaypreviousWords = () => {
  previousWordDisplay.style.display = "";
  const itemList = document.createElement("ul");
  previousWordDisplay.textContent = "";
  previousWordDisplay.textContent = "WORD LIBRARY";

  previousWords.forEach((word) => {
    const listWord = document.createElement("li");
    listWord.textContent = word;
    itemList.appendChild(listWord);
  });
  previousWordDisplay.appendChild(itemList);
};

if (previousWords.length === 0) {
  previousWordDisplay.style.display = "none";
}
