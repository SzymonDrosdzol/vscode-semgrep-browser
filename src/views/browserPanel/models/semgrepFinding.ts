interface CodePlace {
    col: number,
    line: number,
    offset: number
}

export interface SemgrepFinding {
    message: string,
    path: string,
    link: string,
    checkId: string,
    start: CodePlace,
    end: CodePlace
}
