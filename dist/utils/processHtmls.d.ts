/**
 * Creates index.ts file for all HTML files in the given folder.
 * Important: This function assumes the following:
 * - The HTML files are organized in the main folder, or in subfolders.
 * - The output index.ts file will be created in the main folder.
 * - The keys for the HTML files will be generated as 'subfolder-filename' or just 'filename' if in the main folder.
 * - only one level of subfolders is supported.
 * @param htmlDir example: './src/html/'. In this case, index.ts will be created under ./src/html/index.ts.
 */
export declare function processHtmls(htmlDir: string, collectionName: string): void;
