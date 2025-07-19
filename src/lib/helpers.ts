export const isObject = (input: any) =>
  input !== null && typeof input === "object" && !Array.isArray(input);

export const isPlainObject = (input: any) =>
  isObject(input) && Object.keys(input).length === 0;

export const escapeHTML = (text: string) => {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
};
