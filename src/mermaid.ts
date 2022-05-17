/**
 * A wrapper of mermaid CLI
 * https://github.com/mermaid-js/mermaid-cli
 */

import * as utility from "./utility";

export async function mermaidToPNG(
  mermaidCode: string,
  pngFilePath: string,
  projectDirectoryPath: string,
  themeName,
): Promise<string> {
  const info = await utility.tempOpen({
    prefix: "mume-mermaid",
    suffix: ".mmd",
  });
  await utility.write(info.fd, mermaidCode);

  const config = await utility.tempOpen({
    prefix: "mermaid",
    suffix: ".json",
  });
  await config.write(
    info.fd,
    `
{
  "args": ["--no-sandbox"]
}`,
  );

  if (!themeName) {
    themeName = "null";
  }
  try {
    await utility.execFile(
      "mmdc",
      [
        "--theme",
        themeName,
        "--input",
        info.path,
        "--output",
        pngFilePath,
        "-p",
        config.path,
      ],
      {
        shell: true,
        cwd: projectDirectoryPath,
      },
    );
    return pngFilePath;
  } catch (error) {
    throw new Error(
      "mermaid CLI is required to be installed.\nCheck https://github.com/mermaid-js/mermaid-cli for more information.\n\n" +
        error.toString(),
    );
  }
}
