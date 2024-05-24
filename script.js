const { pinyin } = require('pinyin');

var wordList = [
      	"lion",
       	"tiger",
        "cat", 
        "dog",
        "zebra",
        "horse",
        "deer",
        "pig",
        "hippopotamus",
        "panda",
        "bear",
        "rabbit",
        "cow",
        "sheep",
        "giraffe",
        "monkey",
        "elephant",
        "kangaroo",
        "dolphin",
        "whale",
        "fish",
        "turtle",
        "penguin",
        "parrot",
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
        "rasberry",
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
	"fan",    
];

var firstTimeTriggered = true;

        document.getElementById('onCameraButton').addEventListener('click', function() { 
    // Clear previous results
    clearResults();

    // Trigger file input
    document.getElementById('fileInput').click();

    // Hide welcome message after first trigger
    if (firstTimeTriggered) {
        document.getElementById('welcomeMessage').style.display = 'none';
        firstTimeTriggered = false;
    }
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
            document.getElementById('englishButton').classList.add('hidden');
            document.getElementById('malayButton').classList.add('hidden');
            document.getElementById('chineseButton').classList.add('hidden');
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
            var englishText = "-";
            for (var i = 0; i < wordListLowercase.length; i++) {
                if (labels.includes(wordListLowercase[i])) {
                    englishText = wordList[i]; // Use the original word, not the lowercase version
                    break;
                }
            }

            if (englishText === "-") {
                // If no matching word is found, display sorry message
                document.getElementById('sorryText').style.display = 'block';
                // Hide loading text
                document.getElementById('loadingText').style.display = 'none';
            } else {
                // Translate English text to Malay
                translateText(englishText, 'en', 'ms').then(malayTranslation => {
                    // Translate English text to Chinese (Singapore)
                    translateText(englishText, 'en', 'zh-CN').then(chineseTranslation => {
                        // Hide loading text
                        document.getElementById('loadingText').style.display = 'none';

                        // Display Malay and Chinese buttons
                       document.getElementById('malayButton').innerHTML = `${malayTranslation} <img src="speak-button.png" class="speak-icon" alt="Speak"/>`;
                        document.getElementById('malayButton').classList.remove('hidden');

                        var pinyinTranslation = pinyin(chineseTranslation);
                       var pinyinText = pinyinTranslation.flat();
                       var pinyinspace = pinyinText.join(" ");
                        document.getElementById('chineseButton').innerHTML = `${chineseTranslation}   /   ${pinyinspace} <img src="speak-button.png" class="speak-icon" alt="Speak" /> `;
                        document.getElementById('chineseButton').setAttribute('data-chinese', chineseTranslation);
                        document.getElementById('chineseButton').classList.remove('hidden');

                        // Display English button
                       document.getElementById('englishButton').innerHTML = `${englishText} <img src="speak-button.png" class="speak-icon" alt="Speak" /> `;
                        document.getElementById('englishButton').classList.remove('hidden');

                        // Show all translation buttons together
                        document.getElementById('translationButtons').style.display = 'block';

                        // Automatic Play (Works on desktop only)
                        // speak(englishText, 'en', () => {
                        // speak(malayTranslation, 'ms', () => {
                        // speak(chineseTranslation, 'zh');
                        // });
                        // });

                        // Reset file input value
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
        case 'en':
            voiceName = 'en-GB-Standard-B';
            languageCode = 'en-GB';
            break;
        case 'ms':
            voiceName = 'ms-MY-Standard-C';
            languageCode = 'ms-MY';
            break;
        case 'zh':
            voiceName = 'cmn-CN-Standard-A';
            languageCode = 'cmn-CN';
            break;
        default:
            voiceName = 'en-GB-Standard-B';
            languageCode = 'en-GB';
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
                case 'en':
                    buttonId = 'englishButton';
                    break;
                case 'ms':
                    buttonId = 'malayButton';
                    break;
                case 'zh':
                    buttonId = 'chineseButton';
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
    document.getElementById('englishButton').addEventListener('click', function() {
        var englishText = document.getElementById('englishButton').innerText;
        speak(englishText, 'en');
    });

    // Add event listener for Malay button
    document.getElementById('malayButton').addEventListener('click', function() {
        var malayText = document.getElementById('malayButton').innerText;
        speak(malayText, 'ms');
    });

    // Add event listener for Chinese button
    document.getElementById('chineseButton').addEventListener('click', function() {
        var chineseText = document.getElementById('chineseButton').getAttribute('data-chinese');       
        speak(chineseText, 'zh');
    });
});



