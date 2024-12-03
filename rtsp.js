/**
 * The RtspApp class is responsible for handling the webcam stream, making predictions using the loaded model, and updating the UI based on the predictions.
 */
class RtspApp {
    /**
     * Constructs a new instance of the RtspApp class.
     * @param {Object} model - The loaded coco-ssd model from TensorFlow.js.
     * @param {HTMLElement} $source - The video element for the stream.
     * @param {HTMLElement} $preview - The video element for the webcam stream.
     * @param {HTMLElement} $rtspContainer - The main div.
     **/
    constructor(model, $source, $preview, $rtspContainer) {
        this.model = model;
        this.$source = $source;
        this.$preview = $preview;
        this.$rtspContainer = $rtspContainer;
        this.children = [];
        this.previewStarted = false;
        this.initialized = false;
    }

    /**
     * Checks if the user's browser supports the getUserMedia API.
     * @returns {boolean} - True if the getUserMedia API is supported, false otherwise.
     */
    isCameraSupported() {
        return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
    }

    /**
     * Starts the webcam stream and adds an event listener to the video element to start making predictions when the stream is ready.
     */
    startPreview() {
        if (!this.model || this.previewStarted) {
            return;
        }

        // Activate the RTSP stream.
        // this.$source.src = is an mp4 steam
        // convert $this.source to an image
        this.$preview.srcObject = this.$source.captureStream();
        this.$preview.style = "display: none;";
        this.previewStarted = true;
        this.$preview.addEventListener('loadeddata', () => this.prediction());

    }

    /**
     * Makes predictions using the loaded model and updates the UI based on the predictions.
     *
     * This method is responsible for making predictions using a loaded model and updating the UI based on these predictions.
     *
     * The method starts by calling the `detect` method on the `model` object, which is a TensorFlow.js model loaded in the constructor of the `RtspApp` class. The `detect` method takes a video element (`this.$preview`) as an argument and returns a Promise that resolves to an array of predictions.
     *
     * ```javascript
     * this.model.cocoSsd.detect(this.$preview).then((predictions) => {
     *     // ...
     * });
     * ```
     *
     * Once the Promise resolves, the method first removes all existing child elements from the `$camera` element and resets the `children` array. This is done to clear the previous predictions from the UI.
     *
     * ```javascript
     * this.children.forEach(child => this.$camera.removeChild(child));
     * this.children = [];
     * ```
     *
     * Next, the method filters the predictions to only include those with a score greater than 0.66. For each of these predictions, it creates a new paragraph element (`p`) and a new div element (`highlighter`). The paragraph element displays the class and score of the prediction, and the div element visually highlights the area of the prediction on the webcam stream. Both elements are then appended to the `$camera` element and added to the `children` array.
     *
     * ```javascript
     * predictions.filter(pred => prediction.score > 0.66).forEach(prediction => {
     *     // Create and style the paragraph and highlighter elements
     *     // RtspAppend the elements to the $camera element
     *     // Add the elements to the children array
     * });
     * ```
     *
     * Finally, the method schedules the next prediction by calling `window.requestAnimationFrame` and passing `this.prediction` as the callback. This ensures that the method will be called again as soon as the browser is ready to repaint the UI, creating a loop that updates the predictions in real time.
     *
     * ```javascript
     * window.requestAnimationFrame(() => this.prediction());
     * ```
     */
    prediction() {
        const seconds = 1;
        /**
         * {Image} this.$source - The video element for the webcam stream.
         * {number} maxNumBoxes - The maximum number of bounding boxes of detected objects. There can be multiple objects of the same class, but at different locations. Defaults to 20.
         * {number} scoreThreshold - The minimum score of the returned bounding boxes of detected objects. Value between 0 and 1. Defaults to 0.5.
         */
        this.model.cocoSsd.detect(this.$source, 100, 0).then((predictions) => {
            console.log(predictions);
            this.children.forEach(child => this.$rtspContainer.removeChild(child));
            this.children = [];

            predictions.filter(prediction => prediction.score > 0).forEach(prediction => {
                var percent = Math.round(prediction.score * 100);
                console.log("rtsp", percent, prediction);
                if (percent < 50) {
                    return;
                }
                const p = document.createElement('p');
                p.innerText = `${prediction.class} - with ${percent}% confidence.`;
                p.style = `margin-left: ${prediction.bbox[0]}px; margin-top: ${prediction.bbox[1] - 10}px; width: ${prediction.bbox[2] - 10}px; top: 0; left: 0;`;

                const highlighter = document.createElement('div');
                highlighter.setAttribute('class', 'highlighter');
                highlighter.style = `left: ${prediction.bbox[0]}px; top: ${prediction.bbox[1]}px; width: ${prediction.bbox[2]}px; height: ${prediction.bbox[3]}px;`;

                this.$rtspContainer.append(highlighter, p);
                console.log("Preview", highlighter, p, this.$rtspContainer)
                this.children.push(highlighter, p);
            });
            setTimeout(() => window.requestAnimationFrame(() => this.prediction()), 1000 * seconds);
        });
    }
    /**
     * Checks if the user's browser supports the getUserMedia API and adds an event listener to the enable camera button to start the webcam stream when clicked.
     */
    init() {
        if (this.initialized) {
            return;
        }
        if (this.isCameraSupported()) {
            this.initialized = true;
            this.startPreview();
        } else {
            console.warn('RTSP is not supported by your browser');
        }
    }
}