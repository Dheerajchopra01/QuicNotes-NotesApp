const txtNoteTitle = document.getElementById('txtNoteTitle');
const ddList = document.getElementById('ddList');
const txtarNotesContent = document.getElementById('txtarNotesContent');
const notesTable = document.getElementById('notesTable');

const tblNotes = document.getElementById('tblNotes');
const notesForm = document.getElementById('notesForm');
const btnSaveForm = document.getElementById('btnSaveForm');
const btnClearForm = document.getElementById('btnClearForm');
let idCount = 0;
let defaultId = 0;
let mySessionId = defaultId;

/**
 * function fetches all saved 'notes' data from local storage and loads it in table
 */
const fetchAllNotesData = () => {
  let allLocalStorageData = { ...localStorage };
  let rowIndex = 0;
  for (const key in allLocalStorageData) {
    loadDataToTable(allLocalStorageData[key], rowIndex);
    idCount = key;
    rowIndex++;
  }
};

/**
 * functions loads data to table.
 * @param {string} value
 * @returns
 */
const loadDataToTable = (value, index) => {
  let valueObj = JSON.parse(value);

  // load data of NotesApp only
  if (valueObj['appName'] === 'NotesApp') {
    const myId = valueObj['id'];
    addRowInNotesTable(valueObj['noteTitle'], valueObj['priority']);
    attachEventHandlersToBtn(index, myId);
  } else {
    return;
  }
};

/**
 * on DOMContentLoaded, saved 'notes' data is populated in table.
 */
document.addEventListener('DOMContentLoaded', fetchAllNotesData);

/**
 * This function on click event, saves/updates the 'notes'.
 */
btnSaveForm.addEventListener('click', (event) => {
  event.preventDefault();

  // check if input data valid
  if (!notesForm.checkValidity()) {
    notesForm.classList.add('was-validated');
    event.stopPropagation();
  } else {
    // save/update - when data is valid
    if (!checkDataExists(mySessionId)) {
      saveNotes();
    } else {
      updateNotes(mySessionId);
    }
    clearForm();
  }
});

/**
 * function clears the form on click
 */
btnClearForm.addEventListener('click', (event) => {
  clearForm();
  enableInputs();
});

/**
 * function used to save notes to table and local storage.
 */
let saveNotes = () => {
  try {
    idCount++;
    // Add data in Table
    let myId = idCount;
    let index = tblNotes.rows.length === 0 ? 0 : tblNotes.rows.length;
    addRowInNotesTable(txtNoteTitle.value, ddList.value);
    attachEventHandlersToBtn(index, myId);

    // Add data in localStorage
    let notesData = {
      id: myId,
      noteTitle: txtNoteTitle.value,
      priority: ddList.value,
      content: txtarNotesContent.value,
      appName: 'NotesApp',
    };

    localStorage.setItem(myId, JSON.stringify(notesData));

    mySessionId = defaultId;
    showAlert('primary', 'Note Saved Successfully');
  } catch (error) {
    console.log('SaveNotes :', error);
  }
};

/**
 * Function dynamically adds row to the Notes table
 * @param {string} noteTitleVal
 * @param {string} priorityVal
 */
const addRowInNotesTable = (noteTitleVal, priorityVal) => {
  let row = tblNotes.insertRow(-1);

  // creating cell
  let noteTitleCell = row.insertCell(0);
  let priorityCell = row.insertCell(1);
  let viewEditCell = row.insertCell(2);
  let deleteCell = row.insertCell(3);

  // adding content to cell
  noteTitleCell.textContent = noteTitleVal;
  priorityCell.textContent = priorityVal;
  viewEditCell.innerHTML =
    '<td><button class="bg-success-subtle rounded viewBtn">View</button> / <button class="bg-info-subtle rounded editBtn">Edit</button></td>';
  deleteCell.innerHTML =
    '<td><button class="bg-danger-subtle rounded deleteBtn">Delete</button></td>';
};

/**
 * function is used to update the note
 * @param {*} key
 */
const updateNotes = (key) => {
  try {
    // update table
    let rowIndex = tblNotes.rows.length - 1;
    let tableRow = tblNotes.getElementsByTagName('tr')[rowIndex];

    tableRow.innerHTML = `
                <tr data-rowIndex="${rowIndex}">
                    <td>${txtNoteTitle.value}</td>
                    <td>${ddList.value}</td>
                    <td><button class="bg-success-subtle rounded viewBtn">View</button> / <button class="bg-info-subtle rounded editBtn">Edit</button></td>
                    <td><button class="bg-danger-subtle rounded deleteBtn">Delete</button></td>
                </tr>`;

    attachEventHandlersToBtn(rowIndex, key);

    // update local storage
    let notesData = {
      id: key,
      noteTitle: txtNoteTitle.value,
      priority: ddList.value,
      content: txtarNotesContent.value,
      appName: 'NotesApp',
    };
    localStorage.setItem(key, JSON.stringify(notesData));
    mySessionId = defaultId;

    showAlert('primary', 'Note Updated Successfully');
  } catch (error) {
    console.log('updateNotes: ', error);
  }
};

/**
 * function attaches event handlers to buttons
 * @param {Number} index
 * @param {string} key
 */
const attachEventHandlersToBtn = (index, key) => {
  try {
    const viewBtn = document.getElementsByClassName('viewBtn')[index];
    const editBtn = document.getElementsByClassName('editBtn')[index];
    const deleteBtn = document.getElementsByClassName('deleteBtn')[index];

    viewBtn.addEventListener('click', () => {
      viewNote(key);
    });

    editBtn.addEventListener('click', () => {
      editNote(key);
    });

    deleteBtn.addEventListener('click', () => {
      deleteNote(index, key);
    });
  } catch (err) {
    console.error(err);
  }
};

/**
 * function used to view data only.
 * @param {string} key
 */
const viewNote = (key) => {
  setDataToForm(key);
  disableInputs();
};

/**
 * function used to edit data.
 * @param {string} key
 */
const editNote = (key) => {
  enableInputs();
  setDataToForm(key);
};

/**
 * function removes data from local storage
 * @param {string} key
 */
const deleteNote = (indexValue, key) => {
  try {
    // delete from table
    let row = tblNotes.getElementsByTagName('tr')[indexValue];
    tblNotes.deleteRow(row);

    // delete from localStorage
    localStorage.removeItem(key);
    showAlert('danger', 'Note Deleted Successfully');
  } catch (err) {
    console.error(err);
  }
};

/**
 * function retrieves data from local storage and set data to form.
 * @param {string} key
 */
const setDataToForm = (key) => {
  try {
    let dataObj = localStorage.getItem(key);
    dataObj = JSON.parse(dataObj);

    mySessionId = key;
    txtNoteTitle.value = dataObj['noteTitle'];
    ddList.value = dataObj['priority'];
    txtarNotesContent.value = dataObj['content'];
  } catch (err) {
    console.error(err);
  }
};

/**
 * function check if note exists in local storage.
 * @returns boolean
 */
const checkDataExists = (key) => {
  let dataInLocal = localStorage.getItem(key);
  return dataInLocal ? true : false;
};

/**
 * function clears the form
 */
const clearForm = () => {
  txtNoteTitle.value = '';
  txtarNotesContent.value = '';
  ddList.value = 0;
  notesForm.classList.remove('was-validated');
};

/**
 * function disables inputs in vew state.
 */
const disableInputs = () => {
  txtNoteTitle.disabled = true;
  ddList.disabled = true;
  txtarNotesContent.disabled = true;
};

/**
 * function enable inputs
 */
const enableInputs = () => {
  txtNoteTitle.disabled = false;
  ddList.disabled = false;
  txtarNotesContent.disabled = false;
};

/**
 * Function displays custom bootstrap auto dismissable alert
 * @param {string} type
 * @param {string} customMessage
 */
const showAlert = (type, customMessage) => {
  let message = document.getElementById('message');
  message.innerHTML = `<div class="alert alert-${type} alert-dismissible fade show" role="alert">
                          <strong>Message : </strong> ${customMessage}
                          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                        </div>`;
  setTimeout(() => {
    message.innerHTML = '';
  }, 2000);
};

/* 
 Notes

 1. created dynamic button- view, edit
 2. created customer attribute using data-*
 3. created dynamic table, inserted row dyamically.
 4. Event listener issue resolved.
 5. created custom bootstrap auto dismissable alert

 */
