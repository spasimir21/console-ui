class Stack<T> {
  private readonly stack: T[] = [];

  public push(value: T) {
    this.stack.push(value);
  }

  public peek() {
    return this.stack[this.stack.length - 1];
  }

  public pop() {
    return this.stack.pop() ?? null;
  }
}

export { Stack };
