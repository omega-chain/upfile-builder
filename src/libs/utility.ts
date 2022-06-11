export class Utility {
  static removeEmpty(obj: { [key: string]: any }): void {
    Object.keys(obj).forEach((key: string): void => {
      if (obj[key] === undefined) {
        delete obj[key];
      }
    });
  }
}
