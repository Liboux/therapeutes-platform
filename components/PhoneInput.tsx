'use client';

import { useState, useEffect, useRef } from 'react';

interface Country {
  code: string;
  name: string;
  flag: string;
  dialCode: string;
}

const countries: Country[] = [
  { code: 'CH', name: 'Suisse', flag: '🇨🇭', dialCode: '+41' },
  { code: 'FR', name: 'France', flag: '🇫🇷', dialCode: '+33' },
  { code: 'DE', name: 'Allemagne', flag: '🇩🇪', dialCode: '+49' },
  { code: 'IT', name: 'Italie', flag: '🇮🇹', dialCode: '+39' },
  { code: 'AT', name: 'Autriche', flag: '🇦🇹', dialCode: '+43' },
  { code: 'BE', name: 'Belgique', flag: '🇧🇪', dialCode: '+32' },
  { code: 'LU', name: 'Luxembourg', flag: '🇱🇺', dialCode: '+352' },
  { code: 'ES', name: 'Espagne', flag: '🇪🇸', dialCode: '+34' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹', dialCode: '+351' },
  { code: 'GB', name: 'Royaume-Uni', flag: '🇬🇧', dialCode: '+44' },
  { code: 'US', name: 'États-Unis', flag: '🇺🇸', dialCode: '+1' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', dialCode: '+1' },
];

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

export default function PhoneInput({ value, onChange, required }: PhoneInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fermer le dropdown quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setIsOpen(false);
    
    const phoneWithoutDialCode = value.replace(/^\+\d+\s?/, '');
    onChange(`${country.dialCode} ${phoneWithoutDialCode}`);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let phoneNumber = e.target.value;
    phoneNumber = phoneNumber.replace(/[^\d\s]/g, '');
    
    if (selectedCountry.code === 'CH') {
      const digits = phoneNumber.replace(/\s/g, '');
      if (digits.length <= 2) {
        phoneNumber = digits;
      } else if (digits.length <= 5) {
        phoneNumber = `${digits.substring(0, 2)} ${digits.substring(2)}`;
      } else if (digits.length <= 7) {
        phoneNumber = `${digits.substring(0, 2)} ${digits.substring(2, 5)} ${digits.substring(5)}`;
      } else if (digits.length <= 9) {
        phoneNumber = `${digits.substring(0, 2)} ${digits.substring(2, 5)} ${digits.substring(5, 7)} ${digits.substring(7)}`;
      } else {
        phoneNumber = `${digits.substring(0, 2)} ${digits.substring(2, 5)} ${digits.substring(5, 7)} ${digits.substring(7, 9)}`;
      }
    } else if (selectedCountry.code === 'FR') {
      const digits = phoneNumber.replace(/\s/g, '');
      if (digits.length <= 1) {
        phoneNumber = digits;
      } else if (digits.length <= 3) {
        phoneNumber = `${digits.substring(0, 1)} ${digits.substring(1)}`;
      } else if (digits.length <= 5) {
        phoneNumber = `${digits.substring(0, 1)} ${digits.substring(1, 3)} ${digits.substring(3)}`;
      } else if (digits.length <= 7) {
        phoneNumber = `${digits.substring(0, 1)} ${digits.substring(1, 3)} ${digits.substring(3, 5)} ${digits.substring(5)}`;
      } else if (digits.length <= 9) {
        phoneNumber = `${digits.substring(0, 1)} ${digits.substring(1, 3)} ${digits.substring(3, 5)} ${digits.substring(5, 7)} ${digits.substring(7)}`;
      } else {
        phoneNumber = `${digits.substring(0, 1)} ${digits.substring(1, 3)} ${digits.substring(3, 5)} ${digits.substring(5, 7)} ${digits.substring(7, 9)}`;
      }
    } else {
      const digits = phoneNumber.replace(/\s/g, '');
      phoneNumber = digits.match(/.{1,3}/g)?.join(' ') || digits;
    }
    
    onChange(`${selectedCountry.dialCode} ${phoneNumber}`);
  };

  const displayValue = value.replace(selectedCountry.dialCode, '').trim();

  return (
    <div>
      <div className="flex gap-2">
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent h-full"
          >
            <span className="text-2xl">{selectedCountry.flag}</span>
            <span className="text-sm font-medium text-gray-700">{selectedCountry.dialCode}</span>
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isOpen && (
            <div className="absolute z-50 mt-2 w-72 bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-y-auto">
              {countries.map((country) => (
                <button
                  key={country.code}
                  type="button"
                  onClick={() => handleCountrySelect(country)}
                  className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition ${
                    selectedCountry.code === country.code ? 'bg-blue-50' : ''
                  }`}
                >
                  <span className="text-2xl">{country.flag}</span>
                  <span className="flex-1 text-left text-sm font-medium text-gray-900">{country.name}</span>
                  <span className="text-sm text-gray-600">{country.dialCode}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <input
          type="tel"
          value={displayValue}
          onChange={handlePhoneChange}
          required={required}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder={selectedCountry.code === 'CH' ? '21 123 45 67' : 'Numéro de téléphone'}
        />
      </div>
      
      <p className="text-xs text-gray-500 mt-1">
        Format : {selectedCountry.dialCode} suivi du numéro sans le 0 initial
      </p>
    </div>
  );
}