'use client';

import React, { createContext, useContext, useState } from 'react';

interface ContactContextType {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  contactEmail: string;
}

const ContactContext = createContext<ContactContextType | undefined>(undefined);

export function ContactProvider({ children, contactEmail }: { children: React.ReactNode, contactEmail: string }) {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <ContactContext.Provider value={{ isOpen, openModal, closeModal, contactEmail }}>
      {children}
    </ContactContext.Provider>
  );
}

export function useContact() {
  const context = useContext(ContactContext);
  if (context === undefined) {
    throw new Error('useContact must be used within a ContactProvider');
  }
  return context;
}
