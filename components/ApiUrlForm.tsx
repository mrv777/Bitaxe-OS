import React from 'react';

interface ApiUrlFormProps {
  onSubmit: () => void;
  error: boolean;
  apiUrl: string;
}

const ApiUrlForm: React.FC<ApiUrlFormProps> = ({ onSubmit, error, apiUrl }) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newApiUrl = formData.get('apiUrl') as string;
    
    let correctedUrl = newApiUrl.trim();

    localStorage.setItem('bitaxeApiUrl', correctedUrl);
    onSubmit();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Welcome to Bitaxe Dashboard</h1>
      {error && <p className="mb-4 text-center text-red-500">ERROR - Please check your API URL and try again.</p>}
      <p className="mb-4 text-center">Please provide the IP address of your Bitaxe to continue:</p>
      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <div className="flex items-center py-2 gap-2">
          <input 
              className="input input-bordered input-primary w-full" 
              type="text" 
            name="apiUrl" 
            placeholder="e.g., 192.168.1.100" 
            aria-label="Bitaxe IP Address"
            defaultValue={apiUrl}
          />
          <button 
            className="btn btn-primary" 
            type="submit"
          >
            Connect
          </button>
        </div>
      </form>
    </div>
  );
};

export default ApiUrlForm;