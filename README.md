# README

Semgrep Browser is a Visual Studio Code extension designed to help working with Semgrep findings. 

## Features

The extension parses a semgrep scan result in JSON format and allows browsing and filtering the findings in a convenient VSCode view. Additionaly, it allows to quickly navigate to the vulnerable place in the code.

## How to install

Download the internal release version from https://github.com/doyensec/vsc-semgrep-browser/releases.

## How to use

The extension introduces a command `Start Semgrep Findings View`. Use it to open a tab that allows to open and browse the findings in JSON file format.

## Next steps

Below's a list o possible expansions of the extension's capabilities:

- Setting status of findings.
- More integration with VSCode:
  - Scanning in background.
  - Inline findings.
- Detailed view for each finding.
- UI improvements (duh!).

## Known issues

- The left drawer button "Open Semgrep File" is broken. Use the command "Start Semgrep Findings View"

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
- Font color should now align with VSCode theme
- The opened result file is preserved when user clicks away from the tab
- The user can open other result file when one is already opened

#### Features

- Added an external link to the Semgrep rule

## Credits 

Created with ♥ by Doyensec

Contact the author: szymon@doyensec.com

**Enjoy!**
