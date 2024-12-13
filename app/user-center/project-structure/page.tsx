'use client'

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Folder, File, ChevronRight, ChevronDown } from 'lucide-react';

interface FileNode {
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  path?: string;
}

const FileTree: React.FC<{ node: FileNode; level: number }> = ({ node, level }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    if (node.type === 'folder') {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div style={{ marginLeft: `${level * 20}px` }}>
      <div 
        className="flex items-center cursor-pointer hover:bg-gray-100 p-1 rounded"
        onClick={toggleOpen}
      >
        {node.type === 'folder' && (
          isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />
        )}
        {node.type === 'folder' ? <Folder size={16} className="mr-2" /> : <File size={16} className="mr-2" />}
        <span>{node.name}</span>
      </div>
      {isOpen && node.children && (
        <div>
          {node.children.map((child, index) => (
            <FileTree key={index} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export default function ProjectStructure() {
  const [structure, setStructure] = useState<FileNode | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjectStructure = async () => {
      try {
        const response = await fetch('/api/project-structure');
        if (!response.ok) {
          throw new Error('Failed to fetch project structure');
        }
        const data = await response.json();
        setStructure(data);
      } catch (err) {
        console.error('Error fetching project structure:', err);
        setError('Failed to load project structure. Please try again later.');
      }
    };

    fetchProjectStructure();
  }, []);

  useEffect(() => {
    // 通知父窗口调整 iframe 高度
    const sendHeight = () => {
      if (window.parent) {
        window.parent.postMessage({ type: 'resize', height: document.body.scrollHeight }, '*');
      }
    };

    sendHeight();
    window.addEventListener('resize', sendHeight);

    return () => window.removeEventListener('resize', sendHeight);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 gradient-text">项目结构</h1>
      <Card>
        <CardHeader>
          <CardTitle>文件结构</CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <p className="text-red-500">{error}</p>
          ) : structure ? (
            <FileTree node={structure} level={0} />
          ) : (
            <p>加载中...</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

