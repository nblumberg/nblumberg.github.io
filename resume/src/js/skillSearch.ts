export default function skillSearchListener(event: Event) {
  if ((event.target as HTMLElement).className !== "searchSkills") {
    return;
  }
  let input = event.target as HTMLInputElement;
  let skillList = input.parentElement.parentElement.parentElement;
  let skills = Array.prototype.slice.call(skillList.querySelectorAll(".js-skill")) as HTMLElement[];
  let terms = input.value.toLowerCase().split(/(\s+|,)/);
  skills.forEach((skill) => {
    skill.className = "skill js-skill";
    if (terms.length) {
      skill.className = "skill js-skill hidden";
      terms.forEach((term) => {
        if (skill.dataset.skill.toLowerCase().indexOf(term) !== -1) {
          skill.className = "skill js-skill";
        }
      });
    }
  });
}
