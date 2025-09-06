class TimeSlice {


  constructor({ val, time }) {
    this.val = val;
    this.time = time;
    this.next = null;
  }

  setNext(timeslice) {
    this.next = timeslice;     
  }
  getNext() {
    return this.next;   
  }
}
  
export default TimeSlice;