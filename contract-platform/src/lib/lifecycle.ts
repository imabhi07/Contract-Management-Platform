import { ContractStatus } from '@/types';

// Defines allowed next steps for each status [cite: 28]
const TRANSITIONS: Record<ContractStatus, ContractStatus[]> = {
  created: ['approved', 'revoked'],
  approved: ['sent', 'revoked'],
  sent: ['signed', 'revoked'],
  signed: ['locked', 'revoked'],
  locked: [], // Locked contracts cannot be edited [cite: 31]
  revoked: [] // Revoked contracts cannot proceed [cite: 32]
};

export const getAvailableActions = (current: ContractStatus): ContractStatus[] => {
  return TRANSITIONS[current] || [];
};

export const canEditContract = (status: ContractStatus): boolean => {
  return status !== 'locked' && status !== 'revoked';
};