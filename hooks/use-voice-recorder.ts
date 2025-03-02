import { useState, useCallback, useEffect } from 'react';

export const useVoiceRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

  const startRecording = useCallback(async (onDataAvailable: (blob: Blob) => void) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          channelCount: 1,          // Mono
          sampleRate: 16000,        // 16kHz sample rate
          sampleSize: 16,           // 16 bits
        } 
      });

      // Sử dụng audio/webm vì hầu hết browser hỗ trợ
      const recorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      const chunks: BlobPart[] = [];
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        onDataAvailable(audioBlob);
      };

      // Request data mỗi 1 giây
      recorder.start(1000);
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (error) {
      console.error('Failed to start recording:', error);
      throw error;
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      mediaRecorder.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  }, [mediaRecorder, isRecording]);

  // Cleanup resources khi unmount
  useEffect(() => {
    return () => {
      if (mediaRecorder) {
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return {
    isRecording,
    startRecording,
    stopRecording
  };
}; 