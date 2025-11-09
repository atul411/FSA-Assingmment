import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { useApp } from '../../contexts/AppContext';
import { toast } from 'sonner';

export const DeleteConfirmDialog = ({
  equipment,
  open,
  onOpenChange,
  onSuccess,
}) => {
  const { deleteEquipment } = useApp();

  const handleDelete = () => {
    if (equipment) {
      deleteEquipment(equipment.id);
      toast.success('Equipment deleted successfully!');
      onSuccess();
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-white">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Equipment</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{equipment?.name}"? This action cannot be undone and will
            permanently remove the equipment from the system.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-[#EF4444] hover:bg-[#DC2626]"
          >
            Delete Equipment
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
