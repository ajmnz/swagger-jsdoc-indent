import * as prettier from "prettier";
import * as vscode from "vscode";

export const formatSwagger = (comment: string) => {
  /**
   * Strip swagger spec.
   *
   * Captures all text between @swagger | @openapi and  `*\/`
   * which is the swagger spec.
   */
  let match = comment.match(
    /(?<tag>@swagger\s|@openapi\s)(?<spec>[\s\S]+?)(?=^.*\*\/+)/m
  );

  if (
    !match ||
    !match.groups ||
    !("tag" in match.groups) ||
    !("spec" in match.groups)
  ) {
    return;
  }

  let { spec, tag }: { tag: string; spec: string } = match.groups as {
    tag: string;
    spec: string;
  };

  // Get indentation
  let tagIndentation: string | RegExpMatchArray | null = comment.match(
    /^(?<indent>\s*)(?:@swagger|@openapi)/m
  );

  if (!tagIndentation || !tagIndentation.groups?.indent) {
    tagIndentation = "";
  } else {
    tagIndentation = tagIndentation.groups.indent;
  }

  try {
    // Run prettier on spec to fix any indentation errors
    spec = prettier.format(spec, {
      parser: "yaml",
    });

    // Indent each line and add the asterisk
    spec = spec
      .split("\n")
      .map((e) => tagIndentation + " *" + `${e ? " " + e : e}`)
      .join("\n");

    spec = " * " + tag + spec + "\n";

    return comment.replace(match[0], spec);
  } catch (error: any) {
    vscode.window.showErrorMessage(error.message);
    console.log(error);
  }
};

export const unFormatSwagger = (comment: string) => {
  /**
   * Strip swagger spec.
   *
   * Captures all text between @swagger | @openapi and  `*\/`
   * which is the swagger spec.
   */
  let match = comment.match(
    / \* (?<tag>@swagger\s|@openapi\s)(?<spec>[\s\S]+?)(?=^.*\*\/+)/m
  );

  if (
    !match ||
    !match.groups ||
    !("tag" in match.groups) ||
    !("spec" in match.groups)
  ) {
    return;
  }

  let { spec, tag }: { tag: string; spec: string } = match.groups as {
    tag: string;
    spec: string;
  };

  try {
    spec = spec
      .split("\n")
      .map((e) => {
        let match = e.match(/ \* (.*)$/);
        if (!match) {
          return e;
        } else {
          return match[1];
        }
      })
      .join("\n");

    spec = tag + spec;

    return comment.replace(match[0], spec);
  } catch (error: any) {
    vscode.window.showErrorMessage(error.message);
    console.log(error);
  }
};
