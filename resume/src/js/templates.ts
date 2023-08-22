import me from "../data/me.json";
// @ts-expect-error
import address from "../html/address.html";
// @ts-expect-error
import art from "../html/art.html";
// @ts-expect-error
import resume from "../html/body.html";
// @ts-expect-error
import contact from "../html/contact.html";
// @ts-expect-error
import dateRange from "../html/dateRange.html";
// @ts-expect-error
import education from "../html/education.html";
// @ts-expect-error
import experience from "../html/experience.html";
// @ts-expect-error
import name from "../html/name.html";
// @ts-expect-error
import overview from "../html/overview.html";
// @ts-expect-error
import portfolio from "../html/portfolio.html";
// @ts-expect-error
import positions from "../html/positions.html";
// @ts-expect-error
import responsibilities from "../html/responsibilities.html";
// @ts-expect-error
import skillListWidget from "../html/skillListWidget.html";
// @ts-expect-error
import skills from "../html/skills.html";
import { FormattedEducation } from "./education";
import { FormattedJob } from "./experience";
import { Skill } from "./skills";

const raw: Record<string, string> = {
  address,
  art,
  contact,
  dateRange,
  education,
  experience,
  name,
  overview,
  portfolio,
  positions,
  responsibilities,
  resume,
  skillListWidget,
  skills,
};

const REG_EXP = /\$\{/g;

export type TemplateParams = typeof me | Skill | FormattedJob | FormattedEducation | {
  me: typeof me,
  skills: Skill[],
  experience: FormattedJob[],
  education: FormattedEducation[],
};
export type Template = (params?: TemplateParams) => string;

function evaluate(obj: TemplateParams, key: string): string {
  if (!obj) {
    return "";
  }
  const keys = key.split(".");
  const value = obj[keys.shift() as keyof typeof obj] as string | number | TemplateParams;
  if (keys.length) {
    return evaluate(value as TemplateParams, keys.join("."));
  }
  return typeof value === "undefined" ? "" : `${value}`;
}

function makeTemplate(str: string): Template {
  // TODO: weird bug where REG_EXP doesn't match the first time
  if (!REG_EXP.test(str) && !REG_EXP.test(str)) {
    // There are no placeholders, always return the static string
    return () => str;
  }
  return (params) => {
    function taggedTemplate(unmutableStrings: string[], ...values: string[]) {
      let strings = unmutableStrings.slice(0);
      let result = values.reduce((result, key) => {
        const str = strings.shift();
        // TODO: handle dot notation in key
        const value = evaluate(params, key);
        const r = result + str + value;
        return r;
      }, "");
      result += strings.shift();
      return result;
    }
    const result = eval(`taggedTemplate\`${str}\``);
    return result;
  };
};

const templates: Record<string, Template> = {};
Object.keys(raw).forEach((key) => {
  templates[key] = makeTemplate(raw[key as keyof typeof raw]);
});

export default templates;
