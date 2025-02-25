import { API } from "@/constants/api";
import { convertWebmToWav } from "@/utils/audio-converter";

export const speechService = {
  convertSpeechToText: async (audioBlob: Blob) => {
    try {
      // Log để debug
      console.log('Input audio blob type:', audioBlob.type);
      console.log('Input audio blob size:', audioBlob.size);

      // Convert WebM to WAV
      const wavBlob = await convertWebmToWav(audioBlob);
      console.log('WAV blob size:', wavBlob.size);

      const formData = new FormData();
      formData.append('audio', wavBlob, 'speech.wav');

      // Log FormData
      Array.from(formData.entries()).forEach(pair => {
        console.log(pair[0], pair[1]);
      });

      const response = await fetch(API.CHATBOT.SPEECH_TO_TEXT, {
        method: 'POST',
        body: formData
      });

      // Log response
      console.log('Response status:', response.status);

      const data = await response.json();
      console.log('Response transcript:', data.transcript);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to convert speech to text');
      }

      if (data.status === 'success') {
        return data.transcript;
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Speech to text error:', error);
      throw error;
    }
  }
}; 