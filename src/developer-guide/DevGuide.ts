import { Log } from './Log';
import { DevGuideCfg } from './DevGuideCfg';
import { Builder } from './builder';

/** */
export class DevGuide {
  /** */
  constructor(private readonly cfg: DevGuideCfg) {
  }

  /** */
  run(args: string[]): void {
    const command = args[0];
  // build
    if (command === 'build') {
      const builder = new Builder(this.cfg);
      builder.run();
      return;
    }

    Log.fatal(`Unknown command ${command}`);
  }
}