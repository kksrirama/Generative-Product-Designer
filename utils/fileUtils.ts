
/**
 * Converts a File object to a base64 encoded string, without the data URI prefix.
 * @param file The File object to convert.
 * @returns A promise that resolves with the base64 string.
 */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove "data:mime/type;base64," prefix
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
}
