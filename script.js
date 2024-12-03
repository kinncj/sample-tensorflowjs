class Counter {
    constructor(dispatchAt, executable) {
        this.counter = 0;
        this.dispatchAt = dispatchAt;
        this.executable = executable;
    }

    ping() {
        this.counter++;
        if (this.counter === this.dispatchAt) {
            this.executable();
            this.counter = 0;
        }
    }
}

const webcamElements = ['preview', 'camera', 'canvas', 'cameraButton', 'videoSource'].reduce((acc, id) => {
    acc[id] = document.getElementById(id) || document.querySelector(`#${id.replace("Button", "")} > button`);
    return acc;
}, {});

// const models = {'cocoSsd': null, 'deeplab': null, 'mobilenet': null};
const models = {'cocoSsd': null};
const counter = new Counter(Object.keys(models).length, () => {
    webcamElements.canvas.classList.remove('hidden');
    new App(models, ...Object.values(webcamElements)).init();
    new RtspApp(
        models,
        document.getElementById('rtsp'),
        document.getElementById('rtspPreview'),
        document.getElementById('rtspContainer')).init();
});
/**
 * Load the coco-ssd model from TensorFlow.js, remove the 'hidden' class from the canvas, and initialize an instance of the App class.
 * https://github.com/tensorflow/tfjs-models/tree/master/coco-ssd
 */

// loop trough the models map, use the key to load the model and push the model to the models array
document.getElementById("modelsToLoad").innerHTML += "<ul>";
for (const m in models) {
    document.getElementById("modelsToLoad").innerHTML += `<li> Loading <b>${m}</b> model</li>`;
    window[m].load().then(model => {
        models[m] = model;
        counter.ping();
        document.getElementById("modelsToLoad").innerHTML += `<li> Loaded <b>${m}</b> model</li>`;
    });
}
document.getElementById("modelsToLoad").innerHTML += "</ul>";