import * as ts from "typescript";

const filename = "xxx.ts";

const code = `
const a = 'in god we trust';
const b = 6;

const c = {
  d: 6,
  e: 'mother of god',
  f: {
    g: '15',
    h: '22'
  },
}

`;


// class B {
//   private x: number;
// }

// class A extends B {
//   private y: string;
// }

const compilerHost: ts.CompilerHost = {
  fileExists: () => true,
  getCanonicalFileName: filename => filename,
  getCurrentDirectory: () => "",
  getDefaultLibFileName: () => "lib.d.ts",
  getNewLine: () => "\n",
  getSourceFile: filename => {
    return ts.createSourceFile(filename, code, ts.ScriptTarget.Latest, true);
  },
  readFile: () => null,
  useCaseSensitiveFileNames: () => true,
  writeFile: () => null,
  getDirectories: path => []
};

const program = ts.createProgram(
  [filename],
  {
    noResolve: true,
    target: ts.ScriptTarget.Latest,
    experimentalDecorators: true,
    experimentalAsyncFunctions: true
    // jsx: JsxEmit.React,
  },
  compilerHost
);

const sourceFile = program.getSourceFile(filename);

const pos = sourceFile.getPositionOfLineAndCharacter(2, 3);

// console.log(
//   "_____ xx",
//   sourceFile,
// );

const printPositions = (node: ts.Node, level: number) => {
  node.forEachChild(child => {
    const ft = child.getFirstToken();
    const lt = child.getLastToken();
    const nesting = "  ".repeat(level);
    console.log(nesting, "child", child.getText(), child.getStart(), child.getEnd(), child.kind);

    if (ft) {
      console.log(nesting, "first token", ft.getText(), ft.getStart(), ft.getEnd());
      printPositions(ft, level + 1);
    }
    if (lt) {
      console.log(nesting, "last token", lt.getText(), lt.getStart(), lt.getEnd());
      printPositions(lt, level + 1);
    }
    child.forEachChild(child => printPositions(child, level + 1));
  });
};

printPositions(sourceFile, 0);

// ts.forEachChild(sourceFile, node => {

//   // console.log('_____ last token', node.getLastToken());
// })
// .getChildren()
// .map(child => {
//   console.log("_____ child", child.getFirstToken().getStart(), child.getFirstToken().getEnd());
// });

// console.log("_____ sourceFile.text", sourceFile.text);
