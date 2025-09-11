class GridModel {
  constructor(size) {
    this.size = size;
    this.items = null; // Head of the linked list
    this.tail = null;  // Tail of the linked list
    this.length = 0;
    this.condensed = null; // Head of condensed linked list
    this.condensedTail = null; // Tail of condensed linked list
  }

  add(timeslice) {
    if (!this.items) {
      // First item
      this.items = timeslice;
      this.tail = timeslice;
      this.length = 1;
    } else {
      // Add to end
      this.tail.next = timeslice;
      this.tail = timeslice;
      this.length++;
      // Remove the first (head) item if over size
      if (this.length > this.size) {
        this.items = this.items.next;
        this.length--;
      }
    }
  }
   getMedian30s() {
    // Collect the last 6 entries from the linked list
    const stack = [];
    let current = this.items;
    while (current) {
      stack.push(current);
      current = current.next;
    }
    const lastSix = stack.slice(-6);

    if (lastSix.length === 0) return null;

    // Calculate the median for each entry
    const medians = lastSix.map(item => {
      if (typeof item.val === 'number') {
        return item.val;
      }
      return null;
    }).filter(v => v !== null);

    if (medians.length === 0) return null;

    // Sort and find the median for the 6 values
    medians.sort((a, b) => a - b);
    let median;
    const mid = Math.floor(medians.length / 2);
    if (medians.length % 2 === 0) {
      median = (medians[mid - 1] + medians[mid]) / 2;
    } else {
      median = medians[mid];
    }
    return median;
  }

  get5SecondValues() {
    const arr = [];
    let current = this.items;
    while (current) {
      arr.push({ val: current.val, time: current.time });
      current = current.next;
    }
    return arr;
  }


  getCondensedValues() {
    const arr = [];
    let current = this.condensed;
    while (current) {
      // Copy all properties except 'next'
      const { min, max, avg,median, start, end } = current;
      arr.push({ min, max, avg,median, start, end });
      current = current.next;
    }
    return arr;
  }

  crunsh() {
    let current = this.items;
    let min = Infinity;
    let max = -Infinity;
    let sum = 0;
    let count = 0;
    let start = null;
    let end = null;
    let values = []; 

    while (current) {
      if (typeof current.val === 'number') {
        if (current.val < min) min = current.val;
        if (current.val > max) max = current.val;
        sum += current.val;
        values.push(current.val); 
        count++;
        if (!start) start = current.time;
        end = current.time;
      }
      current = current.next;
    }

    if (count === 0) return;

    
    const avg = sum / count;
    values.sort((a, b) => a - b); 
    let median; 
    const mid = Math.floor(values.length / 2); 
    if (values.length % 2 === 0) { 
      median = (values[mid - 1] + values[mid]) / 2; 
    } else { 
      median = values[mid]; 
    } 

  
    const condensedSlice = { min, max, avg, start, median, end, next: null };

    if (!this.condensed) {
      this.condensed = condensedSlice;
      this.condensedTail = condensedSlice;
      this.condensedLength = 1;
    } else {
      this.condensedTail.next = condensedSlice;
      this.condensedTail = condensedSlice;
      this.condensedLength = (this.condensedLength || 1) + 1;
      // Remove the first (head) item if over size
      if (this.condensedLength > this.size) {
        this.condensed = this.condensed.next;
        this.condensedLength--;
      }
    }
  }
}

export default GridModel;