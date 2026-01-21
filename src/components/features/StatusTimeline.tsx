import { ContractStatus } from '@/types';
import { Check, Circle, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const STEPS: ContractStatus[] = ['created', 'approved', 'sent', 'signed', 'locked'];

export default function StatusTimeline({ status }: { status: ContractStatus }) {
  if (status === 'revoked') {
    return (
      <div className="w-full bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-center gap-2 text-red-700 font-bold mb-6">
        <XCircle size={20} /> CONTRACT REVOKED
      </div>
    );
  }

  const currentStepIndex = STEPS.indexOf(status);

  return (
    <div className="w-full py-6 mb-4">
      <div className="relative flex justify-between items-center w-full max-w-3xl mx-auto">
        {/* Background Line */}
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -z-10 rounded" />
        
        {/* Active Progress Line */}
        <motion.div 
          className="absolute top-1/2 left-0 h-1 bg-green-500 -z-10 rounded"
          initial={{ width: '0%' }}
          animate={{ width: `${(currentStepIndex / (STEPS.length - 1)) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />

        {STEPS.map((step, index) => {
          const isCompleted = index <= currentStepIndex;
          const isCurrent = index === currentStepIndex;

          return (
            <div key={step} className="flex flex-col items-center gap-2 bg-white px-2">
              <motion.div 
                initial={{ scale: 0.8 }}
                animate={{ scale: isCurrent ? 1.2 : 1 }}
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors 
                  ${isCompleted ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-gray-300 text-gray-300'}
                  ${isCurrent ? 'ring-4 ring-green-100' : ''}
                `}
              >
                {isCompleted ? <Check size={14} strokeWidth={3} /> : <Circle size={10} />}
              </motion.div>
              <span className={`text-xs font-bold uppercase ${isCurrent ? 'text-green-700' : 'text-gray-400'}`}>
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}