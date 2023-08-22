import me from "../data/me.json";
import education, { FormattedEducation } from "./education";
import experience, { FormattedJob } from "./experience";
import skillSearch from "./skillSearch";
import { Skill, list } from "./skills";
import templates from "./templates";

const data = {
  me,
  skills: list,
  experience,
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
};

export default () => {
  resolveCustomElements(document);
  document.addEventListener("keyup", skillSearch);

  // if (window.location.host.indexOf("localhost") !== -1) {
  //     let script = document.createElement("script");
  //     document.body.appendChild(script);
  //     script.src = "//localhost:8001/livereload.js";
  // }
};
