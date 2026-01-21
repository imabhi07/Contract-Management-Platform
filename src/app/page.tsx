'use client';

import { useState } from 'react';
import Link from 'next/link'; //
import { useStore } from '@/store/useStore';
import ContractTable from '@/components/features/ContractTable';
import { Button } from '@/components/ui/Button';
import { Plus, Database, X, FilePlus } from 'lucide-react'; // Added FilePlus back

// --- SEED BUTTON (Helper for testing) ---
const SeedButton = () => {
  const addBlueprint = useStore((state) => state.addBlueprint);
  
  const handleSeed = () => {
    addBlueprint({
        id: 'bp_nda_v1',
        name: 'Standard Non-Disclosure Agreement',
        createdAt: new Date().toISOString(),
        fields: [
            { id: 'counterparty', type: 'text', label: 'Counterparty Name' },
            { id: 'effective_date', type: 'date', label: 'Effective Date' },
            { id: 'terms_agreed', type: 'checkbox', label: 'I agree to the terms above' },
            { id: 'signature', type: 'signature', label: 'Authorized Signature' }
        ]
    });
    alert('✅ Seed Data Loaded! Select "Standard NDA" below to create a contract.');
  };

  return (
    <Button onClick={handleSeed} variant="secondary" className="bg-amber-100 text-amber-900 border-amber-200 hover:bg-amber-200 text-xs">
      <Database size={14} className="mr-2" /> Seed Data
    </Button>
  );
};

export default function Home() {
  const contracts = useStore((state) => state.contracts);
  const blueprints = useStore((state) => state.blueprints);
  const createContract = useStore((state) => state.createContract);
  
  // --- STATE FOR MODAL & SELECTION ---
  const [selectedBlueprint, setSelectedBlueprint] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newContractName, setNewContractName] = useState('');
  const [error, setError] = useState('');

  // 1. Triggered when clicking "Create"
  const handleOpenModal = () => {
    if (!selectedBlueprint) return;
    setIsModalOpen(true);
    setNewContractName(''); 
    setError('');
  };

  // 2. Triggered when clicking "Confirm" inside the modal
  const handleConfirmCreate = () => {
    if (!newContractName.trim()) {
      setError('Name is required.');
      return;
    }

    const nameExists = contracts.some(
      (c) => c.name.trim().toLowerCase() === newContractName.trim().toLowerCase()
    );

    if (nameExists) {
      setError('A contract with this name already exists.');
      return;
    }

    createContract(selectedBlueprint, newContractName);
    setIsModalOpen(false);       
    setSelectedBlueprint('');    
    setNewContractName('');      
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Contract Management</h1>
            <p className="text-gray-500">Manage lifecycle, approvals, and signatures.</p>
          </div>
          
          <div className="flex gap-3 items-center">
            {/* Seed Button for Testing */}
            <SeedButton />

            {/* RESTORED: New Blueprint Button */}
            <Link href="/blueprints/new">
              <Button variant="secondary" className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700">
                <FilePlus size={16} className="mr-2 inline" /> New Blueprint
              </Button>
            </Link>
          </div>
        </div>

        {/* Quick Action Bar */}
        <div className="bg-white border border-blue-100 p-6 rounded-xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-gray-900">Start a New Contract</h3>
            <p className="text-sm text-gray-500">Select a blueprint to generate a draft.</p>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <select 
              className="flex-1 border border-gray-300 rounded-md px-3 py-2 bg-white min-w-[250px] text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              value={selectedBlueprint}
              onChange={(e) => setSelectedBlueprint(e.target.value)}
            >
              <option value="">-- Select Blueprint --</option>
              {blueprints.map(bp => (
                <option key={bp.id} value={bp.id}>{bp.name}</option>
              ))}
            </select>
            <Button onClick={handleOpenModal} disabled={!selectedBlueprint}>
              <Plus size={16} className="mr-2 inline" /> Create
            </Button>
          </div>
        </div>

        {/* The Dashboard Table */}
        <ContractTable />
      </div>

      {/* --- CUSTOM MODAL --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 transform transition-all scale-100">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">Name Your Contract</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contract Name
                </label>
                <input 
                  autoFocus
                  type="text"
                  placeholder="e.g., 'Google NDA'"
                  className={`w-full border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500 ${error ? 'border-red-500' : 'border-gray-300'}`}
                  value={newContractName}
                  onChange={(e) => setNewContractName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleConfirmCreate()}
                />
                {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
              </div>

              <div className="bg-blue-50 text-blue-800 text-xs p-3 rounded-lg">
                <strong>Template Selected:</strong> {blueprints.find(b => b.id === selectedBlueprint)?.name}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleConfirmCreate}>
                Confirm & Create
              </Button>
            </div>

          </div>
        </div>
      )}

    </main>
  );
}