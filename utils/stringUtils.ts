export function convertTurkishToEnglish(text: string): string {
  const turkishChars: { [key: string]: string } = {
    ç: "c",
    ğ: "g",
    ı: "i",
    ö: "o",
    ş: "s",
    ü: "u",
    Ç: "C",
    Ğ: "G",
    İ: "I",
    Ö: "O",
    Ş: "S",
    Ü: "U",
  };

  return text
    .replace(/[çğıöşüÇĞİÖŞÜ]/g, (char) => turkishChars[char] || char)
    .toLowerCase();
}

export function generateStudentCredentials(
  firstName: string,
  lastName: string,
  studentNumber: string,
  className: string
) {
  // Convert Turkish characters and ensure lowercase
  const cleanFirstName = convertTurkishToEnglish(firstName);
  const cleanLastName = convertTurkishToEnglish(lastName);

  // Extract first 2 letters of names
  const firstNamePrefix = cleanFirstName.slice(0, 2);
  const lastNamePrefix = cleanLastName.slice(0, 2);

  // Extract class number and letter from className (e.g., "8-A" -> "8a")
  const classMatch = className.match(/(\d+)-([A-Za-z])/);
  const classIdentifier = classMatch
    ? `${classMatch[1]}${classMatch[2].toLowerCase()}`
    : "";

  // Generate base identifier
  const baseIdentifier = `${firstNamePrefix}${studentNumber}${lastNamePrefix}${classIdentifier}`;

  return {
    email: `${baseIdentifier}@24agustos.com`,
    username: baseIdentifier,
    password: `24${baseIdentifier}`,
  };
}
