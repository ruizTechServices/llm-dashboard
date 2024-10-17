import React, { useState } from 'react';
import ChatbotInterface from './components/ChatbotInterface';
import { retrieveApi } from './services/api';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';

function App() {
  const [folderTitle, setFolderTitle] = useState('');
  const [fileTitle, setFileTitle] = useState('');
  const [retrievedFileUrl, setRetrievedFileUrl] = useState('');

  const handleRetrieveFile = async () => {
    try {
      const response = await retrieveApi.getFile(folderTitle, fileTitle);
      setRetrievedFileUrl(response.data.url);
    } catch (error) {
      console.error('Error retrieving file:', error);
      alert('Error retrieving file. Please check the folder and file titles.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">LLM Dashboard</h1>
        <div className="grid grid-cols-1 gap-8">
          <ChatbotInterface />
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">File Retrieval</h2>
            <div className="flex gap-2 mb-4">
              <Input
                placeholder="Folder Title"
                value={folderTitle}
                onChange={(e) => setFolderTitle(e.target.value)}
              />
              <Input
                placeholder="File Title"
                value={fileTitle}
                onChange={(e) => setFileTitle(e.target.value)}
              />
              <Button onClick={handleRetrieveFile}>Retrieve File</Button>
            </div>
            {retrievedFileUrl && (
              <div>
                <p>Retrieved File:</p>
                <img src={retrievedFileUrl} alt="Retrieved File" className="max-w-full h-auto" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;