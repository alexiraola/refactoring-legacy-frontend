export class Subject<T> {
  private observers: Array<(value: T) => void> = [];

  subscribe(observer: (value: T) => void): () => void {
    this.observers.push(observer);

    return () => {
      this.observers = this.observers.filter(o => o !== observer);
    };
  }

  next(value: T) {
    this.observers.forEach(observer => observer(value))
  }
}
