import React from "react";

export default function SearchBar({ value, onChange, onSearch }) {
  return (
    <section className="search-bar">
      <input
        type="text"
        placeholder="Digite o que procura..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyUp={(e) => e.key === "Enter" && onSearch()}
      />
      <div className="iconsearch" onClick={onSearch}>
        <i className="fas fa-search"></i>
      </div>
    </section>
  );
}
