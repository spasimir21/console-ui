function isPrintableASCII(char: string) {
  const code = char.charCodeAt(0);
  return code >= 32 && code <= 126;
}

export { isPrintableASCII };
