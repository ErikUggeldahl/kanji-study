export const kanjiToUnicode = (kanji: string): string => {
  if (kanji.length !== 1) {
    throw new Error("Input must be a single Kanji character.");
  }

  const unicodeValue = kanji.charCodeAt(0).toString(16).toUpperCase();
  return unicodeValue.padStart(5, "0");
};
