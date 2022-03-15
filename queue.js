export class Queue {
  constructor(){
    this.elements = {}
    this.tail = 0;
    this.head = 0;
  }
  enqueue(element){
    this.elements[this.tail] = element;
    this.tail++;
  }
  dequeue(){
    const item = this.elements[this.head];
    delete this.elements[this.head];
    this.head++;
    return item;
  }

  peek(){
    return this.elements[this.head];
  }

  get length(){
    return this.head - this.tail;
  }
  get isEmpty(){
    return this.length()? false: true;
  }
}