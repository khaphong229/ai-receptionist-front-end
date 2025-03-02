import { API } from "@/constants/api";

export const ocrService = {
  extractId: async (file: File | string) => {
    try {
      const formData = new FormData();
      if (typeof file === "string") {
        const base64Data = file.split(",")[1];
        const blob = await fetch(file).then((res) => res.blob());
        formData.append("id_image", blob, "image.jpg");
      } else {
        formData.append("id_image", file);
      }
      const response = await fetch(API.OCR.EXTRACT_TEXT, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error("Failed to extract text from image");
    }
  },
  updateCustomer: async (customerData: any) => {
    try {
      const response = await fetch(API.OCR.UPDATE_CUSTOMER, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(customerData),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      throw new Error("Failed to update customer");
    }
  },
};
