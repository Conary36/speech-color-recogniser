const exampleCount = 1;

async function collectSounds(recognizer, name, count){
    for(let i = 0; i < count; i++){
        console.log(`Say ${name}`);
        await recognizer.collectExample(name);
    }
}



async function speech() {
    let baseRecognizer = speechCommands.create('BROWSER_FFT');
    console.log("Model Loaded....");
    await baseRecognizer.ensureModelLoaded();
    console.log("Creating Transfer recognizer....");
    const transferRecognizer = baseRecognizer.createTransfer('colors');
    await collectSounds(transferRecognizer, "red", exampleCount)
    await collectSounds(transferRecognizer, "blue", exampleCount)
    await collectSounds(transferRecognizer, "green", exampleCount)
    await collectSounds(transferRecognizer, "_background_noise_", exampleCount)
    console.log("Finished...");

    console.log(transferRecognizer.countExamples());

    // Start training of the transfer-learning model.
    // You can specify `epochs` (number of training epochs) and `callback`
    // (the Model.fit callback to use during training), among other configuration
    // fields.
    console.log("Training....")
    await transferRecognizer.train({
        epochs: 20,
        callback: {
            onEpochEnd: async (epoch, logs) =>{
                console.log(`Epoch ${epoch}: loss=${logs.loss}, accuracy=${logs.acc}`)
            }
        }
    });

    // After the transfer learning completes, you can start online streaming
    // recognition using the new model.
    console.log("Listening....")
    await transferRecognizer.listen(result => {
        // - result.scores contains the scores for the new vocabulary, which
        //   can be checked with:
        const words = transferRecognizer.wordLabels();
        // `result.scores` contains the scores for the new words, not the original
        // words.
        for (let i = 0; i < words.length; ++i) {//words is an array of words...SO I ADDED .LENGTH
            console.log(`score for word '${words[i]}' = ${result.scores[i]}`);
        }
    }, { probabilityThreshold: 0.75 });

    // Stop the recognition in 10 seconds.
    setTimeout(() => transferRecognizer.stopListening(), 10e3);
    
}

speech();
