
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
    await collectSounds(transferRecognizer, "red", 10)
    await collectSounds(transferRecognizer, "_background_noise_", 10)
    console.log("Finished...");

}

speech();
