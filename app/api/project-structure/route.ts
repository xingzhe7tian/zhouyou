import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

function getProjectStructure(dir: string, basePath: string = ''): any {
  const result: any = { name: path.basename(dir), type: 'folder', children: [] };
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);
    const relativePath = path.join(basePath, file);

    if (stats.isDirectory()) {
      result.children.push(getProjectStructure(filePath, relativePath));
    } else {
      result.children.push({
        name: file,
        type: 'file',
        path: relativePath,
      });
    }
  });

  return result;
}

export async function GET() {
  const projectRoot = process.cwd();
  const structure = getProjectStructure(projectRoot);
  return NextResponse.json(structure);
}

