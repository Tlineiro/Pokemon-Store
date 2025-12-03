import { Button } from 'react-bootstrap';
import React from 'react';

import './PaginationControls.css';

function PaginationControls({ page, totalPages, onNext, onPrevious }) {
    return (
        <div className="pagination-controls">
            <Button variant="secondary" onClick={onPrevious} disabled={page === 0}>
                Previous
            </Button>
            <span className="pagination-text">Página {page + 1} de {totalPages}</span>
            <Button variant="secondary" onClick={onNext} disabled={page === totalPages - 1}>
                Next
            </Button>
        </div>
    );
}

export default PaginationControls;
