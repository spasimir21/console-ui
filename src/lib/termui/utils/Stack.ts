class Stack<T> {
  private readonly stack: T[] = [];

  push(value: T) {
    this.stack.push(value);
  }

  pop() {
    return this.stack.pop() ?? null;
  }

  peek() {
    return this.stack[this.stack.length - 1] ?? null;
  }
}

export { Stack };
