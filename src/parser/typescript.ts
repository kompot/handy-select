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

  public expandSelectionAtPos(start: number, end: number): ISelectionResult {
    const deepestNodeStart = this.findDeepestChildAtPosition(
      this.source,
      start,
      start
    );
    const deepestNodeEnd = this.findDeepestChildAtPosition(
      this.source,
      end,
      end
    );
    return {
      nodeStart: deepestNodeStart,
      nodeEnd: deepestNodeEnd
    };
  }

  private isChildOf(parent: ts.Node, child: ts.Node): boolean {
    return (
      parent.getStart() <= child.getStart() && parent.getEnd() >= child.getEnd()
    );
  }

  private getLowestCommonAncestor(
    node1: ts.Node,
    node2: ts.Node
  ): ts.Node | undefined {
    while (!!node1.parent && !this.isChildOf(node1.parent, node2)) {
      return this.getLowestCommonAncestor(node1.parent, node2);
    }
    return node1.parent || this.source;
  }

  public expandSelectionAt(nodeStart: ts.Node, nodeEnd: ts.Node): ISelectionResult {
    const lca = this.getLowestCommonAncestor(nodeStart, nodeEnd);
    return {
      nodeStart: lca,
      nodeEnd: lca,
    };
  }
}
