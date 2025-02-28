// Time zone mapping
const timeZoneMap = {
    "GMT": "UTC",
    "IST": "Asia/Kolkata",
    "EST": "America/New_York",
    "PST": "America/Los_Angeles",
    "CET": "Europe/Berlin"
};


/**
 * Calculates the time difference between two timestamps in hours, minutes, and seconds.
 * @param {number} startMs - The starting timestamp in milliseconds.
 * @param {number} endMs - The ending timestamp in milliseconds.
 * @returns {object} - Difference as { hours, minutes, seconds }.
 */
function timeDifference(startMs, endMs) {
    let diff = Math.abs(endMs - startMs) / 1000; // Convert to seconds

    const hours = Math.floor(diff / 3600);
    diff %= 3600;
    const minutes = Math.floor(diff / 60);
    const seconds = Math.floor(diff % 60);

    return { hours, minutes, seconds };
}


/**
 * Converts a date string in a given time zone to milliseconds.
 * If no date string is provided, returns the current timestamp in milliseconds for the given time zone.
 * @param {string} timeZone - The desired time zone (e.g., "IST", "GMT").
 * @param {boolean} includeTime - Whether to include the time component.
 * @param {string|null} dateString - The date string (e.g., "2024-01-01T05:30:00").
 * @returns {number|string} - Timestamp in milliseconds or an error message.
 */
function dateToMilliseconds(dateString = null, timeZone = "GMT", includeTime = true) {
    const zone = timeZoneMap[timeZone];
    if (!zone) return `Invalid time zone: ${timeZone}`;

    // Use current date-time if no date string is provided
    let date = dateString ? new Date(dateString) : new Date();

    if (isNaN(date.getTime())) {
        return "Invalid date format. Use a valid date string.";
    }

    // If the date string contains "Z" (ISO format) or an explicit UTC offset, assume it's already in UTC
    if ((typeof dateString === "string") && (dateString.includes("Z"))) {
        return date.getTime(); // Already in UTC, return as-is
    }

    // Convert the date to the specified time zone
    const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: zone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
    });

    let formattedDate = formatter.formatToParts(date);

    // Extract parts and reconstruct as a Date object in the correct time zone
    let year = formattedDate.find((p) => p.type === "year").value;
    let month = formattedDate.find((p) => p.type === "month").value;
    let day = formattedDate.find((p) => p.type === "day").value;
    let hour = includeTime ? formattedDate.find((p) => p.type === "hour").value : "00";
    let minute = includeTime ? formattedDate.find((p) => p.type === "minute").value : "00";
    let second = includeTime ? formattedDate.find((p) => p.type === "second").value : "00";

    let timeZoneDate = new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}Z`);

    return timeZoneDate.getTime();
}


/**
 * Converts milliseconds to a formatted date string in the desired time zone.
 * @param {number} ms - The timestamp in milliseconds.
 * @param {string} timeZone - The desired time zone (e.g., "IST", "GMT").
 * @param {string} format - The format ("full", "long", "medium", "short").
 * @returns {string} - Formatted date string.
 */
function millisecondsToDate(ms, timeZone = "IST", format = "full") {
    const zone = timeZoneMap[timeZone];
    if (!zone) return `Invalid time zone: ${timeZone}`;
    console.log(new Date(ms).toISOString())
    const formatOptions = {
        "full": { dateStyle: "full", timeStyle: "full" },
        "long": { dateStyle: "long", timeStyle: "long" },
        "medium": { dateStyle: "medium", timeStyle: "medium" },
        "short": { dateStyle: "short", timeStyle: "short" }
    };

    const options = formatOptions[format] || formatOptions["full"];

    return new Intl.DateTimeFormat("en-US", { timeZone: zone, ...options }).format(new Date(ms));
}

function getFormattedDates(dateInput, format = "full", includeTime = true, timeZoneString = "GMT") {
    const formatOptions = {
        "full": { dateStyle: "full", timeStyle: includeTime ? "full" : undefined },
        "long": { dateStyle: "long", timeStyle: includeTime ? "long" : undefined },
        "medium": { dateStyle: "medium", timeStyle: includeTime ? "medium" : undefined },
        "short": { dateStyle: "short", timeStyle: includeTime ? "short" : undefined }
    };

    const timeZone = timeZoneMap[timeZoneString]

    const date = new Date(dateInput);

    if (isNaN(date.getTime())) {
        return "Invalid date format";
    }

    return new Intl.DateTimeFormat("en-US", {
        timeZone,
        ...formatOptions[format]
    }).format(date);
}


const getYearEnd = () => {
    const currentDate = new Date();
    return new Date(currentDate.getFullYear(), 11, 31);
};

const getMonthEnd = () => {
    const currentDate = new Date();
    return new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
};

// console.log(dateToMilliseconds("2025-02-05T00:00:00.000Z"));
// console.log(getFormattedDates(dateToMilliseconds("2025-02-05T00:00:00.000Z")));

module.exports = { millisecondsToDate, dateToMilliseconds, timeDifference, getMonthEnd, getYearEnd, getFormattedDates };
