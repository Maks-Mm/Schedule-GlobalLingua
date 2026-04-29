//src/components/EnhancedSearchBar.tsx


import { useState, useEffect, useRef, ChangeEvent } from 'react';

interface SearchResult {
  id: number;
  title: string;
  url?: string;
}

interface EnhancedSearchBarProps {
  onSearch: (term: string) => void;
  searchTerm?: string;
  placeholder?: string;
  results?: SearchResult[];
  onResultClick?: (result: SearchResult) => void;
}

export default function EnhancedSearchBar({ 
  onSearch, 
  searchTerm = '', 
  placeholder = 'Search events...',
  results = [],
  onResultClick 
}: EnhancedSearchBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(searchTerm);
  const [filteredResults, setFilteredResults] = useState<SearchResult[]>([]);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchBarRef = useRef<HTMLDivElement>(null);

  // Filter results based on input
  useEffect(() => {
    if (inputValue.trim() === '') {
      setFilteredResults([]);
      return;
    }
    
    const filtered = results.filter(result =>
      result.title.toLowerCase().includes(inputValue.toLowerCase())
    );
    setFilteredResults(filtered);
  }, [inputValue, results]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target as Node)) {
        closeSearch();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const openSearch = () => {
    setIsOpen(true);
    if (inputRef.current) {
      inputRef.current.style.borderRadius = '25px 25px 0 0';
    }
    if (dropdownRef.current) {
      dropdownRef.current.style.maxHeight = '200px';
      dropdownRef.current.style.overflowY = 'auto';
    }
  };

  const closeSearch = () => {
    setIsOpen(false);
    if (inputRef.current) {
      inputRef.current.style.borderRadius = '25px';
    }
    if (dropdownRef.current) {
      dropdownRef.current.style.maxHeight = '0px';
      dropdownRef.current.style.overflowY = 'hidden';
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    onSearch(value);
    
    if (value.trim() !== '') {
      openSearch();
    } else {
      setFilteredResults([]);
      closeSearch();
    }
  };

  const handleResultClick = (result: SearchResult) => {
    setInputValue(result.title);
    onSearch(result.title);
    onResultClick?.(result);
    closeSearch();
  };

  const handleFocus = () => {
    if (inputValue.trim() !== '' && filteredResults.length > 0) {
      openSearch();
    }
  };

  return (
    <div className="enhanced-search-bar" ref={searchBarRef}>
      <div className="enhanced-search-input-wrapper">
        <svg 
          className="search-icon" 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <path 
            d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
        <input
          ref={inputRef}
          type="text"
          className="enhanced-search-input"
          placeholder={placeholder}
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
        />
        {inputValue && (
          <button 
            className="clear-search-btn"
            onClick={() => {
              setInputValue('');
              onSearch('');
              closeSearch();
              inputRef.current?.focus();
            }}
          >
            ✕
          </button>
        )}
      </div>
      
      <div className={`enhanced-search-dropdown ${isOpen && filteredResults.length > 0 ? 'open' : ''}`} ref={dropdownRef}>
        <ul className="search-results-list">
          {filteredResults.map((result) => (
            <li 
              key={result.id} 
              className="search-result-item"
              onClick={() => handleResultClick(result)}
            >
              <span className="result-icon">🔍</span>
              <p className="result-title">{result.title}</p>
            </li>
          ))}
          {filteredResults.length === 0 && inputValue && (
            <li className="search-result-item no-results">
              <p>No results found for "{inputValue}"</p>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}