export class Transaction {
  constructor(
    public readonly amount: number,
    public readonly timestamp: Date,
    public readonly id?: string,
  ) {
    this.validateAmount(amount);
    this.validateTimestamp(timestamp);
  }

  private validateAmount(amount: number): void {
    if (amount < 0) {
      throw new Error('Amount cannot be negative');
    }
  }

  private validateTimestamp(timestamp: Date): void {
    const now = new Date();
    if (timestamp > now) {
      throw new Error('Transaction timestamp cannot be in the future');
    }
  }

  public isWithinLastSeconds(seconds: number): boolean {
    const now = new Date();
    const diffInSeconds = (now.getTime() - this.timestamp.getTime()) / 1000;
    return diffInSeconds <= seconds;
  }

  public getAgeInSeconds(): number {
    const now = new Date();
    return (now.getTime() - this.timestamp.getTime()) / 1000;
  }
} 