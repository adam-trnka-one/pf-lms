import { useState, useEffect } from 'react';

export function useUnsavedChanges() {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<(() => void) | null>(null);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const handleNavigate = (navigateAction: () => void) => {
    if (hasUnsavedChanges) {
      setShowConfirmDialog(true);
      setPendingNavigation(() => navigateAction);
    } else {
      navigateAction();
    }
  };

  const handleConfirmNavigation = () => {
    setShowConfirmDialog(false);
    setHasUnsavedChanges(false);
    if (pendingNavigation) {
      pendingNavigation();
      setPendingNavigation(null);
    }
  };

  const handleCancelNavigation = () => {
    setShowConfirmDialog(false);
    setPendingNavigation(null);
  };

  return {
    hasUnsavedChanges,
    setHasUnsavedChanges,
    showConfirmDialog,
    handleNavigate,
    handleConfirmNavigation,
    handleCancelNavigation
  };
}