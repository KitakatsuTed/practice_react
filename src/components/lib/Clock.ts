// must be singleton
export default class Clock {
  public hour: number;
  private static _instance: Clock;
  private constructor(hour: number) {
    this.hour = hour
  }

  public static get Instance(): Clock {
    if (!this._instance) {
      this._instance = new Clock(0);
    }

    return this._instance;
  }

  public isDaytime() {
    return (this.hour < 9 || this.hour > 18)
  }
}
