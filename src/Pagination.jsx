import React from 'react';
import prev from './assets/prev.svg';
import next from './assets/next.svg';

const Pagination = ({ onPageChange, currentPage, totalPages }) => {
  const onNext = () => onPageChange(currentPage + 1);
  const onPrevious = () => onPageChange(currentPage - 1);

  return (
    <div className="pagination">
      <button className='page' onClick={onPrevious} disabled={currentPage === 1}> <img src={prev} alt="prev" /></button> 
      <span> Page {currentPage} of {totalPages} </span>
      <button className='page' onClick={onNext} disabled={currentPage === totalPages}> <img src={next} alt="next" /></button>
    </div>
  );
};

export default Pagination;
