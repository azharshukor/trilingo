const { pinyin } = require('pinyin');

var languages = {
    English: { code: "en-GB", voice: "en-GB-Standard-B" },
    Malay: { code: "ms-MY", voice: "ms-MY-Standard-C" },
    Chinese: { code: "cmn-CN", voice: "cmn-CN-Standard-A" },
    Tamil: { code: "ta-IN", voice: "ta-IN-Standard-D" },
    Korean: { code: "ko-KR", voice: "ko-KR-Neural2-A" },
    Japanese: { code: "ja-JP", voice: "ja-JP-Neural2-B" },
    Arabic: { code: "ar-XA", voice: "ar-XA-Standard-C" }
  };
  var languageCode1;
  var languageCode2;
  var languageCode3;
  var voiceName1;
  var voiceName2;
  var voiceName3;
  var selectedLanguages = [];
  document.querySelectorAll(".language-button").forEach((button) => {
    button.addEventListener("click", () => {
      const language = button.getAttribute("data-language");
      if (selectedLanguages.includes(language)) {
        const index = selectedLanguages.indexOf(language);
        if (index > -1) {
          selectedLanguages.splice(index, 1);
          button.classList.remove("selected");
        }
      } else if (selectedLanguages.length < 2) {
        selectedLanguages.push(language);
        button.classList.add("selected");
      }
      if (selectedLanguages.length === 2) {
        document.getElementById("selectLanguagesButton").disabled = false;
      } else {
        document.getElementById("selectLanguagesButton").disabled = true;
      }
    });
  });
  document.getElementById("selectLanguagesButton").addEventListener("click", () => {
    if (selectedLanguages.length === 2) {
      languageCode1 = languages.English.code;
      voiceName1 = languages.English.voice;
      languageCode2 = languages[selectedLanguages[0]].code;
      voiceName2 = languages[selectedLanguages[0]].voice;
      languageCode3 = languages[selectedLanguages[1]].code;
      voiceName3 = languages[selectedLanguages[1]].voice;
      document.getElementById("languageSelectionScreen").style.display = "none";
      document.getElementById("mainAppScreen").style.display = "block";
    }
  });
  var wordList = [
    "lion", 
    "tiger", 
    "cat",
    "wolf",
    "fox",
    "yak",
    "hyena",
    "porcupine",
    "numbat",
    "weasel",
    "racoon",
    "otter",
    "squirrel",
    "dog",
    "leopard",
    "cheetah",
    "rhinoceros",
    "reindeer",
    "koala bear",
    "buffalo",
    "donkey",
    "camel",
    "tapir",
    "wombat",
    "gorila",
    "zebra",
    "horse",
    "deer",
    "pig",
    "hippopotamus",
    "panda",
    "polar bear",
    "bear",
    "rabbit",
    "cow",
    "sheep",
    "goat",
    "chicken",
    "giraffe",
    "monkey",
    "elephant",
    "kangaroo",
    "shark",
    "stingray",
    "octopus",
    "walrus",
    "sea lion",
    "jellyfish", 
    "dolphin",
    "whale",
    "fish",
    "turtle",
    "tortoise",
    "penguin",
    "swan",
    "duck",
    "goose",
    "turkey",
    "peacock",
    "toucan",
    "flamingo",
    "hummingbird",
    "owl",
    "woodecker",
    "eagle",
    "sparrow",
    "pigeon",
    "bull",
    "crow",
    "bird",
    "butterfly",
    "spider",
    "ant",
    "lizard",
    "taxi",
    "car",
    "bus",
    "fire engine",
    "garbage truck",
    "truck",
    "bicycle",
    "motorcycle",
    "ambulance",
    "van",
    "train",
    "boat",
    "ship",
    "helicopter",
    "airplane",
    "tractor",
    "eyes",
    "eye",
    "nose",
    "ear",
    "ears",
    "mouth",
    "hair",
    "face",
    "neck",
    "shoulder",
    "hand",
    "hands",
    "elbow",
    "arm",
    "knee",
    "feet",
    "leg",
    "fingers",
    "finger",
    "apple",
    "banana",
    "grapes",
    "strawberry",
    "watermelon",
    "pineapple",
    "peach",
    "pear",
    "mango",
    "kiwi",
    "blueberry",
    "raspberry",
    "cherry",
    "durian",
    "plum",
    "lemon",
    "lime",
    "papaya",
    "coconut",
    "honeydew",
    "starfruit",
    "jackfruit",
    "rambutan",
    "orange",
    "spoon",
    "fork",
    "chopsticks",
    "butter knife",
    "knife",
    "plate",
    "bowl",
    "cup",
    "bottle",
    "toy",
    "door",
    "gate",
    "remote control",
    "fan"
  ];


document.getElementById('onCameraButton').addEventListener('click', function() { 
        clearResults();
    document.getElementById('fileInput').click();
    document.getElementById('welcomeMessage').style.display = 'none';
    
});

 document.getElementById('fileInput').addEventListener('change', function(event) {
            var file = event.target.files[0];
            if (file) {
                var reader = new FileReader();
                reader.onload = function(e) {
                    var imgUrl = e.target.result;
                    var capturedImage = document.getElementById('capturedImage');
                    capturedImage.src = imgUrl;
                    capturedImage.style.display = 'block';

                    // Call the recognizeImage function with the image data
                    recognizeImage(imgUrl);
                };
                reader.readAsDataURL(file);
            }
        });


function clearResults() {
            // Hide all buttons and result message
            document.getElementById('Button1').classList.add('hidden');
            document.getElementById('Button2').classList.add('hidden');
            document.getElementById('Button3').classList.add('hidden');
            document.getElementById('sorryText').style.display = 'none'; // Hide sorry message
            document.getElementById('translationButtons').style.display = 'none'; // Hide translation buttons

            // Hide loading text
            document.getElementById('loadingText').style.display = 'none';
          
        }
     
 
 function recognizeImage(imgData) {
    // Display loading text
    document.getElementById('loadingText').style.display = 'block';

    // Google Vision API key
    const visionApiKey = "AIzaSyCzicyAtpPgLWc6OeZ1AfodA1x4A2LlqY4";

    // URL for Google Vision API
    const visionApiUrl = `https://vision.googleapis.com/v1/images:annotate?key=${visionApiKey}`;

    // Request body for the API
    const requestBody = JSON.stringify({
        requests: [
            {
                image: {
                    content: imgData.split(',')[1] // Extract Base64-encoded image data
                },
                features: [
                    {
                        type: "LABEL_DETECTION"
                    }
                ]
            }
        ]
    });

    fetch(visionApiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: requestBody
    })
    .then(response => response.json())
    .then(data => {
        var labels = data.responses[0].labelAnnotations.map(label => label.description.toLowerCase());
        var wordListLowercase = wordList.map(word => word.toLowerCase());

        if (labels.length === 0) {
            // If no labels are recognized, display sorry message
            document.getElementById('sorryText').style.display = 'block';
            // Hide loading text
            document.getElementById('loadingText').style.display = 'none';
        } else {
            var Text1 = "-";
            for (var i = 0; i < wordListLowercase.length; i++) {
                if (labels.includes(wordListLowercase[i])) {
                    Text1 = wordList[i]; // Use the original word, not the lowercase version
                    break;
                }
            }

            if (Text1 === "-") {
                // If no matching word is found, display sorry message
                document.getElementById('sorryText').style.display = 'block';
                // Hide loading text
                document.getElementById('loadingText').style.display = 'none';
            } else {
                // Translate English text to Malay
                translateText(Text1, languageCode1, languageCode2).then(Translation2 => {
                    // Translate English text to Chinese (Singapore)
                    translateText(Text1, languageCode1, languageCode3).then(Translation3 => {
                        // Hide loading text
                        document.getElementById('loadingText').style.display = 'none';
                        
                         // Display English button
                       document.getElementById('Button1').innerHTML = `${Text1} <img src="speak-button.png" class="speak-icon" alt="Speak" /> `;
                        document.getElementById('Button1').classList.remove('hidden');
 

                        // Display Translated buttons
if (languageCode2 === "cmn-CN") {
var pinyinTranslation = pinyin(Translation2);
                       var pinyinText = pinyinTranslation.flat();
                       var pinyinspace = pinyinText.join(" ");
document.getElementById('Button2').innerHTML = `${Translation2}   /   ${pinyinspace} <img src="speak-button.png" class="speak-icon" alt="Speak"/>`;
document.getElementById('Button2').setAttribute('data-chinese', Translation2);
} else {
document.getElementById('Button2').innerHTML = `${Translation2} <img src="speak-button.png" class="speak-icon" alt="Speak"/>`;
}

document.getElementById('Button2').classList.remove('hidden');
                        
if (languageCode3 === "cmn-CN") {
var pinyinTranslation = pinyin(Translation3);
                       var pinyinText = pinyinTranslation.flat();
                       var pinyinspace = pinyinText.join(" ");
document.getElementById('Button3').innerHTML = `${Translation3}   /   ${pinyinspace} <img src="speak-button.png" class="speak-icon" alt="Speak"/>`;
document.getElementById('Button3').setAttribute('data-chinese', Translation3);
} else {
document.getElementById('Button3').innerHTML = `${Translation3} <img src="speak-button.png" class="speak-icon" alt="Speak"/>`;
}
document.getElementById('Button3').classList.remove('hidden');
                
                                 
                        
// Show all translation buttons together
                        document.getElementById('translationButtons').style.display = 'block';

                        document.getElementById('fileInput').value = '';
                    });
                });
            }
        }
    })
    .catch((error) => {
        console.error('Error:', error);
        // Hide loading text
        document.getElementById('loadingText').style.display = 'none';
        // Display error message
        document.getElementById('result').innerText = "An error occurred. Please try again.";
    });
}

        async function translateText(text, sourceLang, targetLang) {
            const translateApiKey = "AIzaSyClrPxLer-VRuWIwtp_9v0xwCViUve5HMc";
            const translateApiUrl = `https://translation.googleapis.com/language/translate/v2?key=${translateApiKey}`;
            const requestBody = JSON.stringify({
                q: text,
                source: sourceLang,
                target: targetLang,
                format: 'text',
                model: 'base'
            });

            const response = await fetch(translateApiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: requestBody
            });

            const data = await response.json();
            return data.data.translations[0].translatedText;
        }
        
         async function speak(text, language, callback) {
    var apiKey = 'AIzaSyDQUaEzdQy4i-5thYcP4OA5rzMfMYc5BMM';
    
    var voiceName;
    var languageCode;
    switch (language) {
        case languageCode1:
            voiceName = voiceName1;
            languageCode = languageCode1;
            break;
        case languageCode2:
            voiceName = voiceName2;
            languageCode = languageCode2;
            break;
        case languageCode3:
            voiceName = voiceName3;
            languageCode = languageCode3;
            break;
        default:
            voiceName = voiceName1;
            languageCode = languageCode1;
    }

    var url = 'https://texttospeech.googleapis.com/v1/text:synthesize?key=' + apiKey;

    var requestBody = JSON.stringify({
        input: {
            text: text
        },
        voice: {
            name: voiceName,
            languageCode: languageCode
        },
        audioConfig: {
            audioEncoding: 'LINEAR16'
        }
    });

    fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: requestBody
        })
        .then(response => response.json())
        .then(data => {
            var audioContent = data.audioContent;
            var audioData = 'data:audio/wav;base64,' + audioContent;
            var audio = new Audio(audioData);
            
            // Identify the corresponding button
            var buttonId;
            switch (language) {
                case languageCode1:
                    buttonId = 'Button1';
                    break;
                case languageCode2:
                    buttonId = 'Button2';
                    break;
                case languageCode3:
                    buttonId = 'Button3';
                    break;
            }

            var button = document.getElementById(buttonId);
            button.classList.add('playing'); // Add the 'playing' class

            audio.addEventListener('ended', function() {
                button.classList.remove('playing'); // Remove the 'playing' class when audio ends
                if (callback && typeof callback === 'function') {
                    callback();
                }
            });

            setTimeout(function() {
                audio.play();
            }, 600);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

document.addEventListener('DOMContentLoaded', function() {
    // Add event listener for English button
    document.getElementById('Button1').addEventListener('click', function() {
        var textA = document.getElementById('Button1').innerText;
        speak(textA, languageCode1)
    });

    // Add event listener for Malay button
    document.getElementById('Button2').addEventListener('click', function() {
    if (languageCode2 === "cmn-CN") {
    var textB = document.getElementById('Button2').getAttribute('data-chinese');
    speak(textB, languageCode2);
    } else {
        var textB = document.getElementById('Button2').innerText;
        speak(textB, languageCode2);
        }
    });

    // Add event listener for Chinese button
    document.getElementById('Button3').addEventListener('click', function() {
    if (languageCode3 === "cmn-CN") {
    var textC = document.getElementById('Button3').getAttribute('data-chinese'); 
    speak(textC, languageCode3);
    } else {
        var textC = document.getElementById('Button3').innerText;
        speak(textC, languageCode3);
    }
    });
});



