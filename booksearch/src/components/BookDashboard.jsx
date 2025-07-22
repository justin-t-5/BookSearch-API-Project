import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer} from 'recharts';
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

  const uniqueYears = [...new Set(books.map(b => b.first_publish_year).filter(Boolean))].sort();

  // Chart data for books published per year
  const yearCounts = years.reduce((acc, year) => {
    const y = parseInt(year);
    if (!isNaN(y)) {
      acc[y] = (acc[y] || 0) + 1;
    }
    return acc;
  }, {});

  const chartData = Object.entries(yearCounts)
    .map(([year, count]) => ({
      year: parseInt(year),
      count
    }))
    .sort((a, b) => a.year - b.year);

  // Chart data for top authors by number of books
  const authorCounts = filteredBooks.reduce((acc, book) => {
    const author = book.author_name?.[0] || 'Unknown';
    acc[author] = (acc[author] || 0) + 1;
    return acc;
  }, {});

  const authorChartData = Object.entries(authorCounts)
    .map(([author, count]) => ({ author, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

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

      {chartData.length > 0 && (
        <>
          <h3>Books Published Per Year</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.slice(0, 10)}>
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>

          <h3>Top Authors by Number of Books</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              layout="vertical"
              data={authorChartData}
              margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
            >
              <XAxis type="number" />
              <YAxis dataKey="author" type="category" />
              <Tooltip />
              <Bar dataKey="count" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </>
      )}

      <ul className="book-list">
        {filteredBooks.slice(0, 20).map((book) => (
          <li key={book.key} className="book-item">
            <Link to={`/book/${book.key.replace('/works/', '')}`}>
              <h2>{book.title}</h2>
            </Link>
            <p>Author: {book.author_name?.join(', ') || 'Unknown'}</p>
            <p>Year: {book.first_publish_year || 'N/A'}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BookDashboard;
