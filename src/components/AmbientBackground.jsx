import React from 'react';

const AmbientBackground = () => {
    return (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-[#070b14]">
            <div
                className="absolute -top-40 -right-40 w-96 h-96 bg-teal-500/10 rounded-full blur-[100px] animate-float will-change-transform"
            />

            <div
                className="absolute -bottom-40 -left-20 w-80 h-80 bg-violet-500/10 rounded-full blur-[100px] animate-float-delayed will-change-transform"
            />

            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-96 bg-blue-500/[0.03] rounded-full blur-[120px] animate-pulse-slow will-change-transform"
            />

            <div
                className="absolute inset-0 opacity-[0.02] mix-blend-overlay"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                }}
            />
        </div>
    );
};

export default AmbientBackground;
