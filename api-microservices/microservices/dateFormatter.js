// 8,640,000,000,000,000 milliseconds
// 8640000000000000

function dateFormatter (receivedTimestamp) {
  const monthsObj = {
    0 : 'January',
    1 : 'February',
    2 : 'March',
    3 : 'April',
    4 : 'May',
    5 : 'June',
    6 : 'July',
    7 : 'August',
    8 : 'September',
    9 : 'October',
    10 : 'November',
    11 : 'December'
  };

  let rxs = /(^[0-9]+$)/;
  let rxsi = /(^-[0-9]+$)/;
  let isInt = rxs.test(receivedTimestamp);
  let isIntI = rxsi.test(receivedTimestamp);

  if (isIntI === true) {
    isInt = true
  }

  let intValue = 0;
  let stringDate = '';
  let resolvedDate = '';
  let invalidDate = 'Invalid Date';

  if (isInt) {
    intValue = parseInt(receivedTimestamp) * 1000;
    resolvedDate = new Date(intValue);
    stringDate = resolvedDate.toString();
    intValue = intValue / 1000;
  } else {
    resolvedDate = new Date(receivedTimestamp);
    stringDate = resolvedDate.toString();
    intValue = resolvedDate.getTime() / 1000;
  }

  if (stringDate === invalidDate) {
    intValue = null;
    resolvedDate = null;
  } else {
    resolvedDate = monthsObj[resolvedDate.getMonth()] + ' ' + resolvedDate.getDate() + ', ' + resolvedDate.getFullYear();
  }

  return JSON.stringify({
    unix: intValue,
    natural: resolvedDate
  });
}

export default dateFormatter;
