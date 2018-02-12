import { Parser } from "../parser/typescript";

describe("typescript 1", () => {
  test("1", () => {
    const input = "const fake = 'in god we trust';";
    const parser = new Parser(input);

    const sel = parser.expandSelectionAtPos(20, 20);
    expect(
      input.substring(sel.nodeStart.getStart(), sel.nodeEnd.getEnd())
    ).toEqual("'in god we trust'");

    const sel1 = parser.expandSelectionAt(sel.nodeStart, sel.nodeEnd);
    expect(
      input.substring(sel1.nodeStart.getStart(), sel1.nodeEnd.getEnd())
    ).toEqual("fake = 'in god we trust'");

    const sel2 = parser.expandSelectionAt(sel1.nodeStart, sel1.nodeEnd);
    expect(
      input.substring(sel2.nodeStart.getStart(), sel2.nodeEnd.getEnd())
    ).toEqual("const fake = 'in god we trust'");
  });

  test("2", () => {
    const input = "const fake = 'in god we trust';";
    const parser = new Parser(input);

    const sel = parser.expandSelectionAtPos(3, 20);
    expect(
      input.substring(sel.nodeStart.getStart(), sel.nodeEnd.getEnd())
    ).toEqual("const fake = 'in god we trust'");
  })
});
