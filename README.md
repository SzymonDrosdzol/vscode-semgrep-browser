# README

Semgrep Browser is a Visual Studio Code extension designed to help you work with Semgrep findings. 

## Features

The extension parses a Semgrep scan result in JSON format and allows browsing and filtering the findings in a convenient VS Code view. Additionally, it allows you to quickly navigate to the vulnerable place in the code.

## How to install

Download the vsix file from the releases page and install it in VS Code.

## How to use

The extension introduces a command `Start Semgrep Findings View`. Use it to open a tab that allows you to open and browse the findings in JSON file format.

## Next steps

Below is a list of possible expansions of the extension's capabilities:

- Setting status of findings.
- More integration with VS Code:
  - Inline findings.
- Detailed view for each finding.
- UI improvements (duh!).

## Release notes

### 0.0.1

Initial release

### 0.0.2

#### Bug fixes

- Semgrep Viewer no longer loses state when a user navigates away from the tab
- Textboxes font color now changes with VSCode Theme

### 0.0.3

#### Bug fix

- Resolved a url issue that prevented the browser tab from loading the JavaScript app

### 0.0.4

#### Bug fixes

- Fixed the side-panel button "Provide Semgrep Json File"
- Font color should now align with VS Code theme
- The opened result file is preserved when the user clicks away from the tab
- The user can open another result file when one is already opened

#### Features

- Added an external link to the Semgrep rule

## Credits 

Contact the author: szymon.drosdzol@gmail.com

**Enjoy!**
