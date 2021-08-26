// Initialize button with user's preferred color
// let changeColor = document.getElementById("changeColor");
//
// chrome.storage.sync.get("color", ({ color }) => {
//   changeColor.style.backgroundColor = color;
// });

// When the button is clicked, inject setPageBackgroundColor into current page
changeColor.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: getNeededCourses,
  });
});


function getNeededCourses() {
  // chrome.storage.sync.get("color", ({ color }) => {
  //   document.body.style.backgroundColor = color;
  // });
  var neededCoursesElementId = 'NeededCourses';

  // Check if we've already created the table
  var neededCoursesElement = document. getElementById(neededCoursesElementId);
  if (typeof(neededCoursesElement) != 'undefined' &&
      neededCoursesElement != null) {
    return;
  }

  // Get all needed courses
  var elms = document.querySelectorAll("[id='CoursesTable']");
  var courses = [];
  for (var i = 0; i < elms.length; i++) {
    var rows = elms[i].getElementsByTagName("tr");
    for (var j = 0; j < rows.length; j++) {
      var columns = rows[j].getElementsByTagName("td");
      for (var k = 0; k < columns.length; k++) {
        if (columns[k].textContent == "1 course needed") {
          courses.push(rows[j]);
          break;
        }
      }
    }
  }

  // Create needed courses table and append to top of the page
  var insertHTML = '<table id="' + neededCoursesElementId + '">';
  for (var i = 0; i < courses.length; i++) {
    insertHTML += courses[i].outerHTML;
  }
  insertHTML += '</table><br /><b>Total Needed: </b>' + courses.length
  document.getElementById("reportText").insertAdjacentHTML('afterbegin',
    insertHTML);
}
