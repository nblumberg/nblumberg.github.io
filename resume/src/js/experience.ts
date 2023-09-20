import data from "../data/experience.json";
import { FormattedDate, FormattedDateRange, RawDateRange, formatDates } from "./formatDate";
import { Skill, map as skillsMap } from "./skills";
import { Place } from "./types";

interface BaseResponsibility {
  description: string;
}

interface RawResponsibility extends BaseResponsibility {
  skills?: string[];
}

interface FormattedResponsibility extends BaseResponsibility {
  skills?: Skill[];
}

interface BaseAchievement {
  name: string;
  priority?: number;
}

interface BasePosition extends BaseAchievement {
  summary?: string;
}

interface RawPosition extends BasePosition {
  dates?: RawDateRange;
  responsibilities: RawResponsibility[];
}

interface FormattedPosition extends BasePosition {
  dates?: FormattedDateRange;
  priority: number;
  responsibilities: FormattedResponsibility[];
}

interface RawAchievement extends BaseAchievement {
  dates: RawDateRange;
  responsibilities?: RawResponsibility[];
}

interface FormattedAchievement extends BaseAchievement {
  dates: FormattedDateRange;
  priority: number;
  responsibilities?: FormattedResponsibility[];
}

interface Artwork {
  name: string;
  image: string;
  website: string;
}

interface BaseJob extends Place {
  portfolio?: Artwork[];
  summary?: string;
  type: string;
}

interface RawJob extends BaseJob {
  achievements?: RawAchievement[];
  dates?: RawDateRange;
  positions: RawPosition[];
}

export interface FormattedJob extends BaseJob {
  achievements?: FormattedAchievement[];
  dates?: FormattedDateRange;
  positions: FormattedPosition[];
}


function mapResponsibility(data: RawResponsibility): FormattedResponsibility {
  const responsibility = Object.assign({}, data as BaseResponsibility as FormattedResponsibility);
  if (!responsibility.skills) {
    return responsibility;
  }
  responsibility.skills = data.skills.slice(0)
    .sort((a, b) => {
      return a.toLowerCase() < b.toLowerCase() ? -1 : 1;
    }).map((skill) => {
      return skillsMap[skill.toLowerCase()] || { shortName: skill, fullName: skill, experienceLevel: "unknown" } as Skill;
    });
  return responsibility;
}

type BaseAchievementOrPosition<T extends RawPosition | RawAchievement> = T extends RawAchievement ? BaseAchievement : BasePosition;
type FormattedAchievementOrPosition<T extends RawPosition | RawAchievement> = T extends RawAchievement ? FormattedAchievement : FormattedPosition;

function mapAchievementOrPosition<T extends RawPosition | RawAchievement>(data: T): FormattedAchievementOrPosition<T> {
  const formatted = Object.assign({ priority: 100 }, data) as BaseAchievementOrPosition<T> as FormattedAchievementOrPosition<T>;
  formatted.dates = formatDates(data.dates);
  if (data.responsibilities) {
    formatted.responsibilities = (data.responsibilities || []).map(mapResponsibility);
  }
  return formatted;
}

function dateOrder({
  dates: { start: { moment: aStart }, end: { moment: aEnd } = {} as FormattedDate } }: { dates: FormattedDateRange },
  { dates: { start: { moment: bStart }, end: { moment: bEnd } = {} as FormattedDate } }: { dates: FormattedDateRange }): -1 | 0 | 1 {
  if (aStart.isAfter(bStart)) {
    // If A starts later, move it toward the top of the list
    return -1;
  } else if (aStart.isSame(bStart)) {
    // If A and B start at the same time
    if (aEnd && !bEnd) {
      // If A ends but B doesn't, move it toward the bottom of the list
      return 1;
    } else if (!aEnd && bEnd) {
      // If A doesn't end but B does, move it toward the top of the list
      return -1;
    } else if (!aEnd && !bEnd) {
      // If neither end, stay in the same order
      return 0;
    } else if (aEnd.isAfter(bEnd)) {
      // If A ends after B, move it toward the top of the list
      return -1;
    } else if (aEnd.isSame(bEnd)) {
      // If the end at the same time, stay in the same order
      return 0;
    } else {
      // If A ends before B, move it toward the bottom of the list
      return 1;
    }
  } else {
    return 1;
  }
};

function priorityOrder({ priority: a }: { priority: number; }, { priority: b }: { priority: number; }): number {
  return b - a;
}

function loadImage(image?: string): string {
  return (image ?? "").startsWith("img/") ? require(`../${image}`) : image;
}

function mapPortfolio(portfolio?: Artwork[]): Artwork[] | undefined {
  if (!Array.isArray(portfolio)) {
    return;
  }
  return portfolio.map(entry => Object.assign({}, entry, { image: loadImage(entry.image) }));
}

function forceEndDate<T extends RawPosition | RawAchievement>(endDate: FormattedDate, obj: FormattedAchievementOrPosition<T>): void {
  if (obj.dates && !obj.dates.end) {
    obj.dates.end = endDate;
  }
}

function mapJob(data: RawJob): FormattedJob {
  // Deep copy the raw data before manipulating it
  const job = Object.assign({}, data as BaseJob as FormattedJob);
  if (data.address) {
    job.address = Object.assign({}, data.address);
  }

  job.logo = loadImage(job.logo);
  job.portfolio = mapPortfolio(job.portfolio);

  // Get the positions held at the job
  let positions = (data.positions || []).map(mapAchievementOrPosition);
  job.positions = positions;

  // Since the positions contain the dates, determine the overall dates at the job from the positions
  const startSortedPositions = positions.slice(0).sort(({ dates: { start: { moment: a } } }, { dates: { start: { moment: b } } }) => !a || a.isSameOrAfter(b) ? 1 : -1);
  const startDate = startSortedPositions[0].dates.start.source;
  const endSortedPositions = positions.slice(0).sort(({ dates: { end: { moment: a } = {} } }, { dates: { end: { moment: b } = {} } }) => !a || a.isSameOrAfter(b) ? -1 : 1);
  const endDate = endSortedPositions[0].dates.end ? endSortedPositions[0].dates.end.source : undefined;
  const overallPosition: { dates: RawDateRange } = {
    dates: {
      start: startDate
    }
  };
  if (endDate) {
    overallPosition.dates.end = endDate;
    job.positions.forEach(position => {
      forceEndDate(endSortedPositions[0].dates.end, position);
      position.responsibilities?.forEach(forceEndDate.bind(null, endSortedPositions[0].dates.end));
    });
  }
  job.dates = formatDates(overallPosition.dates);

  // If there's only one position, the job will display the dates
  if (positions.length === 1) {
    delete positions[0].dates;
  }

  // Get the achievements at the job
  let achievements = (data.achievements || []).map(mapAchievementOrPosition)
    .filter(achievement => !!achievement)
    .sort(dateOrder);
  // .sort(priorityOrder);
  if (!achievements.length) {
    delete job.achievements;
  } else {
    job.achievements = achievements;
    if (endDate) {
      job.achievements.forEach(forceEndDate.bind(null, endSortedPositions[0].dates.end));
    }
  }

  return job;
}

const experience = (data as RawJob[]).map(mapJob).filter(job => job !== null);

export default experience;
