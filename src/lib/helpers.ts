import CryptoJS from 'crypto-js';
export const decryptData = (data: string) => {
  if (!data) return null;
  const decryptedData = CryptoJS.AES.decrypt(data, process.env.NEXT_PUBLIC_PLANNLY_ENCRYPT_KEY as string).toString(CryptoJS.enc.Utf8);
  return JSON.parse(decryptedData);
}

export const generateRandomPassword = () => {
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const specialChars = '!@#$%^&*()_-+=<>?';
  const upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  function getRandom(arr: string) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  const randomPassword = [
    getRandom(upperChars),
    getRandom(specialChars),
    getRandom(specialChars),
    getRandom(numbers),
  ];

  while (randomPassword.length < 10) {
    randomPassword.push(getRandom(chars));
  }

  return randomPassword.sort(() => Math.random() - 0.5).join('');
}