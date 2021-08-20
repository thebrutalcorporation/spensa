function getRandomItemFromArray(arr: []): Record<string, unknown> {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default getRandomItemFromArray;
