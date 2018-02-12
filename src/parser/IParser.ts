import * as ts from 'typescript';

export interface ISelectionResult {
  nodeStart: ts.Node;
  nodeEnd: ts.Node;
}

export interface IParser {
  expandSelectionAtPos(start: number, end: number): ISelectionResult;
  expandSelectionAt(nodeStart: ts.Node, nodeEnd: ts.Node): ISelectionResult;
}
