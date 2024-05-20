class Queue<T> {
  private elements: T[];

  constructor() {
    this.elements = [];
  }

  public enqueue(item: T): void {
    this.elements.push(item);
  }

  public dequeue(): T | undefined {
    return this.elements.shift();
  }

  public get size(): number {
    return this.elements.length;
  }
}

export default Queue;
