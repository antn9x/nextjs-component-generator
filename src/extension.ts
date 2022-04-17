import kebabCase from 'lodash/kebabCase';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { posix } from 'path';
import { componentTemplate, pageTemplate } from './templates';
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {

  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "react-component-generator" is now active!');
  if (!vscode.workspace.workspaceFolders) {
    return vscode.window.showInformationMessage('No folder or workspace opened');
  }
  const folderUri = vscode.workspace.workspaceFolders[0].uri;
  const folder = folderUri.with({ path: posix.join(folderUri.path, 'src', 'containers') });
  const moduleList = ['Common'];
  for (const [name, type] of await vscode.workspace.fs.readDirectory(folder)) {
    if (type === vscode.FileType.Directory) {
      moduleList.push(name);
    }
  }
  context.workspaceState.update('containers', moduleList);
  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand('react-component-generator.createNewPage', async () => {
    const page = await vscode.window.showInputBox({
      value: '',
      placeHolder: 'Page name (Pascal case)',
      // validateInput: text => {
      //   vscode.window.showInformationMessage(`Validating: ${text}`);
      //   return text === '123' ? 'Not 123!' : null;
      // }
    });
    const pageStr = pageTemplate(page);
    const pageData = Buffer.from(pageStr, 'utf8');

    const filePageUri = folderUri.with({ path: posix.join(folderUri.path, 'pages', `${kebabCase(page)}.js`) });
    const folderContainerUri = folderUri.with({ path: posix.join(folderUri.path, 'src', 'containers', `${page}`) });
    const fileIndexUri = folderUri.with({ path: posix.join(folderContainerUri.path, `index.js`) });

    await vscode.workspace.fs.createDirectory(folderContainerUri);
    await vscode.workspace.fs.writeFile(filePageUri, pageData);

    const indexStr = componentTemplate(page);
    const indexData = Buffer.from(indexStr, 'utf8');
    await vscode.workspace.fs.writeFile(fileIndexUri, indexData);
    // The code you place here will be executed every time your command is executed
    // Display a message box to the user
    vscode.window.showInformationMessage('Generated page!');
  });

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }
