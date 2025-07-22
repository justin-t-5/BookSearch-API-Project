// components/BookDetail.jsx
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

const BookDetail = () => {
  const { bookKey } = useParams();
  const [book, setBook] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      const res = await fetch(`https://openlibrary.org/works/${bookKey}.json`);
      const data = await res.json();
      setBook(data);
    };
    fetchDetails();
  }, [bookKey]);

  if (!book) return <p>Loading...</p>;

  return (
    <div className="dashboard">
      <h1>{book.title}</h1>
      <p><strong>Description:</strong> {book.description?.value || book.description || 'No description available'}</p>
      <p><strong>Subjects:</strong> {book.subjects?.join(', ') || 'N/A'}</p>
    </div>
  );
};

export default BookDetail;
