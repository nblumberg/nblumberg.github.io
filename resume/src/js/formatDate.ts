import moment from "moment";

export interface RawDateRange {
  start: string;
  end?: string;
}

export interface FormattedDate {
  source: string;
  moment: moment.Moment;
  month: string;
  shortMonth: string;
  year: string;
  shortYear: string;
}

export interface FormattedDateRange {
  start: FormattedDate;
  end?: FormattedDate;
}

/**
 * Break date down into component values for HTML rendering
 * @param {String} date In the format "MM/DD/YYYY"
 * @returns {FormattedDate}
 */
function formatDate(date: string): FormattedDate | undefined {
    if (!date) {
        return;
    }
    const m = moment(date);
    return {
        source: date,
        moment: m,
        month: m.format("MMMM"),
        shortMonth: m.format("MMM"),
        year: m.format("YYYY"),
        shortYear: `'${m.format("YY")}`
    };
}

/**
 * Replace string start/end dates with maps containing their component values for HTML rendering
 * @param {Object} range {{ dates: { start: string[, end: string] } }}
 */
export function formatDates(range?: RawDateRange): FormattedDateRange | undefined {
  if (!range) {
    return;
  }
  const formatted: FormattedDateRange = {
    start: formatDate(range.start),
  };
  if (range.end) {
    formatted.end = formatDate(range.end);
  }
  return formatted;
}

export default formatDate;
