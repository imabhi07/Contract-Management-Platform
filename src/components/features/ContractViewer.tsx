'use client';

import StatusTimeline from './StatusTimeline';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { getAvailableActions, canEditContract } from '@/lib/lifecycle';
import { ContractStatus } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CheckCircle, Lock, AlertCircle } from 'lucide-react'; // Added AlertCircle

interface Props {
  contractId: string;
}

export default function ContractViewer({ contractId }: Props) {
  const router = useRouter();
  
  // 1. Get Data from Store
  const contract = useStore((state) => state.contracts.find((c) => c.id === contractId));
  const blueprints = useStore((state) => state.blueprints);
  const updateStatus = useStore((state) => state.updateContractStatus);
  const updateFields = useStore((state) => state.updateContractFields);

  // 2. Find the blueprint to know what fields to render
  const blueprint = blueprints.find((b) => b.id === contract?.blueprintId);

  if (!contract || !blueprint) {
    return <div className="p-8 text-center">Contract not found.</div>;
  }

  const isEditable = canEditContract(contract.status);
  const nextActions = getAvailableActions(contract.status);

  // --- VALIDATION HELPER ---
  const areAllFieldsFilled = blueprint.fields.every((field) => {
    const val = contract.fieldValues[field.id];
    return val && val.trim().length > 0;
  });

  // 3. Handle Input Changes
  const handleFieldChange = (fieldId: string, value: string) => {
    updateFields(contract.id, { [fieldId]: value });
  };

  // 4. Handle Lifecycle Transitions
  const handleStatusChange = (newStatus: ContractStatus) => {
    updateStatus(contract.id, newStatus);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Timeline Component */}
      <StatusTimeline status={contract.status} />

      {/* HEADER: Status & Actions */}
      <div className="bg-white p-6 rounded-lg shadow-sm border flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h1 className="text-2xl font-bold text-gray-900">{contract.name}</h1>
            <p className="text-gray-500 text-sm">Template: {contract.blueprintName}</p>
        </div>
        
        <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 uppercase font-bold tracking-wider">Status:</span>
                <span className={`px-3 py-1 rounded-full text-sm font-bold 
                    ${contract.status === 'signed' ? 'bg-green-100 text-green-800' : 
                      contract.status === 'revoked' ? 'bg-red-100 text-red-800' : 
                      'bg-blue-100 text-blue-800'}`}>
                    {contract.status.toUpperCase()}
                </span>
            </div>
            
            {/* Lifecycle Buttons */}
            <div className="flex gap-2">
                {nextActions.map((action) => {
                    const isSignAction = action === 'signed';
                    const isDisabled = isSignAction && !areAllFieldsFilled;

                    return (
                        <Button 
                            key={action}
                            onClick={() => handleStatusChange(action)}
                            variant={action === 'revoked' ? 'danger' : 'primary'}
                            className={`capitalize ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={isDisabled}
                        >
                            {action === 'signed' ? 'Sign Contract' : `Mark as ${action}`}
                        </Button>
                    );
                })}
            </div>

            {/* --- NEW: VISIBLE ERROR IF FORM IS INCOMPLETE --- */}
            {contract.status === 'sent' && !areAllFieldsFilled && (
                <div className="flex items-center gap-1.5 text-red-600 animate-in fade-in slide-in-from-top-1">
                    <AlertCircle size={14} />
                    <span className="text-xs font-bold">Please fill all fields to sign</span>
                </div>
            )}

        </div>
      </div>

      {/* BODY: Contract Form */}
      <div className="bg-white p-8 rounded-lg shadow-sm border space-y-6 relative">
        {/* Visual Overlay if Locked */}
        {!isEditable && (
            <div className="absolute top-4 right-4 text-gray-400 flex items-center gap-1">
                <Lock size={16} /> Read Only
            </div>
        )}

        {blueprint.fields.map((field) => {
            const value = contract.fieldValues[field.id] || '';
            
            return (
                <div key={field.id} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                        {field.label}
                    </label>
                    
                    {field.type === 'text' && (
                        <Input 
                            disabled={!isEditable}
                            value={value}
                            onChange={(e) => handleFieldChange(field.id, e.target.value)}
                            placeholder="Enter text..."
                            className={!value && isEditable && contract.status === 'sent' ? "border-red-300 focus:ring-red-200" : ""}
                        />
                    )}

                    {field.type === 'date' && (
                        <Input 
                            type="date"
                            disabled={!isEditable}
                            value={value}
                            onChange={(e) => handleFieldChange(field.id, e.target.value)}
                            className={!value && isEditable && contract.status === 'sent' ? "border-red-300 focus:ring-red-200" : ""}
                        />
                    )}
                    
                    {field.type === 'checkbox' && (
                        <div className="flex items-center gap-2">
                            <input 
                                type="checkbox"
                                disabled={!isEditable}
                                checked={value === 'true'}
                                onChange={(e) => handleFieldChange(field.id, e.target.checked ? 'true' : 'false')}
                                className="w-4 h-4 text-blue-600 rounded"
                            />
                            <span className={`text-sm ${!value && isEditable && contract.status === 'sent' ? "text-red-500 font-medium" : "text-gray-600"}`}>
                                Yes, I agree
                            </span>
                        </div>
                    )}

                    {field.type === 'signature' && (
                        <div className={`border-2 border-dashed rounded-lg p-4 transition-colors 
                            ${value ? 'bg-blue-50 border-blue-200' : 
                              (!value && isEditable && contract.status === 'sent') ? 'bg-red-50 border-red-200' : 'bg-gray-50'}
                        `}>
                            {value ? (
                                <div className="text-blue-800 font-script text-xl italic flex items-center gap-2">
                                    <CheckCircle size={20} /> Signed by: {value}
                                </div>
                            ) : (
                                <Input 
                                    disabled={!isEditable}
                                    placeholder="Type name to sign..."
                                    value={value}
                                    onChange={(e) => handleFieldChange(field.id, e.target.value)}
                                    className="bg-transparent border-none shadow-none focus:ring-0 font-serif italic text-lg placeholder:text-gray-400"
                                />
                            )}
                        </div>
                    )}
                </div>
            );
        })}
      </div>
    </div>
  );
}