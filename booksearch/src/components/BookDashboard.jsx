import { useEffect, useState } from 'react';
import '../App.css';

const BookDashboard = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [query, setQuery] = useState('');
  const [yearFilter, setYearFilter] = useState('All');

  useEffect(() => {
    const fetchBooks = async () => {
      if (query.trim() === '') {
        setBooks([]);
        setFilteredBooks([]);
        return;
      }
      const res = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=50`);
      const data = await res.json();
      const uniqueBooks = data.docs.filter((book, index, self) =>
        index === self.findIndex(b => b.key === book.key)
      );
      setBooks(uniqueBooks);
      // Apply year filter immediately after fetch
      if (yearFilter === 'All') {
        setFilteredBooks(uniqueBooks);
      } else {
        setFilteredBooks(uniqueBooks.filter(b => b.first_publish_year === parseInt(yearFilter)));
      }
    };
    fetchBooks();
  }, [query, yearFilter]);

  const total = filteredBooks.length;
  const years = filteredBooks.map(b => b.first_publish_year).filter(Boolean);
  const meanYear = years.length
    ? Math.round(years.reduce((sum, y) => sum + y, 0) / years.length)
    : 'N/A';
  const minYear = years.length ? Math.min(...years) : 'N/A';
  const maxYear = years.length ? Math.max(...years) : 'N/A';

  // Extract unique years from all fetched books (for the dropdown)
  const uniqueYears = [...new Set(books.map(b => b.first_publish_year).filter(Boolean))].sort();

  return (
    <div className="dashboard">
      <h1>Book Dashboard</h1>

      <div className="controls">
        <input
          type="text"
          placeholder="Search by title"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-bar"
        />
        <select
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
          className="filter-dropdown"
        >
          <option value="All">All Years</option>
          {uniqueYears.map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>

      <div className="stats">
        <p>Total Books Displayed: {total}</p>
        <p>Average Publish Year: {meanYear}</p>
        <p>Year Range: {minYear} - {maxYear}</p>
      </div>

      <ul className="book-list">
        {filteredBooks.slice(0, 20).map((book) => (
          <li key={book.key} className="book-item">
            <h2>{book.title}</h2>
            <p>Author: {book.author_name?.join(', ') || 'Unknown'}</p>
            <p>Year: {book.first_publish_year || 'N/A'}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookDashboard;
