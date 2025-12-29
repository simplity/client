import * as fs from 'fs';
import * as path from 'path';

interface HtmlFile {
  key: string;
  content: string;
  relativePath: string;
  subfolder: string;
  filename: string;
}

/**
 * Creates index.ts file for all HTML files in the given folder.
 * Important: This function assumes the following:
 * - The HTML files are organized in the main folder, or in subfolders.
 * - The output index.ts file will be created in the main folder.
 * - The keys for the HTML files will be generated as 'subfolder-filename' or just 'filename' if in the main folder.
 * - only one level of subfolders is supported.
 * @param htmlDir example: './src/html/'. In this case, index.ts will be created under ./src/html/index.ts.
 */
export function processHtmls(htmlDir: string, collectionName: string): void {
  const htmlFiles = scanHtmlFiles(htmlDir);
  writeIndexFile(htmlFiles, htmlDir, collectionName);
}

/**
 * Scan the html directory and collect all HTML files
 */
function scanHtmlFiles(htmlDir: string): HtmlFile[] {
  const htmlFiles: HtmlFile[] = [];

  if (!fs.existsSync(htmlDir)) {
    throw new Error(`Directory not found: ${htmlDir}`);
  }
  const allFolders = [''];

  fs.readdirSync(htmlDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => allFolders.push(dirent.name));

  console.log(`🔍 ${allFolders.length} folders to be scanned for htmls`);
  for (const folder of allFolders) {
    const folderPath = path.join(htmlDir, folder);
    console.log(`🔍 Processing folder: ${folderPath}`);
    fs.readdirSync(folderPath)
      .filter((file) => file.endsWith('.html'))
      .map((file) => {
        const filePath = path.join(folderPath, file);
        console.log(`🔍 \tfile: ${filePath}`);
        const content = fs.readFileSync(filePath, 'utf-8');
        const filename = path.basename(file, '.html');
        const key = folder ? `${folder}-${filename}` : filename;

        htmlFiles.push({
          key,
          content,
          relativePath: path.join(folder, file),
          subfolder: folder,
          filename,
        });
      });
  }
  return htmlFiles;
}

function writeIndexFile(
  htmlFiles: HtmlFile[],
  htmlDir: string,
  collectionName: string
): void {
  const t: string[] = [];
  t.push(
    `// Auto-generated HTML collection. Do not edit manually.\nexport const ${collectionName} = {\n`
  );

  for (const htmlFile of htmlFiles) {
    const escapedContent = escapeForTypeScript(htmlFile.content);
    t.push(`  '${htmlFile.key}': \`${escapedContent}\`,\n`);
  }

  t.push('};');

  const filePath = path.join(htmlDir, 'index.ts');

  fs.writeFileSync(filePath, t.join(''), 'utf-8');
  console.log(`✅ Generated file: ${filePath}`);
}

function escapeForTypeScript(content: string): string {
  return content
    .replace(/\\/g, '\\\\') // Escape backslashes
    .replace(/`/g, '\\`') // Escape backticks
    .replace(/\$\{/g, '\\${'); // Escape template literal expressions
}
