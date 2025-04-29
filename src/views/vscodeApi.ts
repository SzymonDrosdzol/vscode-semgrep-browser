import { ReactPanelMsg } from "../models/reactPanelMessage";

export interface VsCodeApi {
    postMessage(msg: ReactPanelMsg): void;
    //setState(state: VariantAnalysisState): void;
}

declare const acquireVsCodeApi: () => VsCodeApi;
export const vscode = acquireVsCodeApi();
