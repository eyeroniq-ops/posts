
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // The result is in the format "data:[<mediatype>];base64,<data>"
      // We only need the base64 part.
      const base64Data = result.split(',')[1];
      if (base64Data) {
        resolve(base64Data);
      } else {
        reject(new Error("Error al leer el archivo como cadena base64."));
      }
    };
    reader.onerror = (error) => reject(error);
  });
};