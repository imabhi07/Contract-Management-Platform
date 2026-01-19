'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useStore } from '@/store/useStore'; 
import { Contract, ContractStatus } from '@/types'; 
import { FileText, ChevronRight, Settings, Lock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

// --- 1. Status Badge Component ---
const StatusBadge = ({ status }: { status: ContractStatus }) => {
  const styles: Record<string, string> = {
    created: 'bg-gray-100 text-gray-700 border-gray-200',
    approved: 'bg-blue-50 text-blue-700 border-blue-200',
    sent: 'bg-purple-50 text-purple-700 border-purple-200',
    signed: 'bg-green-50 text-green-700 border-green-200',
    locked: 'bg-green-50 text-green-700 border-green-200',
    revoked: 'bg-red-50 text-red-700 border-red-200',
  };
  
  const safeStatus = (status || 'created').toLowerCase();
  
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${styles[safeStatus] || styles.created}`}>
      {safeStatus.toUpperCase()}
    </span>
  );
};

// --- 2. The Restricted Status Menu Component ---
const StatusActionMenu = ({ contract }: { contract: Contract }) => {
  const updateStatus = useStore((state) => state.updateContractStatus);

  const currentStatus = (contract.status || 'created').toLowerCase().trim();
  
  // If the contract is already in a terminal state (Signed/Locked/Revoked),
  // show the locked badge.
  const isLocked = ['signed', 'locked', 'revoked'].includes(currentStatus);

  if (isLocked) {
    return (
        <div className="w-32 py-1.5 px-3 bg-gray-50 border border-gray-200 rounded text-xs font-bold text-gray-400 flex items-center justify-center gap-2 cursor-not-allowed select-none opacity-80">
            <Lock size={12} />
            <span className="uppercase">{currentStatus}</span>
        </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.stopPropagation(); 
    updateStatus(contract.id, e.target.value as ContractStatus);
  };

  return (
    <div className="relative inline-block w-32" onClick={(e) => e.stopPropagation()}>
      <select
        value={contract.status}
        onChange={handleChange}
        className="w-full appearance-none bg-white border border-gray-300 text-gray-700 py-1.5 pl-3 pr-8 rounded text-xs font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer hover:bg-gray-50 transition-colors"
      >
        {/* --- FIXED: Only allow Manual Transitions for Active Stages --- */}
        <option value="created">Draft (Created)</option>
        <option value="approved">Approved</option>
        <option value="sent">Sent to Client</option>
        
        {/* REMOVED: 'Signed', 'Locked', and 'Revoked' 
            These are now impossible to select manually.
            - Signing must happen via the "Sign" button in the Viewer.
            - Locking happens automatically after signing.
        */}
      </select>
      
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
        <Settings size={12} />
      </div>
    </div>
  );
};

// --- 3. Main Table Component ---
type FilterType = 'all' | 'active' | 'pending' | 'signed';

export default function ContractTable() {
  const contracts = useStore((state) => state.contracts);
  const [filter, setFilter] = useState<FilterType>('all');

  const filteredContracts = contracts.filter((c) => {
    switch (filter) {
      case 'active': return c.status !== 'revoked';
      case 'pending': return ['created', 'approved', 'sent'].includes(c.status);
      case 'signed': return ['signed', 'locked'].includes(c.status);
      default: return true;
    }
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50/50">
        <div className="flex items-center gap-2">
            <h3 className="font-bold text-gray-800">Contracts</h3>
            <span className="bg-gray-200 text-gray-600 text-xs px-2 py-0.5 rounded-full font-bold">
                {filteredContracts.length}
            </span>
        </div>
        
        <select
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm bg-white outline-none focus:ring-2 focus:ring-blue-500/20"
            value={filter}
            onChange={(e) => setFilter(e.target.value as FilterType)}
        >
            <option value="all">All Contracts</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="signed">Signed</option>
        </select>
      </div>

      {/* Table Body */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-500 font-semibold border-b border-gray-200 uppercase text-xs tracking-wider">
            <tr>
              <th className="p-4 pl-6">Contract Name</th>
              <th className="p-4">Status</th>
              <th className="p-4">Date</th>
              <th className="p-4 text-center">Change Status</th>
              <th className="p-4 text-right pr-6">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            <AnimatePresence>
              {filteredContracts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-gray-400 italic">
                    No contracts found matching this filter.
                  </td>
                </tr>
              ) : (
                filteredContracts.map((contract, index) => (
                  <motion.tr
                    key={contract.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group hover:bg-gray-50/80 transition-colors"
                  >
                    <td className="p-4 pl-6">
                        <div className="font-bold text-gray-900">{contract.name}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                            <FileText size={12} /> {contract.blueprintName}
                        </div>
                    </td>
                    <td className="p-4">
                        <StatusBadge status={contract.status} />
                    </td>
                    <td className="p-4 text-gray-500 font-mono text-xs">
                      {new Date(contract.createdAt).toLocaleDateString()}
                    </td>
                    
                    <td className="p-4 text-center">
                        <div className="flex justify-center">
                            <StatusActionMenu contract={contract} />
                        </div>
                    </td>

                    <td className="p-4 text-right pr-6">
                      <Link href={`/contracts/${contract.id}`}>
                        <Button variant="secondary" className="h-8 w-8 p-0 rounded-full" title="View Details">
                           <ChevronRight size={16} className="text-gray-400" />
                        </Button>
                      </Link>
                    </td>
                  </motion.tr>
                ))
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </div>
  );
}