import BlueprintBuilder from '@/components/features/BlueprintBuilder';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NewBlueprintPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <Link href="/" className="text-gray-500 hover:text-gray-900 flex items-center gap-2 mb-2">
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Create New Blueprint</h1>
          <p className="text-gray-600">Define the structure for future contracts.</p>
        </div>
        
        <BlueprintBuilder />
      </div>
    </main>
  );
}