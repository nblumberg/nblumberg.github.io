import data from "../data/education.json";
import formatDate, { FormattedDate, RawDateRange } from "./formatDate";
import { Place } from "./types";

interface BaseEducation extends Place {
  degree: string;
  field: string;
  gpa: string;
  honors?: string;
}

interface RawEducation extends BaseEducation {
  dates?: RawDateRange;
}

export interface FormattedEducation extends BaseEducation {
  dates?: {
    start: FormattedDate;
    end?: FormattedDate;
  }
}

function mapSchool(data: RawEducation): FormattedEducation {
  const { start, end } = data.dates ?? {};
  const school = Object.assign({}, data as BaseEducation as FormattedEducation);
  if (start) {
    school.dates.start = formatDate(start);
  }
  if (end) {
    school.dates.end = formatDate(end);
  }
  return school;
};

const education = (data as RawEducation[]).map(mapSchool);

export default education;
