function parseCourseTable(coursesTable) {
  // Parses a course table and returns table rows with courses that are needed
  var courses = [];
  for (var i = 0; i < coursesTable.length; i++) {
    var rows = coursesTable[i].getElementsByTagName("tr");
    for (var j = 0; j < rows.length; j++) {
      var columns = rows[j].getElementsByTagName("td");
      for (var k = 0; k < columns.length; k++) {
        if (columns[k].textContent.includes("course needed") ||
            columns[k].textContent.includes("courses needed") ||
            columns[k].textContent.includes("credits needed") ||
            columns[k].textContent.includes("credit needed")) {
          courses.push(rows[j]);
          break;
        }
      }
    }
  }

  return courses;
}

function getNeededCourses() {
  var neededCoursesElementId = 'NeededCourses';

  // Check if we've already created the table
  var neededCoursesElement = document. getElementById(neededCoursesElementId);
  if (typeof(neededCoursesElement) != 'undefined' &&
      neededCoursesElement != null) {
    return;
  }

  // Get all needed Courses
  var courses = [];
  var reqTables = document.querySelectorAll("[id='RequirementTable']");
  for (var i=0; i < reqTables.length; i++) {
    var reqName = reqTables[i].getElementsByClassName("ReqName")[0].textContent;
    var reqTable = reqTables[i].querySelector("[id='ReqTable']");
    var reqTableRows = reqTable.rows;
    var subReqName = '';
    var subReqCredits = '';
    for (var j=0; j < reqTableRows.length; j++) {
      var subReqNameElement =
          reqTableRows[j].getElementsByClassName("SubReqName");
      if (subReqNameElement.length > 0) {
        subReqName = subReqNameElement[0].textContent;
      }
      else if (reqTableRows[j].className == "SubReqCredits") {
        subReqCredits = reqTableRows[j].cells[0].textContent;
      }
      else {
        var coursesTable = reqTableRows[j].querySelectorAll(
            "[id='CoursesTable']");
        if (coursesTable.length > 0) {
          var parsedCourses = parseCourseTable(coursesTable);
          if (parsedCourses.length > 0) {
            for (var k=0; k < parsedCourses.length; k++) {
              parsedCourses[k] = parsedCourses[k].cloneNode(true);
              parsedCourses[k].insertAdjacentHTML('afterbegin',
                "<td>" + reqName + "</td>");
              numCells = parsedCourses[k].cells.length;
              for (var m=numCells-1; m > numCells-6; m--) {
                parsedCourses[k].deleteCell(m);
              }
              parsedCourses[k].insertAdjacentHTML('beforeend',
                "<td>" + subReqCredits + "</td>");
            }
            courses = courses.concat(parsedCourses);
          }
        }
      }
    }
  }

  // Create needed courses table and append to top of the page
  var insertHTML = '<table id="' + neededCoursesElementId + '">';
  for (var i = 0; i < courses.length; i++) {
    insertHTML += courses[i].outerHTML;
  }
  insertHTML += '</table><br /><b>Total Lines Found: </b>' + courses.length
  document.getElementById("reportText").insertAdjacentHTML('afterbegin',
    insertHTML);
}

getNeededCourses();
