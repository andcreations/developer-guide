import * as colors from 'ansi-colors';

/** */
export class Log {
  /** */
  static section(text: string): void {
    let str = '-------- [ ' + colors.green(text) + ' ] ';
    while (str.length < 72) {
      str = str + '-';
    }
    console.log(str);
  }

  /** */
  static info(msg: string): void {
    console.log(msg);
  }

  /** */
  static fatal(msg: string): void {
    console.log(msg);
    process.exit(1);
  }
}
