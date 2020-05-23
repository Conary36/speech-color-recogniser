async function app() {
    let baseRecognizer = speechCommands.create('BROWSER_FFT');
    console.log("Model Loaded....");
    await baseRecognizer.ensureModelLoaded();
    console.log("Creating Transfer recognizer....");
    const transferRecognizer = baseRecognizer.createTransfer('colors');
    console.log("Collecting examples....");
    await transferRecognizer.collectExample('Red');
}

app();
