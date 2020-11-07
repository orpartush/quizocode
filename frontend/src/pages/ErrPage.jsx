import React from 'react';
import { Link } from 'react-router-dom';

function ErrPage() {
    return (
        <div className="err-page flex align-center justify-center flex-column">
            <h1>Oops... 404 Can't find this one!</h1>
            <Link to="/">Back to homepage</Link>
        </div>
    );
}

export default ErrPage;
