import React from 'react';

export const AlertDialog = ({ children, open, onOpenChange }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        {children}
      </div>
    </div>
  );
};

export const AlertDialogContent = ({ children }) => {
  return <div className="p-6">{children}</div>;
};

export const AlertDialogHeader = ({ children }) => {
  return <div className="mb-4">{children}</div>;
};

export const AlertDialogFooter = ({ children }) => {
  return <div className="mt-6 flex justify-end space-x-2">{children}</div>;
};

export const AlertDialogTitle = ({ children }) => {
  return <h2 className="text-xl font-semibold mb-2">{children}</h2>;
};

export const AlertDialogDescription = ({ children }) => {
  return <p className="text-gray-600">{children}</p>;
};

export const AlertDialogAction = ({ children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
    >
      {children}
    </button>
  );
};

export const AlertDialogCancel = ({ children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
    >
      {children}
    </button>
  );
};