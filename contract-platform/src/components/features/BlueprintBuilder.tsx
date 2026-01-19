'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';
import { Field, FieldType } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Plus, Trash2, Save, GripVertical, AlertCircle } from 'lucide-react';

// --- DND-KIT IMPORTS ---
import {
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// --- SUB-COMPONENT: DRAGGABLE FIELD CARD ---
function SortableFieldCard({ field, onRemove }: { field: Field; onRemove: (id: string) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1, 
    opacity: isDragging ? 0.5 : 1, 
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className="group relative p-3 border rounded hover:border-blue-300 transition-colors flex items-center gap-3 bg-white"
    >
      {/* DRAG HANDLE */}
      <button 
        {...attributes} 
        {...listeners} 
        className="cursor-grab text-gray-400 hover:text-gray-600 active:cursor-grabbing p-1"
        title="Drag to reorder"
      >
        <GripVertical size={20} />
      </button>

      {/* Field Content */}
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-1 select-none">
          {field.label}
        </label>
        <div className="bg-gray-100 h-10 rounded border border-gray-200 flex items-center px-3 text-gray-400 text-sm select-none">
          [{field.type.toUpperCase()} FIELD]
        </div>
      </div>

      {/* Delete Button */}
      <button 
        onClick={() => onRemove(field.id)}
        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
}

// --- MAIN COMPONENT ---
export default function BlueprintBuilder() {
  const router = useRouter();
  const addBlueprint = useStore((state) => state.addBlueprint);
  const existingBlueprints = useStore((state) => state.blueprints);
  
  const [name, setName] = useState('');
  const [fields, setFields] = useState<Field[]>([]);
  const [error, setError] = useState(''); // New Error State
  
  const [newLabel, setNewLabel] = useState('');
  const [newType, setNewType] = useState<FieldType>('text');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleAddField = () => {
    if (!newLabel) return;
    const field: Field = {
      id: Date.now().toString() + Math.random().toString().slice(2),
      type: newType,
      label: newLabel,
    };
    setFields([...fields, field]);
    setNewLabel(''); 
  };

  const handleRemoveField = (id: string) => {
    setFields(fields.filter(f => f.id !== id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setFields((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over?.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleSave = () => {
    // 1. Reset Error
    setError('');

    // 2. Validate Empty Fields
    if (!name.trim()) {
        setError('Blueprint name is required.');
        return;
    }
    if (fields.length === 0) {
        alert("Please add at least one field."); // Keep alert for fields, as it's separate
        return;
    }

    // 3. Validate Duplicate Name
    const nameExists = existingBlueprints.some(
      (b) => b.name.trim().toLowerCase() === name.trim().toLowerCase()
    );

    if (nameExists) {
      setError('A blueprint with this name already exists.');
      return; 
    }

    // 4. Success
    addBlueprint({
        id: Date.now().toString(),
        name: name.trim(), 
        fields,
        createdAt: new Date().toISOString()
    });
    router.push('/'); 
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* LEFT: Editor Controls */}
      <div className="bg-white p-6 rounded-lg shadow-sm border space-y-6">
        <h2 className="text-xl font-semibold">1. Setup Blueprint</h2>
        
        <div>
            <Input 
              placeholder="Blueprint Name (e.g. NDA Agreement)" 
              value={name}
              onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError(''); // Clear error on type
              }}
              className={error ? 'border-red-500 focus:ring-red-200' : ''}
            />
            {/* INLINE ERROR MESSAGE */}
            {error && (
                <div className="flex items-center gap-1.5 mt-2 text-red-600 text-xs font-medium animate-in slide-in-from-top-1">
                    <AlertCircle size={14} />
                    <span>{error}</span>
                </div>
            )}
        </div>

        <div className="border-t pt-4 space-y-4">
          <h3 className="font-medium text-gray-900">Add Fields</h3>
          <div className="flex gap-2">
            <Input 
              placeholder="Field Label (e.g. 'Full Name')" 
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              className="flex-1"
            />
            <select 
              className="border rounded-md px-3 bg-white"
              value={newType}
              onChange={(e) => setNewType(e.target.value as FieldType)}
            >
              <option value="text">Text Input</option>
              <option value="date">Date Picker</option>
              <option value="checkbox">Checkbox</option>
              <option value="signature">Signature</option>
            </select>
          </div>
          <Button onClick={handleAddField} className="w-full flex items-center justify-center gap-2">
            <Plus size={16} /> Add Field
          </Button>
        </div>
      </div>

      {/* RIGHT: Live Preview with DND */}
      <div className="bg-gray-50 p-6 rounded-lg border-2 border-dashed border-gray-300">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-500">Preview: {name || 'Untitled'}</h2>
          <Button onClick={handleSave} disabled={!name || fields.length === 0} className="flex items-center gap-2">
            <Save size={16} /> Save Blueprint
          </Button>
        </div>

        <div className="bg-white p-8 shadow-sm min-h-[400px] rounded-lg">
          {fields.length === 0 ? (
            <p className="text-gray-400 text-center py-10">Add fields to see them here...</p>
          ) : (
            <DndContext 
              sensors={sensors} 
              collisionDetection={closestCenter} 
              onDragEnd={handleDragEnd}
            >
              <SortableContext 
                items={fields} 
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3">
                  {fields.map((field) => (
                    <SortableFieldCard 
                      key={field.id} 
                      field={field} 
                      onRemove={handleRemoveField} 
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>
      </div>
    </div>
  );
}