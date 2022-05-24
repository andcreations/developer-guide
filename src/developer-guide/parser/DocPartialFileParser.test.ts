import { DocPartial } from '../partial';
import { DocPartialFileParser } from './DocPartialFileParser';

/** */
describe('DocSourceParser', () => {
  const expectPartial = (
    partial: DocPartial,
    id: string,
    content: string,
  ) => {
    expect(partial).toHaveProperty('id');
    expect(partial.id).toEqual(id);
    expect(partial).toHaveProperty('content');
    expect(partial.content).toEqual(content);
  }

  it('should parse a TypeScript file with a single partial ', () => {
    const id = '0xdeadbabe';
    const content = `
      const TEST = 'test';
      // --- devGuideId: "${id}"
      // This is a test partial.
      // 
      // It ends here.

      // This comment is ignored.
      // Another line of the comment.

      function test(): void {
        console.log(TEST);
      }
    `;

    const parser = new DocPartialFileParser();
    const partials = parser.parse('file.ts', content);

    expect(partials).toHaveLength(1);
    expectPartial(
      partials[0],
      id,
      'This is a test partial.\n\nIt ends here.',
    );
  });

  it('should parse a TypeScript file with a partial at the end ', () => {
    const id = '0xdeadbabe';
    const content = `
      // This comment is ignored.
      // Another line of the comment.

      function test(): void {
        console.log(TEST);
      }

      const TEST = 'test';
      // --- devGuideId: "${id}"
      // That's all folks.`;

    const parser = new DocPartialFileParser();
    const partials = parser.parse('file.ts', content);

    expect(partials).toHaveLength(1);
    expectPartial(
      partials[0],
      id,
      `That's all folks.`,
    );
  });

  it('should parse a TypeScript file with two partials ', () => {
    const id0 = '0xdeadbabe';
    const id1 = '0xdeadbeef';
    const content = `
      const TEST = 'test';
      // --- devGuideId: "${id0}"
      // This is a test partial.
      // 
      // It ends here.

      // --- devGuideId: "${id1}"
      // This is another test partial.

      function test(): void {
        console.log(TEST);
      }
    `;

    const parser = new DocPartialFileParser();
    const partials = parser.parse('file.ts', content);

    expect(partials).toHaveLength(2);
    expectPartial(
      partials[0],
      id0,
      'This is a test partial.\n\nIt ends here.',
    );
    expectPartial(
      partials[1],
      id1,
      'This is another test partial.',
    );
  });

  it('should throw on invalid front matter ', () => {
    const content = `
      const TEST = 'test';
      // --- devGuideId: "ffffeeee"
      // --- This line breaks the front matter. It's a YAML now.
      // This is a test partial.
      // 
      // It ends here.

      function test(): void {
        console.log(TEST);
      }
    `;

    const parser = new DocPartialFileParser();
    expect(() => parser.parse('test.ts', content)).toThrow();
  });
});