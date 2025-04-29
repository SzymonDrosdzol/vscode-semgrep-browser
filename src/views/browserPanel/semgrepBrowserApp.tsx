import * as React from 'react';
import picomatch from 'picomatch';
import { vscode } from '../vscodeApi';
import { FindingsTable } from './findigsTable';
import { SemgrepFinding } from './models/semgrepFinding';
import { MultiSelect } from "react-multi-select-component";

interface State {
    findings: SemgrepFinding[],
    rulesFilter: {
        all: CheckFilterItem[],
        selected: CheckFilterItem[]
    },
    pathFilter: PathFilter,
    rootPath: string,
}

interface CheckFilterItem {
    checkId: string,
    message: string
}

interface PathFilter {
    include: string,
    exclude: string
}

export class SemgrepBrowserApp extends React.Component<{}, State> {

    constructor(props: any){
        super(props);

        let stateString = window.localStorage.getItem('state');
        if(stateString) {
            this.state = JSON.parse(stateString);
        }
    }

    setState<K extends keyof State>(state: State | ((prevState: Readonly<State>, props: Readonly<{}>) => State | Pick<State, K> | null) | Pick<State, K> | null, callback?: (() => void) | undefined): void {
        let newState = typeof state === "function" ? state(this.state, state) : state;

        window.localStorage.setItem("state", JSON.stringify(newState));

        return super.setState(newState);
    }

    handleOpenButton() {
        vscode.postMessage({
            command: 'open'
        });
    }

    handleFindingSelect(newSelect: any) {
        this.setState((state) => {
            state.rulesFilter.selected = newSelect.map((selected: any) => { return { checkId: selected.value, description: selected.label } });
            return state;
        });
    }

    handlePathFilterIncludeChange(e: React.BaseSyntheticEvent) {
        this.setState((state) => {
            state.pathFilter.include = e.target.value;
            return state;
        });
    }

    handlePathFilterExcludeChange(e: React.BaseSyntheticEvent) {
        this.setState((state) => {
            state.pathFilter.exclude = e.target.value;
            return state;
        });
    }

    nativeMessageHandler(event: MessageEvent) {
        switch (event.data.action) {
            case "setFindings":
                let semgrepFindings: SemgrepFinding[] = event.data.data.parsed.results.map((scanResult: any) => {
                    let result: SemgrepFinding = {
                        path: scanResult.path,
                        link: scanResult.extra.metadata?.source,
                        message: scanResult.extra.message,
                        checkId: scanResult.check_id,
                        start: {
                            col: scanResult.start.col,
                            line: scanResult.start.line,
                            offset: scanResult.start.offset
                        },
                        end: {
                            col: scanResult.end.col,
                            line: scanResult.end.line,
                            offset: scanResult.end.offset
                        }
                    };

                    return result;
                });

                // Get unique rules
                let symbols: CheckFilterItem[] = []
                semgrepFindings.forEach(item => {
                    if (!symbols.find((value: CheckFilterItem) => value.checkId === item.checkId)) {
                        symbols.push({ checkId: item.checkId, message: item.message });
                    }
                });

                this.setState({ findings: semgrepFindings, rootPath: event.data.data.path, rulesFilter: { all: symbols, selected: [...symbols], }, pathFilter: { exclude: "", include: "" } });
                break;
            case "setRootPath":
                this.setState({ rootPath: event.data.data.path, rulesFilter: { all: [], selected: [] }, pathFilter: { include: "", exclude: "" } });
                break;
            default:
                console.error("Unknown message: ", event);

        }
    }

    getFilteredFindings(): SemgrepFinding[] {
        let result = this.state.findings;
        result = this.filterFindingsByRules(result);
        result = this.filterFindingsByPathInclude(result);
        result = this.filterFindingsByPathExclude(result);

        return result;
    }

    filterFindingsByRules(findings: SemgrepFinding[]): SemgrepFinding[] {
        let selectedRuleIds = this.state.rulesFilter.selected.map((rule) => rule.checkId);
        return findings.filter((finding) =>
            selectedRuleIds.findIndex((selectedRuleId) =>
                selectedRuleId === finding.checkId) > -1);
    }

    filterFindingsByPathInclude(findings: SemgrepFinding[]): SemgrepFinding[] {
        let pathFilter = this.state.pathFilter.include;
        if (pathFilter.length == 0) {
            return findings;
        }

        let pathFilterParsed = picomatch(pathFilter);

        return findings.filter((finding) => pathFilterParsed(finding.path));
    }

    filterFindingsByPathExclude(findings: SemgrepFinding[]): SemgrepFinding[] {
        let pathFilter = this.state.pathFilter.exclude;
        if (pathFilter.length == 0) {
            return findings;
        }

        let pathFilterParsed = picomatch(pathFilter);

        return findings.filter((finding) => !pathFilterParsed(finding.path));
    }

    render(): JSX.Element {
        window.addEventListener('message', (e) => this.nativeMessageHandler(e));

        vscode.postMessage({ command: "ready" });

        return (<div>
            <h1>Findings</h1>
            {
                this.state && this.state.findings ?
                    <div className="vscode-semgrep__filter-header">
                        <label id="rule-filter-label">Filter by rule</label>
                        <MultiSelect
                            className='vscode-semgrep__multiselect'
                            options={this.state.rulesFilter.all.map((rule) => { return { value: rule.checkId, label: rule.message } })}
                            value={this.state.rulesFilter.selected.map((rule) => { return { value: rule.checkId, label: rule.message } })}
                            onChange={(e: any) => this.handleFindingSelect(e)}
                            labelledBy="#rule-filter-label"
                        />
                    </div> :
                    <button onClick={this.handleOpenButton}>Open</button>
            }
            {
                this.state && this.state.findings ?
                    <div className="vscode-semgrep__filter-header">
                        <label id="path-filter-include-label">Include paths:</label>
                        <input onChange={(e: React.BaseSyntheticEvent) => this.handlePathFilterIncludeChange(e)} />

                        <label id="path-filter-exclude-label">Exclude paths:</label>
                        <input onChange={(e: React.BaseSyntheticEvent) => this.handlePathFilterExcludeChange(e)} />
                    </div> :
                    ""
            }
            {this.state && this.state.findings ? <FindingsTable findings={this.getFilteredFindings()} root={this.state.rootPath}></FindingsTable> : <p>empty</p>}
        </div>
        );
    }
}
