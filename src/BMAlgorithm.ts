export const winner = (arr: string[]): string[] | null => {
    if (arr.length === 0) {
        return null
    }
    
      const stringCount: { [key: string]: number } = {};
      
      for (const str of arr) {
        if (stringCount[str]) {
            stringCount[str]++;
        } else {
            stringCount[str] = 1;
        }
      }
    
      let maxCount = 0;
      let mostFrequentStrings: string[] = [];
    
      for (const str in stringCount) {
        if (stringCount[str] > maxCount) {
          maxCount = stringCount[str];
          mostFrequentStrings = [str];
        } else if (stringCount[str] === maxCount) {
          mostFrequentStrings.push(str);
        }
      }

      if(mostFrequentStrings.length > 1){
        return mostFrequentStrings
      }else{
        return mostFrequentStrings;
      }
      
  }