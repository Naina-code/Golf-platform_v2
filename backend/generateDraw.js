export const generateDraw = () => {
  let nums = new Set();

  while (nums.size < 5) {
    nums.add(Math.floor(Math.random() * 45) + 1);
  }

  return [...nums];
};
