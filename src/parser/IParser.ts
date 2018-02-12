export interface ISelectionResult {
  start: number;
  end: number;
}

export interface IParser {
  expandSelectionAt(start: number, end: number): ISelectionResult;
}
