import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Blueprint, Contract, ContractStatus, Field } from '@/types';

interface AppState {
  blueprints: Blueprint[];
  contracts: Contract[];
  
  // Actions
  addBlueprint: (blueprint: Blueprint) => void;
  createContract: (blueprintId: string, name: string) => void;
  updateContractStatus: (id: string, status: ContractStatus) => void;
  updateContractFields: (id: string, values: Record<string, string>) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      blueprints: [],
      contracts: [],

      // 1. Blueprint Creation Logic
      addBlueprint: (blueprint) => 
  set((state) => ({ 
    blueprints: [...state.blueprints, blueprint] 
  })),

      // 2. Contract Creation Logic (Inherits fields from Blueprint) [cite: 24]
      createContract: (blueprintId, name) => {
        const bp = get().blueprints.find(b => b.id === blueprintId);
        if (!bp) return;

        const newContract: Contract = {
          id: crypto.randomUUID(),
          blueprintId: bp.id,
          blueprintName: bp.name,
          name,
          status: 'created', // Initial state [cite: 28]
          fieldValues: {},
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({ contracts: [...state.contracts, newContract] }));
      },

      // 3. Status Updates
      updateContractStatus: (id, status) => set((state) => ({
        contracts: state.contracts.map(c => 
          c.id === id ? { ...c, status, updatedAt: new Date().toISOString() } : c
        )
      })),

      // 4. Field Value Updates
      updateContractFields: (id, values) => set((state) => ({
        contracts: state.contracts.map(c => 
          c.id === id ? { ...c, fieldValues: { ...c.fieldValues, ...values } } : c
        )
      })),
    }),
    { name: 'contract-platform-storage' } // Persists data to LocalStorage
  )
);