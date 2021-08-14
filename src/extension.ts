import * as vscode from "vscode";
import { formatSwagger } from "./utils";

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "swagger-indent.format",
    () => {
      const editor = vscode.window.activeTextEditor;

      if (editor) {
        const selection = editor.selection;
        const text = editor.document.getText(selection);
        const formatted = formatSwagger(text);

        if (!formatted) {
          vscode.window.showErrorMessage(
            "An error occurred while formatting your comment"
          );
          return;
        }

        editor.edit((e) => {
          e.replace(selection, formatted);
        });
      } else {
        vscode.window.showWarningMessage(
          "Please open a file with swagger comments in it"
        );
        return;
      }
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
