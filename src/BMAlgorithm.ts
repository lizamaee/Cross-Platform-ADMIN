
export const winner = (candidates: string[]):string | undefined => {
    let candidate;
    let count = 0;
  
    for (let elem of candidates) {
      if (count === 0) {
        candidate = elem;
      }
      if (candidate === elem) {
        count++;
      } else {
        count--;
      }
    }
  
    return candidate;
}