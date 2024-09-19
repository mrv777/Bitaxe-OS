import React, { useState } from "react";

interface AddToSwarmFormProps {
  onSubmit: (newIp: string) => Promise<void>;
}

const AddToSwarmForm: React.FC<AddToSwarmFormProps> = ({ onSubmit }) => {
  const [newIp, setNewIp] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(newIp);
    setNewIp("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={newIp}
        onChange={(e) => setNewIp(e.target.value)}
        placeholder="Enter IP address"
        className="input input-bordered w-full"
      />
      <button type="submit" className="btn btn-primary">
        Add to Swarm
      </button>
    </form>
  );
};

export default AddToSwarmForm;
