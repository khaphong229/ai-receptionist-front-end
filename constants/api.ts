import { SERVER_URL } from "@/config/constant";
import { Verified } from "lucide-react";

const FACE_API_URL = `${SERVER_URL}/api/face`;
const OCR_API_URL = `${SERVER_URL}/api/ocr`;
const CHATBOT_API_URL = `${SERVER_URL}/api/chatbot`;
const APPOINTMENT_API_URL = `${SERVER_URL}/api/appointment`;

export const API = {
  FACE: {
    RECOGNIZE: `${FACE_API_URL}/recognize`,
  },
  OCR: {
    EXTRACT_TEXT: `${OCR_API_URL}/extract-id`,
    UPDATE_CUSTOMER: `${OCR_API_URL}/update-customer`,
  },
  CHATBOT: {
    CHAT: `${CHATBOT_API_URL}/chat`,
    SPEAK: `${CHATBOT_API_URL}/speak`,
    SPEECH_TO_TEXT: `${CHATBOT_API_URL}/speech-to-text`,
  },
  APPOINTMENT: {
    GET: `${APPOINTMENT_API_URL}/get`,
    CREATE: `${APPOINTMENT_API_URL}/create`,
    VERIFY: `${APPOINTMENT_API_URL}/verify`,
  },
};
