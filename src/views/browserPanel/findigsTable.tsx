import * as React from 'react';
import { FindingRow } from './findingRow';
import { SemgrepFinding } from "./models/semgrepFinding";

interface Props {
    findings: SemgrepFinding[],
    root: string
}

export class FindingsTable extends React.Component<Props, {}> {
    
    renderTableBody(): JSX.Element[] {
        let test = this.props.findings.map((finding: SemgrepFinding, i: number) => {
            return (<FindingRow finding={finding} root={this.props.root} key={i} positionNumber={i+1}></FindingRow>)
        });

        return test;
    }
    
    render(): JSX.Element {
        return (
            <table className="vscode-semgrep__finding-table" >
                <thead><tr><th></th><th>Title</th><th>Path</th></tr></thead>
                <tbody>{this.renderTableBody()}
                </tbody>
            </table>
        );
    }
}
