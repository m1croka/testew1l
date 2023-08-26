// Defina a URL do modelo do Teachable Machine gerado no "Update My Cloud Model"
const MODEL_URL = 'https://storage.googleapis.com/tm-model/o3GqCqGS3/model.json';

let model;
let webcamStream;
const cameraFeed = document.getElementById('cameraFeed');
const identifiedStudentElement = document.getElementById('identifiedStudent');

async function loadModel() {
    model = await tmImage.load(MODEL_URL);
}

async function startCamera() {
    try {
        webcamStream = await navigator.mediaDevices.getUserMedia({ video: true });
        cameraFeed.srcObject = webcamStream;
    } catch (error) {
        console.error('Erro ao acessar a câmera:', error);
    }
}

function stopCamera() {
    if (webcamStream) {
        webcamStream.getTracks().forEach(track => track.stop());
        cameraFeed.srcObject = null;
    }
}

async function classifyFromCamera() {
    const image = cameraFeed;
    const predictions = await model.predict(image);
    const topPrediction = predictions[0];
    return topPrediction.className;
}

async function init() {
    await loadModel();
    startCamera(); // Iniciar a câmera automaticamente

    setInterval(async () => {
        if (model && webcamStream && webcamStream.active) {
            const identifiedStudent = await classifyFromCamera();
            identifiedStudentElement.textContent = identifiedStudent;
        }
    }, 1000); // Classificar a cada segundo
}

init();
