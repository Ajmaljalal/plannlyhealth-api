import CryptoJS from 'crypto-js';
export const decryptData = (data: string) => {
  if (!data) return null;
  const decryptedData = CryptoJS.AES.decrypt(data, process.env.NEXT_PUBLIC_PLANNLY_ENCRYPT_KEY as string).toString(CryptoJS.enc.Utf8);
  return JSON.parse(decryptedData);
}