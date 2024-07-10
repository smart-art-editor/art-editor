import React from 'react';

function formatDuration(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    const hours = h > 0 ? `${h}:` : '';
    const minutes = `${h > 0 && m < 10 ? '0' : ''}${m}:`;
    const sec = `${s < 10 ? '0' : ''}${s}`;

    return `${hours}${minutes}${sec}`;
}

export const DurationComponent: React.FC<{ duration: number }> = ({ duration }) => {
    return <p>{formatDuration(duration)}</p>;
};