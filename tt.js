// Code for generating the timetable
const branches = [
    { name: "AIML", sections: 1, rooms: ["Room A1", "Room A2", "Room A3"] },
    { name: "CSE", sections: 2, rooms: ["Room C1", "Room C2", "Room C3"] },
    { name: "EEE", sections: 2, rooms: ["Room E1", "Room E2", "Room E3"] },
    { name: "ISE", sections: 1, rooms: ["Room I1", "Room I2", "Room I3"] },
    { name: "ECE", sections: 2, rooms: ["Room EC1", "Room EC2", "Room EC3"] },
    { name: "MECH", sections: 2, rooms: ["Room M1", "Room M2", "Room M3"] }
  ];

  const subjects = {
    AIML: [
      { name: "M3", credits: 3 },
      { name: "DS", credits: 3 },
      { name: "COA", credits: 3 },
      { name: "DS_Lab", credits: 1 },
      { name: "Python_lab", credits: 1 },
      { name: "Kannada", credits: 1 },
      { name: "Python", credits: 1 },
      { name: "UHV", credits: 1 }
    ],
    CSE: [
      { name: "Data Structures", credits: 3 },
      { name: "Algorithms", credits: 4 },
      { name: "Operating Systems", credits: 3 }
    ],
    EEE: [
      { name: "Circuit Theory", credits: 4 },
      { name: "Signals and Systems", credits: 4 },
      { name: "Electrical Machines", credits: 3 }
    ],
    ISE: [
      { name: "Database Management", credits: 4 },
      { name: "Software Engineering", credits: 4 },
      { name: "Web Development", credits: 3 }
    ],
    ECE: [
      { name: "Analog Electronics", credits: 4 },
      { name: "Digital Electronics", credits: 4 },
      { name: "Microprocessors", credits: 3 }
    ],
    MECH: [
      { name: "Thermodynamics", credits: 4 },
      { name: "Fluid Mechanics", credits: 4 },
      { name: "Machine Design", credits: 3 }
    ]
  };

  function calculateHours(subjects) {
    if (!subjects) {
      throw new Error("Subjects are undefined for the given branch.");
    }
    return subjects.map(sub => {
      return { name: sub.name, hours: sub.credits };
    });
  }

  function generateTimetableForBranch(branch, subjects) {
    const timetable = {};
    let day = 0;

    const subjectsWithHours = calculateHours(subjects);
    let roomIndex = 0;
    while (day < 5) {
      if (!timetable[`Day ${day + 1}`]) {
        timetable[`Day ${day + 1}`] = [];
      }

      subjectsWithHours.forEach(sub => {
        let remainingHours = sub.hours;
        while (remainingHours > 0 && day < 5) {
          const hoursToAllocate = Math.min(remainingHours, 2);
          timetable[`Day ${day + 1}`].push({
            subject: sub.name,
            classroom: branch.rooms[roomIndex % branch.rooms.length],
            hours: hoursToAllocate
          });
          remainingHours -= hoursToAllocate;
          if (remainingHours > 0) {
            day++;
            if (!timetable[`Day ${day + 1}`]) {
              timetable[`Day ${day + 1}`] = [];
            }
          }
        }
      });
      roomIndex++;
    }
    timetable["Day 6"] = [{ subject: "Lab", lab: "Lab 1", hours: 3 }, { subject: "Lab", lab: "Lab 2", hours: 3 }];
    return timetable;
  }

  function generateAllTimetables() {
    const allTimetables = {};
    branches.forEach(branch => {
      allTimetables[branch.name] = [];
      for (let section = 1; section <= branch.sections; section++) {
        const timetable = generateTimetableForBranch(branch, subjects[branch.name]);
        allTimetables[branch.name].push({ section, timetable });
      }
    });
    return allTimetables;
  }

  // Generate HTML table for a single timetable
  function generateHTMLTableForTimetable(branchName, section, timetable) {
    let html = `<h2>Timetable for ${branchName} - Section ${section}</h2>`;
    html += `<table><tr><th>Day</th><th>Subject</th><th>Classroom</th><th>Hours</th></tr>`;
    for (let day in timetable) {
      if (timetable.hasOwnProperty(day)) {
        timetable[day].forEach((session) => {
          html += `<tr><td>${day}</td><td>${session.subject}</td><td>${session.classroom}</td><td>${session.hours}</td></tr>`;
        });
      }
    }
    html += `</table>`;
    return html;
  }

  function generateAllTimetablesAsHTML() {
    const allTimetables = generateAllTimetables();
    let allHTML = '';
    for (let branchName in allTimetables) {
      if (allTimetables.hasOwnProperty(branchName)) {
        allTimetables[branchName].forEach((sectionTimetable) => {
          allHTML += generateHTMLTableForTimetable(branchName, sectionTimetable.section, sectionTimetable.timetable);
        });
      }
    }
    return allHTML;
  }

  // Render timetables
  const timetableHTML = generateAllTimetablesAsHTML();
  document.getElementById('timetable-container').innerHTML = timetableHTML;