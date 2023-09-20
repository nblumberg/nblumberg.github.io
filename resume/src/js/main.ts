import moment from "moment";
import me from "../data/me.json";
import education, { FormattedEducation } from "./education";
import experience, { FormattedJob } from "./experience";
import skillSearch from "./skillSearch";
import { Skill, list } from "./skills";
import templates from "./templates";

const URL_PARAMS = new URLSearchParams(window.location.search);
const LIMIT_EXPERIENCE_YEARS = parseInt(URL_PARAMS.get("limit"), 10) || 12;
const LIMIT_PRIORITY = parseInt(URL_PARAMS.get("priority"), 10) || 0;
const LIMIT_SKILLS_USED_WITHIN_YEARS = URL_PARAMS.get("skills") === '0' ? false : parseInt(URL_PARAMS.get("skills"), 10) || 10;

function getRelevantSkills(): Skill[] {
  if (LIMIT_SKILLS_USED_WITHIN_YEARS === false) {
    return list;
  }
  const map = new Map<string, moment.Moment>();
  experience.flatMap(({ achievements = [], dates: jobDates, positions }) => {
    return [...achievements, ...positions].flatMap(({ dates, responsibilities }) => {
      const date = dates?.end?.moment ?? jobDates?.end?.moment ?? moment(); // or still working on it
      return (responsibilities ?? [])
        .flatMap(
          ({ skills = [] }) => skills.map(
            ({ shortName: skill }) => ({ skill,  date })
          )
        );
    });
  }).forEach(({ skill, date }) => {
    if (!map.has(skill) || map.get(skill).isBefore(date)) {
      map.set(skill, date);
    }
  });
  const threshold = moment().subtract(LIMIT_SKILLS_USED_WITHIN_YEARS, 'years');
  return list.filter(({ shortName: skill }) => map.has(skill) && map.get(skill).isAfter(threshold));
}

function getRelevantExperience(): FormattedJob[] {
  const yearThreshold = moment().subtract(LIMIT_EXPERIENCE_YEARS, 'years');
  const relevantJobs = experience.filter(({ dates }) => {
    const date = dates?.end?.moment ?? moment(); // or still working there
    return date.isAfter(yearThreshold);
  });
  return relevantJobs.map(job => {
    const clone = { ...job };
    const { achievements = [], positions } = job;
    clone.achievements = achievements.filter(({ priority }) => priority >= LIMIT_PRIORITY);
    clone.positions = positions.filter(({ priority }) => priority >= LIMIT_PRIORITY);
    if (!clone.positions.length) {
      return null;
    }
    return clone;
  }).filter(job => !!job);
}

const data = {
  me,
  skills: getRelevantSkills(),
  experience: getRelevantExperience(),
  education,
};

type DataPoint = typeof me | Skill | FormattedJob | FormattedEducation | typeof data;

function insert(html: string, before: HTMLElement, data: DataPoint) {
  const parent = document.createElement("div");
  parent.innerHTML = html;
  resolveCustomElements(parent, data);
  Array.prototype.slice.call(parent.children, 0).forEach((child: HTMLElement) => {
    before.parentElement.insertBefore(child, before);
  });
}

function findDataPoint(primaryKey: string, secondaryKey: string, subData?: DataPoint): DataPoint {
  return (subData ?? {} as DataPoint)[primaryKey as keyof DataPoint] || data[primaryKey as keyof typeof data] || data[secondaryKey as keyof typeof data];
}

function resolveCustomElements(parent: HTMLElement | Document, subData?: DataPoint) {
  Array.prototype.slice.call(parent.querySelectorAll("nb-placeholder")).forEach((placeholder: HTMLElement) => {
    const name = placeholder.innerText.trim();
    const datum = findDataPoint(placeholder.dataset.key, name, subData) || data;
    const html = templates[name](datum);
    insert(html, placeholder, datum);
    placeholder.parentElement.removeChild(placeholder);
  });

  Array.prototype.slice.call(parent.querySelectorAll("nb-repeat")).forEach((repeat: HTMLElement) => {
    const name = repeat.innerText.trim();
    const datum = findDataPoint(repeat.dataset.key, name, subData);
    if (Array.isArray(datum)) {
      datum.forEach((entry) => {
        const html = templates[name](entry);
        insert(html, repeat, entry);
      });
    }
    repeat.parentElement.removeChild(repeat);
  });
}

function earlierExperience() {
  const params = new URLSearchParams(window.location.search);
  const years = moment.duration(Date.now() - 210312000000).years();
  const earlierExperienceLink = document.getElementById("earlier-experience");
  if (parseInt(params.get("limit"), 10) > years && params.get("priority") === "0") {
    earlierExperienceLink.parentElement.style.display = "none";
  } else {
    earlierExperienceLink.addEventListener("click", () => {
      window.location.search = 'limit=100&priority=0&skills=0';
    });
  }
}

export default () => {
  resolveCustomElements(document);
  earlierExperience();
  document.addEventListener("keyup", skillSearch);

  // if (window.location.host.indexOf("localhost") !== -1) {
  //     let script = document.createElement("script");
  //     document.body.appendChild(script);
  //     script.src = "//localhost:8001/livereload.js";
  // }
};
