import WaveformData from "waveform-data";
import * as d3 from "d3";
///////////////////////////////////////////////////////
const waveform = WaveformData.create(raw_data);
const channel = waveform.channel(0);
const layout = d3.select(this).select("svg");
const x = d3.scale.linear();
const y = d3.scale.linear();
const offsetX = 100;

const min = channel.min_array();
const max = channel.max_array();

x.domain([0, waveform.length]).rangeRound([0, 1024]);
y.domain([d3.min(min), d3.max(max)]).rangeRound([offsetX, -offsetX]);

const area = d3.svg
  .area()
  .x((d, i) => x(i))
  .y0((d, i) => y(min[i]))
  .y1((d, i) => y(d));

graph
  .select("path")
  .datum(max)
  .attr("transform", () => `translate(0, ${offsetX})`)
  .attr("d", area);
/////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////
    const audioContext = new AudioContext();

    audioContext
      .decodeAudioData(arrayBuffer)
      .then((audioBuffer) => {
        const options = {
          audio_context: audioContext,
          audio_buffer: audioBuffer,
          scale: 128,
        };

        return new Promise((resolve, reject) => {
          WaveformData.createFromAudio(options, (err, waveform) => {
            if (err) {
              reject(err);
            } else {
              resolve(waveform);
            }
          });
        });
      })
      .then((waveform) => {
        console.log(`Waveform has ${waveform.channels} channels`);
        console.log(`Waveform has length ${waveform.length} points`);
      });
////////////////////////////////////////////////////////////////////

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
    anchor.download = `voyager.bin`;
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

    const response = await fetch('http://127.0.0.1:5500/voyager.bin');
    const buffer = await response.arrayBuffer();
    transferRecognizer.loadExamples(buffer, true);


    //console.log(JSON.stringify(myJson));


    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://127.0.0.1:5500/voyager.bin');
    xhr.send(null)
    xhr.onreadystatechange = function () {
        var DONE = 4; // readyState 4 means the request is done.
        var OK = 200; // status 200 is a successful return.
        if (xhr.readyState === DONE) {
            if (xhr.status === OK) {
                console.log(xhr.responseText); // 'This is the returned text.'
            } else {
                console.log('Error: ' + xhr.status); // An error occurred during the request.
            }
        }
    };

}



async function speech() {
    let baseRecognizer = speechCommands.create('BROWSER_FFT');
    console.log("Model Loaded....");
    await baseRecognizer.ensureModelLoaded();

    console.log("Creating Transfer recognizer....");
    const transferRecognizer = baseRecognizer.createTransfer('helper');
    await collectSounds(transferRecognizer, "Ok Finder", exampleCount);
    await collectSounds(transferRecognizer, "_background_noise_", exampleCount)
    console.log("Finished...");

    console.log(transferRecognizer.countExamples());

    

    console.log("Training....")
    await transferRecognizer.train({
        epochs: 25,
        callback: {
            onEpochEnd: async (epoch, logs) => {
                console.log(`Epoch ${epoch}: loss=${logs.loss}, accuracy=${logs.acc}`)
            }
        }
    });
    await loadModel(transferRecognizer)
    // console.log("Downloading....");
    // download(transferRecognizer)

    
    console.log("Listening....");
    await transferRecognizer.listen(result => {
        // - result.scores contains the scores for the new vocabulary, which
        //   can be checked with:
        console.log("----------------------------------------------------")
        const words = transferRecognizer.wordLabels();
        // Turn scores into a list of (score,word) pairs.
         scores = Array.from(result.scores).map((s, i) => ({ score: s, word: words[i] }));
         // Find the most probable word.
         scores.sort((s1, s2) => s2.score - s1.score);
         console.log(`score for word '${scores[0].word}' = ${scores[0].score}`);
         console.log("------------------------------------------------------")
    }, { probabilityThreshold: 0.75 });

   

    // Stop the recognition in 60 seconds.
    setTimeout(() => transferRecognizer.stopListening(), 60e3);
    
}

speech();
