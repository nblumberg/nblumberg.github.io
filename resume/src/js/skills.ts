import data from "../data/skills.json";

export interface Skill {
  shortName: string;
  fullName: string;
  website?: string;
  company?: string;
  description: string;
  experienceLevel: "unknown" | "familiar" | "experienced" | "expert";
  deprecated?: true;
}

const tmp = (Array.isArray(data) ? data.slice(0) as Skill[] : [])
  .sort((a, b) => {
    return a.shortName.toLowerCase() < b.shortName.toLowerCase() ? -1 : 1;
  });

export const map: Record<string, Skill> = {};

tmp.forEach((skill) => {
  map[skill.shortName.toLowerCase()] = Object.assign({}, skill);
});

export const list = tmp.filter(({ deprecated }) => !deprecated);
