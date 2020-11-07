import React, { useState, useEffect } from 'react';
import { BiSearch } from 'react-icons/bi';

function SeachPanel({ onSearch, onSort }) {
    const [searchValue, setSearchValue] = useState('');
    const [sortBy, setSortBy] = useState('');

    useEffect(() => {
        if (sortBy === '') return;
        onSort(sortBy);
    }, [sortBy]);

    useEffect(() => {
        if (searchValue === '') onSearch('');
    }, [searchValue]);

    return (
        <div className="search-panel flex align-center">
            <section className="search-field flex align-center">
                <BiSearch className="search-icon" />
                <input
                    type="text"
                    defaultValue={searchValue}
                    onChange={e => setSearchValue(e.target.value)}
                    placeholder="Start typing to search"
                />
                <button className="search-btn" onClick={() => onSearch(searchValue)}>
                    Search
                </button>
            </section>
            <section className="group-btns">
                <button type="button" title="Sort by names" onClick={() => setSortBy('name')}>
                    Name
                </button>
                <button type="button" title="Sort by points" onClick={() => setSortBy('points')}>
                    Points
                </button>
                <button type="button" title="Sort by likes" onClick={() => setSortBy('likes')}>
                    Likes
                </button>
            </section>
        </div>
    );
}

export default SeachPanel;
