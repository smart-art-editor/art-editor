import React from 'react';

function formatDuration(milliseconds: number): string {
  const seconds = Math.floor(milliseconds / 1000);
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  const parts = [];
  if (h > 0) parts.push(`${h}hrs`);
  if (m > 0) parts.push(`${m}min`);
  parts.push(`${s}sec`);

  return parts.join(' ');
}

export const DurationComponent: React.FC<{ duration: number }> = ({ duration }) => {
    return <p>{formatDuration(duration)}</p>;
};