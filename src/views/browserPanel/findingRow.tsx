import * as React from 'react';
import { SemgrepFinding } from './models/semgrepFinding';

interface Props {
    finding: SemgrepFinding,
    root: string,
    positionNumber: number
}

export class FindingRow extends React.Component<Props, {}> {
    toLink(finding: SemgrepFinding) {
        return 'vscode://file/' + this.props.root + finding.path + ':' + finding.start.line + ':' + finding.start.col;
    }

    render(): JSX.Element {
        return (
            <tr className={this.props.positionNumber % 2 ? 'vscode-semgrep__finding-table-row-odd' : 'vscode-semgrep__finding-table-row-even'} >
                <td>{this.props.positionNumber}</td>
                <td>{this.props.finding.link ?
                    <a href={this.props.finding.link} >
                        {this.props.finding.message}
                    </a> :
                    <span>{this.props.finding.message}</span>}
                </td>
                <td>
                    <a href={this.toLink(this.props.finding)} >
                        {this.props.finding.path}
                    </a>
                </td>
            </tr>
        );
    }
}