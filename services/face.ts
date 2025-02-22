import { API } from "@/constants/api";

export const faceService = {
  recognize: async (images: string[]) => {
    try {
      const response = await fetch(API.FACE.RECOGNIZE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ images }),
      });

      const data = await response.json();

      return data;
    } catch (error) {
      throw new Error("Failed to recognize face");
    }
  },
};
