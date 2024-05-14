    document.getElementById('onCameraButton').addEventListener('click', function() {
            document.getElementById('fileInput').click();
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

                    // Call the recognizeImage function with the image URL and column number
                    recognizeImage(imgUrl, 1); // Assuming default column is 1
                };
                reader.readAsDataURL(file);
            }
        });
        
    function prioritizeLabels(labels) {
        // Define the preferred labels and their order
        const preferredLabels = [
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

        // Filter out labels that are not in the preferred list
        const filteredLabels = labels.filter(label => preferredLabels.includes(label.toLowerCase()));

        // Sort the filtered labels based on their index in the preferred list
        filteredLabels.sort((a, b) => {
            return preferredLabels.indexOf(a.toLowerCase()) - preferredLabels.indexOf(b.toLowerCase());
        });

        return filteredLabels;
    }

    function recognizeImage(imgUrl) {
        fetch('https://vision.googleapis.com/v1/images:annotate?key=AIzaSyClrPxLer-VRuWIwtp_9v0xwCViUve5HMc', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "requests": [
                    {
                        "image": {
                            "content": imgUrl.split(",")[1] // Extracting base64 data
                        },
                        "features": [
                            {
                                "type": "LABEL_DETECTION"
                            }
                        ]
                    }
                ]
            }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.responses && data.responses[0] && data.responses[0].labelAnnotations && data.responses[0].labelAnnotations.length > 0) {
                const labels = data.responses[0].labelAnnotations.map(annotation => annotation.description);
                const prioritizedLabels = prioritizeLabels(labels);
                if (prioritizedLabels.length > 0) {
                    const recognitionResult = {
                        English: prioritizedLabels[0],
                        Malay: "",
                        Chinese: ""
                    };
                    translateText(recognitionResult.English, 'en', 'ms').then(malayText => {
                        recognitionResult.Malay = malayText;
                        return translateText(recognitionResult.English, 'en', 'zh-CN');
                    }).then(chineseText => {
                        recognitionResult.Chinese = chineseText;
                        return getPinyin(chineseText, 'zh-SG');
                    }).then(pinyin => {
                        recognitionResult["Pinyin Tones"] = pinyin;
                        displayResult(recognitionResult);
                    }).catch(error => {
                        console.error('Error translating text:', error);
                        displayResult(recognitionResult);
                    });
                } else {
                displayTryAgain();
            }
        } else {
            displayTryAgain();
        }
    })
    .catch(error => {
        console.error('Error recognizing image:', error);
    });
}

function displayTryAgain() {
    clearResults();

 	var resultDiv = document.getElementById('result');
    var text = document.createElement('p');
    text.classList.add('result-text');
    text.classList.add('try-again-text'); // Apply the custom CSS class
    text.textContent = "Oh no! We couldn't tell what that is. Please try again.";

    resultDiv.appendChild(text);
}

    function displayResult(recognitionResult) {
        clearResults();
        for (var language in recognitionResult) {
            var resultDiv = document.getElementById('result');
            var columnDiv = document.createElement('div');
            columnDiv.classList.add('result-column');

            var heading = document.createElement('h2');
            heading.classList.add('result-heading');
            heading.textContent = language + ":";

            var text = document.createElement('p');
            text.classList.add('result-text');
            var wordSpan = document.createElement('span');
            wordSpan.classList.add('word');
            wordSpan.textContent = recognitionResult[language];
            text.innerHTML = '<img class="play-button" src="playbutton.png"/>';
            text.innerHTML += '<br>';
            text.appendChild(wordSpan);
	    

            if (language === 'Chinese') {
                var pinyinSpan = document.createElement('span');
                pinyinSpan.classList.add('pinyin');
                pinyinSpan.textContent = recognitionResult["Pinyin Tones"];
                text.appendChild(document.createElement('br')); // Add line break
                text.appendChild(pinyinSpan);
                columnDiv.appendChild(heading);
                columnDiv.appendChild(text);
                resultDiv.appendChild(columnDiv);
            } else {
                columnDiv.appendChild(heading);
                columnDiv.appendChild(text);
                resultDiv.appendChild(columnDiv);
            }
  
        }
    }

    document.getElementById('fileInput').addEventListener('change', function(event) {
    // Display loading message
    displayLoadingMessage();

    var file = event.target.files[0];
    if (file) {
        var reader = new FileReader();
        reader.onload = function(e) {
            var imgUrl = e.target.result;
            var capturedImage = document.getElementById('capturedImage');
            capturedImage.src = imgUrl;
            capturedImage.style.display = 'block';

            // Call the recognizeImage function with the image URL
            recognizeImage(imgUrl);
        };
        reader.readAsDataURL(file);
    }
});

function displayLoadingMessage() {
    var resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '<p>Loading...</p>';
}
	
    function clearResults() {
        var resultDiv = document.getElementById('result');
        resultDiv.innerHTML = '';
    }

    async function translateText(text, sourceLanguage, targetLanguage) {
        const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=AIzaSyClrPxLer-VRuWIwtp_9v0xwCViUve5HMc&q=${encodeURIComponent(text)}&source=${sourceLanguage}&target=${targetLanguage}&format=text&model=base`, {
            method: 'POST'
        });
        const data = await response.json();
        if (data && data.data && data.data.translations && data.data.translations.length > 0) {
            return data.data.translations[0].translatedText;
        } else {
            throw new Error('Translation failed');
        }
    }

    async function getPinyin(chineseWord, sourceLanguage) {
        const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=AIzaSyClrPxLer-VRuWIwtp_9v0xwCViUve5HMc&q=${encodeURIComponent(chineseWord)}&source=${sourceLanguage}&target=${sourceLanguage}&format=text&model=base`, {
            method: 'POST'
        });
        const data = await response.json();
        if (data && data.data && data.data.translations && data.data.translations.length > 0) {
            return data.data.translations[0].translatedText;
        } else {
            throw new Error('Pinyin retrieval failed');
        }
    }

    document.getElementById('result').addEventListener('click', function(event) {
    var targetElement = event.target;
    var columnNumber;
    var word;

    while (targetElement) {
        if (targetElement.classList.contains('result-column')) {
            var heading = targetElement.querySelector('.result-heading');
            if (heading) {
                switch (heading.textContent.trim()) {
                    case 'English:':
                        columnNumber = 1;
                        break;
                    case 'Malay:':
                        columnNumber = 2;
                        break;
                    case 'Chinese:':
                        columnNumber = 3;
                        break;
                    default:
                        columnNumber = 1; // Default to 1 if heading doesn't match
                }
            }
            break; // Break out of the loop once columnNumber is found
        }
        if (targetElement.classList.contains('word')) {
            word = targetElement.textContent;
        }
        targetElement = targetElement.parentElement; // Move up the DOM tree
    }

    // Check if the clicked element contains a word and columnNumber is defined
    if (word && columnNumber) {
        // Now call the speakText function with the clicked word and defined columnNumber
        speakText(word, columnNumber);
    }
});

function speakText(text, columnNumber) {
    // Define voiceName based on columnNumber
    var voiceName;
    switch (columnNumber) {
        case 1:
            voiceName = 'en-GB-Standard-B';
            break;
        case 2:
            voiceName = 'ms-MY-Standard-C';
            break;
        case 3:
            voiceName = 'cmn-CN-Standard-A';
            break;
        default:
            voiceName = 'en-GB-Standard-B'; // Default to English if columnNumber is not 1, 2, or 3
    }

    // Google Text-to-Speech API endpoint
    var ttsEndpoint = 'https://texttospeech.googleapis.com/v1/text:synthesize?key=AIzaSyDQUaEzdQy4i-5thYcP4OA5rzMfMYc5BMM';

    // Request body
    var requestBody = JSON.stringify({
        input: {
            text: text
        },
        voice: {
            languageCode: 'en-GB', // Default language code for English (UK)
            name: voiceName, // Voice name based on column number
            ssmlGender: 'FEMALE' // You can adjust the gender as needed
        },
        audioConfig: {
            audioEncoding: 'MP3' // You can adjust the audio encoding type
        }
    });

    // Fetch request to Google TTS API
    fetch(ttsEndpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: requestBody
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data && data.audioContent) {
            // Decode base64 audio content
            var audioData = atob(data.audioContent);
            // Convert audio data to binary format
            var arrayBuffer = new ArrayBuffer(audioData.length);
            var uint8Array = new Uint8Array(arrayBuffer);
            for (var i = 0; i < audioData.length; i++) {
                uint8Array[i] = audioData.charCodeAt(i);
            }
            // Create blob object from binary data
            var blob = new Blob([arrayBuffer], { type: 'audio/mpeg' });

            // Play the audio
            var audioElement = new Audio(URL.createObjectURL(blob));
            audioElement.play();
        } else {
            throw new Error('Audio content not found in response');
        }
    })
    .catch(error => {
        console.error('Error fetching audio:', error);
    });
}
