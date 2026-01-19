// Strict status types as per "Contract Lifecycle" requirement
export type ContractStatus = 'created' | 'approved' | 'sent' | 'signed' | 'locked' | 'revoked';

export type FieldType = 'text' | 'date' | 'signature' | 'checkbox';

export interface Field {
  id: string;
  type: FieldType;
  label: string;
  value?: string; // Used when filling the contract
}

export interface Blueprint {
  id: string;
  name: string;
  fields: Field[]; // Stores metadata: Type, Label
  createdAt: string;
}

export interface Contract {
  id: string;
  blueprintId: string;
  blueprintName: string;
  name: string;
  status: ContractStatus;

  
  fieldValues: Record<string, string>; // Maps field ID to user input
  createdAt: string;
  updatedAt: string;
}