import { API } from "@/constants/api";

interface ChatbotRequest {
  message: string;
  tts: boolean;
}

interface ChatbotResponse {
  status: string;
  message: string;
  audio_url: string;
}

export const chatbotService = {
  sendMessage: async (message: string, tts: boolean = true) => {
    try {
      const requestData: ChatbotRequest = {
        message,
        tts
      };

      const response = await fetch(API.CHATBOT.CHAT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ChatbotResponse = await response.json();

      if (data.audio_url && tts) {
        console.log('Fetching audio from:', API.CHATBOT.SPEAK);
        
        const audioResponse = await fetch(API.CHATBOT.SPEAK, {
          method: "GET",
          headers: {
            Accept: "audio/mpeg, audio/mp3",
          },
          cache: 'no-cache'
        });
        
        console.log('Audio response status:', audioResponse.status);
        console.log('Audio response headers:', Object.fromEntries(audioResponse.headers));
        
        if (!audioResponse.ok) {
          throw new Error(`Failed to fetch audio: ${audioResponse.status} ${audioResponse.statusText}`);
        }

        try {
          const audioBlob = await audioResponse.blob();
          console.log('Audio blob type:', audioBlob.type);
          console.log('Audio blob size:', audioBlob.size);
          
          if (audioBlob.size === 0) {
            throw new Error('Audio blob is empty. Please check if the audio file exists on the server.');
          }

          const audioUrl = URL.createObjectURL(audioBlob);
          const audio = new Audio();
          
          await new Promise((resolve, reject) => {
            audio.oncanplaythrough = resolve;
            audio.onerror = reject;
            audio.src = audioUrl;
          });
          
          await audio.play();
          
          audio.onended = () => {
            URL.revokeObjectURL(audioUrl);
            console.log('Audio playback completed');
          };
        } catch (audioError) {
          console.error("Audio processing error:", audioError);
          // Continue with chat even if audio fails
        }
      }

      return data;
    } catch (error) {
      console.error("Chatbot API error:", error);
      throw new Error("Failed to send message to chatbot");
    }
  },
}; 