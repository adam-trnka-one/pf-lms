export function generateRandomPassword(): string {
  const length = 12;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  
  // Ensure at least one of each required character type
  password += getRandomChar('ABCDEFGHIJKLMNOPQRSTUVWXYZ'); // uppercase
  password += getRandomChar('abcdefghijklmnopqrstuvwxyz'); // lowercase
  password += getRandomChar('0123456789'); // number
  password += getRandomChar('!@#$%^&*'); // special char
  
  // Fill the rest randomly
  for (let i = password.length; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }

  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('');
}

function getRandomChar(charset: string): string {
  return charset.charAt(Math.floor(Math.random() * charset.length));
}