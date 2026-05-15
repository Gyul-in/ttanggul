import React, { createContext, useContext, useState } from 'react';

export type SavedCard = {
  id: string;
  text: string;
  category: string;
};

type SaveContextType = {
  savedCategories: Record<string, SavedCard[]>;
  toggleSave: (card: SavedCard) => void;
  isSaved: (cardId: string) => boolean;
  removeCards: (categoryName: string, ids: Set<string>) => void;
};

const SaveContext = createContext<SaveContextType | null>(null);

export function SaveProvider({ children }: { children: React.ReactNode }) {
  const [savedCategories, setSavedCategories] = useState<Record<string, SavedCard[]>>({});

  const toggleSave = (card: SavedCard) => {
    setSavedCategories(prev => {
      const categoryCards = prev[card.category] ?? [];
      const isAlreadySaved = categoryCards.some(c => c.id === card.id);

      if (isAlreadySaved) {
        const updated = categoryCards.filter(c => c.id !== card.id);
        if (updated.length === 0) {
          const { [card.category]: _removed, ...rest } = prev;
          return rest;
        }
        return { ...prev, [card.category]: updated };
      } else {
        return { ...prev, [card.category]: [...categoryCards, card] };
      }
    });
  };

  const isSaved = (cardId: string) =>
    Object.values(savedCategories).some(cards => cards.some(c => c.id === cardId));

  const removeCards = (categoryName: string, ids: Set<string>) => {
    setSavedCategories(prev => {
      const updated = (prev[categoryName] ?? []).filter(c => !ids.has(c.id));
      if (updated.length === 0) {
        const { [categoryName]: _removed, ...rest } = prev;
        return rest;
      }
      return { ...prev, [categoryName]: updated };
    });
  };

  return (
    <SaveContext.Provider value={{ savedCategories, toggleSave, isSaved, removeCards }}>
      {children}
    </SaveContext.Provider>
  );
}

export function useSave() {
  const ctx = useContext(SaveContext);
  if (!ctx) throw new Error('useSave must be used within SaveProvider');
  return ctx;
}
