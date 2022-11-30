function stringComparison(stringA, stringB) {
  if (typeof stringA !== 'string' || typeof stringB !== 'string') return false;
  const firstArg = stringA.replace(/ /g, '');
  const secondArg = stringB.replace(/ /g, '');

  if (firstArg.length !== secondArg.length) return false;
  let counterObject = {};

  for (let char of firstArg) {
    counterObject[char] = ++counterObject[char] || 1;
  }

  for (let char of secondArg) {
    if (counterObject[char]) {
      counterObject[char] -= 1;
    } else {
      return false;
    }
  }
  return true;
}
