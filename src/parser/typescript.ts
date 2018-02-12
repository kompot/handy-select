import * as ts from "typescript";
import { IParser, ISelectionResult } from "./IParser";
import * as _ from "lodash";

const debug = (node: ts.Node, level: number = 0) => {
  node.forEachChild(child => {
    const ft = child.getFirstToken();
    const lt = child.getLastToken();
    const nesting = "  ".repeat(level);
    console.log(
      nesting,
      "с:",
      child.getText(),
      child.getStart(),
      child.getEnd(),
      child.kind
    );

    if (ft) {
      console.log(nesting, "f:", ft.getText(), ft.getStart(), ft.getEnd());
      debug(ft, level + 1);
    }
    if (lt) {
      console.log(nesting, "l:", lt.getText(), lt.getStart(), lt.getEnd());
      debug(lt, level + 1);
    }
    child.forEachChild(child => debug(child, level + 1));
  });
};

export class Parser implements IParser {
  private readonly source: ts.SourceFile;

  constructor(source: string) {
    this.source = ts.createSourceFile(
      "tmp",
      source,
      ts.ScriptTarget.Latest,
      true
    );

    debug(this.source);
  }

  private isSelfMatching = (
    node: ts.Node,
    start: number,
    end: number
  ): boolean => {
    return (
      node.getStart() < start &&
      node.getEnd() > end &&
      node.getChildCount() === 0
    );
  };

  private isChildMatching = (
    node: ts.Node,
    start: number,
    end: number
  ): boolean => {
    return (
      node.getStart() < start &&
      node.getEnd() > end &&
      node.getChildCount() !== 0
    );
  };

  private findDeepestChildAtPosition(
    node: ts.Node,
    start: number,
    end: number
  ): ts.Node | undefined {
    const isSelf = this.isSelfMatching(node, start, end);
    const isChild = this.isChildMatching(node, start, end);
    if (isSelf) {
      return node;
    } else if (isChild) {
      const child = _.find(
        node.getChildren(),
        child =>
          this.isChildMatching(child, start, end) ||
          this.isSelfMatching(child, start, end)
      );
      if (child) {
        return this.findDeepestChildAtPosition(child, start, end);
      }
    }
  }

  public expandSelectionAt(start: number, end: number): ISelectionResult {

    const deepestNode = this.findDeepestChildAtPosition(
      this.source,
      start,
      end
    );
    // console.log(
    //   "_____ deepestNode.kind",
    //   deepestNode.kind,
    //   deepestNode.parent.parent.parent.getText(),
    //   deepestNode.parent.parent.getText(),
    //   deepestNode.parent.getText()
    // );
    return {
      start: deepestNode.getStart(),
      end: deepestNode.getEnd(),
    };
  }
}
