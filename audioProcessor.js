class AudioProcessor extends AudioWorkletProcessor {

  constructor() {
      super();

      // Streaming buffer
      this.buffer = new Float32Array();

      // Receive audio data from the main thread, and add it to the buffer
      this.port.onmessage = (event) => {
          let newFetchedData = new Float32Array(this.buffer.length + event.data.audioData.length);
          newFetchedData.set(this.buffer, 0);
          newFetchedData.set(event.data.audioData, this.buffer.length); 
          this.buffer = newFetchedData;
      };
  }

  // Take a chunk from the buffer and send it to the output to be played
  // Usually processes 128 samples per call
  process(_, outputs) {
      const output = outputs[0];
      const channel = output[0];
      const bufferLength = this.buffer.length;
      for (let i = 0; i < channel.length; i++) {
          channel[i] = (i < bufferLength) ? this.buffer[i] : 0;
      }
      this.buffer = this.buffer.slice(channel.length);
      return true;
  }
}

registerProcessor('audio-processor', AudioProcessor);
