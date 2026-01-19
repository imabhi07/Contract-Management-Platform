'use client';

import { useParams } from 'next/navigation';
import ContractViewer from '@/components/features/ContractViewer';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ContractPage() {
  const params = useParams();
  // Ensure ID is a string (Next.js params can be array in some configs, safer to cast)
  const id = typeof params.id === 'string' ? params.id : '';

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto mb-6">
        <Link href="/" className="text-gray-500 hover:text-gray-900 flex items-center gap-2">
            <ArrowLeft size={16} /> Back to Dashboard
        </Link>
      </div>
      
      {id && <ContractViewer contractId={id} />}
    </main>
  );
}