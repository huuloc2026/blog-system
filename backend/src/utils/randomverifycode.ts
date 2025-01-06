export function randomNumber(min:number=1000, max:number=9999) {
     min = Math.ceil(min);
     max = Math.floor(max);
    
    const number = Math.floor(Math.random() * (max - min + 1)) + min;
  return number.toString()
}

export function randomSalt(min: number = 10000, max: number =99999) {
  min = Math.ceil(min);
  max = Math.floor(max);

  const number = Math.floor(Math.random() * (max - min + 1)) + min;
  return number.toString();
}



