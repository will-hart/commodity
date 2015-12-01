const shuffleArray = (array) => {
  let copy = array.slice(0);

  for (let i = copy.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = copy[i];
    copy[i] = copy[j];
    copy[j] = temp;
  }

  return copy;
};

export { shuffleArray };
