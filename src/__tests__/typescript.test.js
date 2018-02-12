import { Parser } from "../parser/typescript";

describe("typescript 1", () => {
  test("1", () => {
    const input = "const fake = 'in god we trust';";
    const parser = new Parser(input);

    const sel = parser.expandSelectionAt(20, 20);
    expect(input.substring(sel.start, sel.end)).toEqual("'in god we trust'");

    // const sel1 = parser.expandSelectionAt(sel.start, sel.end);
    // console.log('_____ sel1', sel1);
    // expect(input.substring(sel1.start, sel1.end)).toEqual("fake = 'in god we trust'");
  });
});
