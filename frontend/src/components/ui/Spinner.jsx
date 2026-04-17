import React from 'react';

const Spinner = ({ size = 40, color = '#39D1DC', text = 'Loading...' }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem', gap: '1rem' }}>
            <svg
                width={size}
                height={size}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ animation: 'spin 1s linear infinite' }}
            >
                <path
                    d="M12 2V6M12 18V22M6 12H2M22 12H18M19.07 19.07L16.24 16.24M7.76 7.76L4.93 4.93M19.07 4.93L16.24 7.76M7.76 16.24L4.93 19.07"
                    stroke={color}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ opacity: 0.8 }}
                />
            </svg>
            <style>
                {`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                `}
            </style>
            <p style={{ opacity: 0.6, fontSize: '0.9rem', letterSpacing: '0.5px' }}>{text}</p>
        </div>
    );
};

export default React.memo(Spinner);
