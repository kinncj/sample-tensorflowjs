# TensorFlow.js Object Detection

This project is a simple web application that uses TensorFlow.js and the coco-ssd model to detect objects in a webcam stream.

## Project Structure

The project consists of four main files:

- `index.html`: The main HTML file that includes the structure of the web page.
- `style.css`: Contains the CSS styles for the HTML elements in the project.
- `script.js`: This JavaScript file is responsible for loading the coco-ssd model from TensorFlow.js and initializing the App instance.
- `app.js`: This JavaScript file contains the definition of the App class, which handles the webcam stream, makes predictions using the loaded model, and updates the UI based on the predictions.

## How to Run

1. Open `index.html` in your browser.
2. Click the "Enable Webcam" button to start the webcam stream.
3. The application will start detecting objects in the webcam stream and display the predictions on the screen.

## Dependencies

This project uses the following libraries:

- [TensorFlow.js](https://www.tensorflow.org/js)
- [coco-ssd model](https://github.com/tensorflow/tfjs-models/tree/master/coco-ssd)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details. The license is held by Kinn Coelho Juliao.