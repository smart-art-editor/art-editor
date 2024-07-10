import React, { useState, useEffect } from 'react';

function timeAgo(dateString: string): string {
    const now: Date = new Date();
    const date: Date = new Date(dateString);
    const seconds: number = Math.floor((now.getTime() - date.getTime()) / 1000);
    let interval: number = Math.floor(seconds / 31536000);

    if (interval >= 1) {
        return interval + " year" + (interval === 1 ? "" : "s") + " ago";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) {
        return interval + " month" + (interval === 1 ? "" : "s") + " ago";
    }
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) {
        return interval + " day" + (interval === 1 ? "" : "s") + " ago";
    }
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) {
        return interval + " hour" + (interval === 1 ? "" : "s") + " ago";
    }
    interval = Math.floor(seconds / 60);
    if (interval >= 1) {
        return interval + " minute" + (interval === 1 ? "" : "s") + " ago";
    }
    return Math.floor(seconds) + " second" + (seconds === 1 ? "" : "s") + " ago";
}

export const TimeAgoComponent: React.FC<{ dateString: string }> = ({ dateString }) => {
    const [timeAgoText, setTimeAgoText] = useState<string>("");

    useEffect(() => {
        setTimeAgoText(timeAgo(dateString));
        
        const interval = setInterval(() => {
            setTimeAgoText(timeAgo(dateString));
        }, 60000); // Update every minute

        return () => clearInterval(interval);
    }, [dateString]);

    return <p>Created {timeAgoText}</p>;
};