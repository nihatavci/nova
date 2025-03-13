import React from 'react';
import { FaTwitter, FaLinkedin, FaFacebook, FaEnvelope, FaLink } from 'react-icons/fa';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  const shareButtons = [
    {
      icon: FaTwitter,
      label: 'Twitter',
      onClick: () => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}`),
    },
    {
      icon: FaLinkedin,
      label: 'LinkedIn',
      onClick: () => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`),
    },
    {
      icon: FaFacebook,
      label: 'Facebook',
      onClick: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`),
    },
    {
      icon: FaEnvelope,
      label: 'Email',
      onClick: () => window.open(`mailto:?subject=Check out my retirement plan&body=${encodeURIComponent(window.location.href)}`),
    },
    {
      icon: FaLink,
      label: 'Copy Link',
      onClick: handleCopyLink,
    },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold mb-4">Share Your Results</h2>
        <div className="grid grid-cols-2 gap-4">
          {shareButtons.map((button) => {
            const Icon = button.icon;
            return (
              <button
                key={button.label}
                onClick={button.onClick}
                className="flex items-center justify-center gap-2 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <Icon className="w-5 h-5" />
                <span>{button.label}</span>
              </button>
            );
          })}
        </div>
        <button
          onClick={onClose}
          className="mt-6 w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded-lg transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}; 