const exampleCount = 2;

async function collectSounds(recognizer, name, count){
    for(let i = 0; i < count; i++){
        console.log(`Say ${name}`);
        await recognizer.collectExample(name);
    }
}



function download(transferRecognizer) {
   
    const artifacts = transferRecognizer.serializeExamples();

    // Trigger downloading of the data .bin file.
    const anchor = document.createElement('a');
    anchor.download = `blazing.bin`;
    anchor.href = window.URL.createObjectURL(
        new Blob([artifacts], { type: 'application/octet-stream' }));
    anchor.click();
};


async function createTrainModel(transferRecognizer){
    await collectSounds(transferRecognizer, "OK Finder", exampleCount)
    //await collectSounds(transferRecognizer, "Hey Brave", exampleCount)
    //await collectSounds(transferRecognizer, "Open Search", exampleCount)
    await collectSounds(transferRecognizer, "_background_noise_", exampleCount)
    console.log("Finished...");

    console.log(transferRecognizer.countExamples());

    // Start training of the transfer-learning model.
    // You can specify `epochs` (number of training epochs) and `callback`
    // (the Model.fit callback to use during training), among other configuration
    // fields.
    console.log("Training....")
    await transferRecognizer.train({
        epochs: 25,
        callback: {
            onEpochEnd: async (epoch, logs) => {
                console.log(`Epoch ${epoch}: loss=${logs.loss}, accuracy=${logs.acc}`)
            }
        }
    });
}

async function loadModel(transferRecognizer){

}


async function speech() {
    let baseRecognizer = speechCommands.create('BROWSER_FFT');
    console.log("Model Loaded....");
    await baseRecognizer.ensureModelLoaded();

    console.log("Creating Transfer recognizer....");
    const transferRecognizer = baseRecognizer.createTransfer('helper');
    await loadModel(transferRecognizer);
   
    

    // console.log("Downloading...")
    // download(transferRecognizer);

    // After the transfer learning completes, you can start online streaming
    // recognition using the new model.
    console.log("Listening....")
    await transferRecognizer.listen(result => {
        // - result.scores contains the scores for the new vocabulary, which
        //   can be checked with:
        console.log("----------------------------------------------------")
        const words = transferRecognizer.wordLabels();
        // Turn scores into a list of (score,word) pairs.
         scores = Array.from(result.scores).map((s, i) => ({ score: s, word: words[i] }));
         // Find the most probable word.
         scores.sort((s1, s2) => s2.score - s1.score);

        // `result.scores` contains the scores for the new words, not the original
        // words.
        //for (let i = 0; i < words.length; ++i) {//words is an array of words...SO I ADDED .LENGTH
            console.log(`score for word '${scores[0].word}' = ${scores[0].score}`);
        //}
        console.log("------------------------------------------------------")
    }, { probabilityThreshold: 0.75 });

   

    // Stop the recognition in 10 seconds.
    setTimeout(() => transferRecognizer.stopListening(), 20e3);
    
}

speech();
