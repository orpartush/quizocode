import React from 'react';

function Button({ btnTxt, clr, onClick }) {
    return (
        <button className="btn" onClick={() => onClick(btnTxt)} style={{ borderBottom: `2px solid ${clr}` }}>
            {btnTxt}
        </button>
    );
}

export default Button;
