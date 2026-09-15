"use client"
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface FormData {
  name: string;
  email: string;
  mobile: string;
  courseInterest: string;
  neetScore: string;
}

interface PopupContextType {
  isOpen: boolean;
  openPopup: () => void;
  closePopup: () => void;
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  resetForm: () => void;
  submitForm: () => Promise<{ success: boolean; message: string }>;
}

const PopupContext = createContext<PopupContextType | undefined>(undefined);

export const usePopup = () => {
  const context = useContext(PopupContext);
  if (!context) {
    throw new Error('usePopup must be used within a PopupProvider');
  }
  return context;
};

interface PopupProviderProps {
  children: ReactNode;
}

export const PopupProvider: React.FC<PopupProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    courseInterest: '',
    neetScore: ''
  });

  const openPopup = () => setIsOpen(true);
  const closePopup = () => setIsOpen(false);

  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      mobile: '',
      courseInterest: '',
      neetScore: ''
    });
  };

  const submitForm = async () => {
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, website: "" }),
      });

      const result = await response.json();

      if (result.success) {
        resetForm();
        closePopup();
        return { success: true, message: result.message };
      } else {
        return { success: false, message: result.error || 'Failed to send email' };
      }
    } catch (error) {
      console.error('Submit error:', error);
      return { success: false, message: 'Network error. Please try again.' };
    }
  };

  return (
    <PopupContext.Provider
      value={{
        isOpen,
        openPopup,
        closePopup,
        formData,
        updateFormData,
        resetForm,
        submitForm
      }}
    >
      {children}
    </PopupContext.Provider>
  );
};
