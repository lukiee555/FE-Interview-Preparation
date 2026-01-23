import "./styles.css";
import mockData from "./mockData";
import { useState } from "react";

/*
  Each item in our file system looks like this:
  - id: unique identifier
  - name: file or folder name
  - children:
      - exists → this item is a folder
      - missing → this item is a file
*/
interface FileData {
  id: number;
  name: string;
  children?: FileData[];
}

/* ======================================================
   Utility Functions (Core Logic)
   ====================================================== */

/*
  addNode:
  --------
  Purpose:
  Add a new file or folder INSIDE the folder the user clicked.

  How it works in simple terms:
  - Go through every item in the file tree
  - If we find the folder with the matching ID:
      → add the new file/folder inside it
  - If not:
      → keep searching inside its children (folders inside folders)
  - Always return a NEW copy (React rule: never mutate state directly)
*/
let idCounter = 10000;

const addNode = (
  tree: FileData[],
  parentId: number,
  newNode: FileData
): FileData[] => {
  return tree.map((node) => {
    // If this is the folder we clicked, add the new item inside it
    if (node.id === parentId && node.children) {
      return {
        ...node,
        children: [...node.children, newNode],
      };
    }

    // Otherwise, if this node has children, keep searching deeper
    if (node.children) {
      return {
        ...node,
        children: addNode(node.children, parentId, newNode),
      };
    }

    // If it's a file, return it unchanged
    return node;
  });
};

/*
  removeNode:
  -----------
  Purpose:
  Remove a file or folder from anywhere in the tree.

  How it works in simple terms:
  - Remove the item with the matching ID
  - If the removed item is a folder:
      → everything inside it disappears automatically
  - Continue this process recursively for nested folders
*/
const removeNode = (tree: FileData[], id: number): FileData[] => {
  return (
    tree
      // Remove the node with the matching ID
      .filter((node) => node.id !== id)
      // Continue searching inside children
      .map((node) =>
        node.children
          ? { ...node, children: removeNode(node.children, id) }
          : node
      )
  );
};

/* ======================================================
   UI Components
   ====================================================== */

const FileObject = ({
  file,
  level,
  onAddFile,
  onAddFolder,
  onRemove,
}: {
  file: FileData;
  level: number;
  onAddFile: (id: number) => void;
  onAddFolder: (id: number) => void;
  onRemove: (id: number) => void;
}) => {
  // Local state to control expand/collapse of folders
  const [expanded, setExpanded] = useState(false);

  // If "children" exists, this is a folder
  const isDirectory = Boolean(file.children);

  return (
    <li className="file-item" style={{ marginLeft: level * 12 }}>
      <div>
        {/* Clicking a folder toggles expand/collapse */}
        <button
          className="file-item-button"
          onClick={() => isDirectory && setExpanded(!expanded)}
        >
          {isDirectory ? (expanded ? "📂" : "📁") : "📄"} {file.name}
        </button>

        {/* Remove file or folder */}
        <button onClick={() => onRemove(file.id)}>❌</button>

        {/* Only folders can contain new items */}
        {isDirectory && (
          <>
            <button onClick={() => onAddFile(file.id)}>➕ File</button>
            <button onClick={() => onAddFolder(file.id)}>➕ Folder</button>
          </>
        )}
      </div>

      {/* Render children only if folder is expanded */}
      {isDirectory && expanded && file.children && (
        <FileList
          fileList={file.children}
          level={level + 1}
          onAddFile={onAddFile}
          onAddFolder={onAddFolder}
          onRemove={onRemove}
        />
      )}
    </li>
  );
};

const FileList = ({
  fileList,
  level,
  onAddFile,
  onAddFolder,
  onRemove,
}: {
  fileList: FileData[];
  level: number;
  onAddFile: (id: number) => void;
  onAddFolder: (id: number) => void;
  onRemove: (id: number) => void;
}) => {
  /*
    Sorting rules:
    - Folders first
    - Files after
    - Alphabetical order within each group
  */
  const directories = fileList
    .filter((f) => f.children)
    .sort((a, b) => a.name.localeCompare(b.name));

  const files = fileList
    .filter((f) => !f.children)
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <ul className="file-list">
      {[...directories, ...files].map((file) => (
        <FileObject
          key={file.id}
          file={file}
          level={level}
          onAddFile={onAddFile}
          onAddFolder={onAddFolder}
          onRemove={onRemove}
        />
      ))}
    </ul>
  );
};

/* ======================================================
   App Component (State Owner)
   ====================================================== */

export default function App() {
  // This state holds the entire file system
  const [fileData, setFileData] = useState<FileData[]>(mockData);

  /*
    Add File:
    - Ask user for name
    - Create file object
    - Insert it into the correct folder
  */
  const handleAddFile = (parentId: number) => {
    const name = prompt("File name?");
    if (!name) return;

    setFileData((prev) =>
      addNode(prev, parentId, {
        id: ++idCounter,
        name,
      })
    );
  };

  /*
    Add Folder:
    - Same as file
    - But children: [] makes it a folder
  */
  const handleAddFolder = (parentId: number) => {
    const name = prompt("Folder name?");
    if (!name) return;

    setFileData((prev) =>
      addNode(prev, parentId, {
        id: ++idCounter,
        name,
        children: [],
      })
    );
  };

  /*
    Remove File or Folder:
    - Calls removeNode
    - React re-renders automatically
  */
  const handleRemove = (id: number) => {
    setFileData((prev) => removeNode(prev, id));
  };

  return (
    <div className="App">
      <FileList
        fileList={fileData}
        level={0}
        onAddFile={handleAddFile}
        onAddFolder={handleAddFolder}
        onRemove={handleRemove}
      />
    </div>
  );
}
