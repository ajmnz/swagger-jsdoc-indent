import * as vscode from "vscode";
import { formatSwagger, unFormatSwagger } from "./utils";

function findBackward(text: string, index: number): number {
  for (let i = index; i >= 1; i--) {
    let char1 = text.charAt(i);
    let char2 = text.charAt(i - 1);
    if (char1 === "*" && char2 === "/") {
      return i - 1;
    }
  }
  //we are geting to the edge
  return -1;
}

function findForward(text: string, index: number): number {
  for (let i = index; i < text.length - 1; i++) {
    let char1 = text.charAt(i);
    let char2 = text.charAt(i + 1);
    if (char1 === "*" && char2 === "/") {
      return i + 1;
    }
  }
  //we are geting to the edge
  return -1;
}

function findSelection(selection: vscode.Selection): vscode.Selection {
  const editor = vscode.window.activeTextEditor;

  if (!editor) {
    return selection;
  }

  let selectionStart = editor.document.offsetAt(selection.start) - 1;
  let selectionEnd = editor.document.offsetAt(selection.end);
  let text = editor.document.getText();

  var backwardIndex = findBackward(text, selectionStart);
  var forwardIndex = findForward(text, selectionEnd);

  if (backwardIndex !== -1 && forwardIndex !== -1) {
    return new vscode.Selection(
      editor.document.positionAt(backwardIndex - 1), //convert text index to vs selection index
      editor.document.positionAt(forwardIndex + 1)
    );
  }
  return selection;
}

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand("swagger-jsdoc-indent.format", () => {
      const editor = vscode.window.activeTextEditor;

      if (editor) {
        const selection = findSelection(editor.selection);

        const text = editor.document.getText(selection);

        if (!text) {
          vscode.window.showErrorMessage(
            "Please select a swagger-jsdoc comment"
          );
          return;
        }

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
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("swagger-jsdoc-indent.unformat", () => {
      const editor = vscode.window.activeTextEditor;

      if (editor) {
        const selection = findSelection(editor.selection);
        const text = editor.document.getText(selection);

        if (!text) {
          vscode.window.showErrorMessage(
            "Please select a swagger-jsdoc comment"
          );
          return;
        }

        const formatted = unFormatSwagger(text);

        if (!formatted) {
          vscode.window.showErrorMessage(
            "An error occurred while unformatting your comment"
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
    })
  );
}

export function deactivate() {}
