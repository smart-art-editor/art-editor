import React from 'react';
import { FaUser } from 'react-icons/fa';

interface ParticipantDisplayProps {
  participants: string[];
}

const ParticipantDisplay: React.FC<ParticipantDisplayProps> = ({ participants }) => {
  const displayCount = participants.length-1;
  const remainingCount = participants.length - displayCount;

  return (
    <div className="flex items-center">
      {participants.slice(0, displayCount).map((participant, index) => (
        <div key={index} className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center -ml-2 first:ml-0">
          <FaUser className="text-gray-600" />
        </div>
      ))}
      {remainingCount > 0 && (
        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold -ml-2">
          +{remainingCount}
        </div>
      )}
    </div>
  );
};

export default ParticipantDisplay;