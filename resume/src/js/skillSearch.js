const skillSearchListener = (event) => {
    if (event.target.className !== "searchSkills") {
        return;
    }
    let input = event.target;
    let skillList = input.parentElement.parentElement.parentElement;
    let skills = Array.prototype.slice.call(skillList.querySelectorAll(".js-skill"));
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
};

module.exports = skillSearchListener;
