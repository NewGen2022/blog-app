const formatDate = (dateStr) => {
    const date = new Date(dateStr);

    const dayNumber = date.getDay();
    const daysOfWeek = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
    ];
    const dayName = daysOfWeek[dayNumber];

    const time = date.toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    });
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    return `${dayName}, ${day < 10 ? '0' + day : day}.${
        month < 10 ? '0' + month : month
    }.${year} at ${time}`;
};

export { formatDate };
