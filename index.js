const form = document.querySelector('form');
const list = document.querySelector('ul');
const display = document.querySelector('.list');
const taskTitle = document.querySelector('#task-title');
const time = document.querySelector('#time');
const day = document.querySelector('#day');
const month = document.querySelector('#month');
const year = document.querySelector('#year');
const submit = document.querySelector('#submit');

// onload fire as soon as the page DOM has been loaded
window.onload = function() {
  // a container for our database 
  var db;

  //request for opening database  
  var request = window.indexedDB.open('notes-db', 1);

  request.onsuccess = function(e) {
    console.log('Database opened successfully.');
    db = e.target.result;
    displayData();
  } 

  request.onerror = function() {
    console.log('Error loading database.');
  }

  // to avoid adding error handlers to every request instead we add a single handler on database objest
 /* db.onerror = function(e) {
    console.log('Database error:' + e.target.errorCode);
  } */

  //initialising database or upgrading it
  request.onupgradeneeded = function(e) {
    db = e.target.result;

    var objectStore = db.createObjectStore('toDoList', {keyPath: 'task'});

    objectStore.createIndex('taskTitle', 'taskTitle', {unique: false});
    objectStore.createIndex('time', 'time', {unique: false});
    objectStore.createIndex('day', 'day', {unique: false});
    objectStore.createIndex('month', 'month', {unique: false});
    objectStore.createIndex('year', 'year', {unique: false});

    console.log('Database setup completed.');
    console.log(objectStore);
  
    function displayData() {
      while (list.firstChild) {
        list.removeChild(list.firstChild);
      }
  
      var transaction = db.transaction('toDoList', 'readonly');
      var objectStore = transaction.objectStore('toDoList');
      var request = objectStore.openCursor();
  
      request.onsuccess = function(e) {
        var cursor = e.target.result;
  
        if (cursor) {
          let li = document.createElement('li');
          let para = document.createElement('p');
  
          display.appendChild(list);
          list.appendChild(li);
          li.appendChild(para);
          
          para.textContent = cursor.value.taskTitle + '_ at:' + cursor.value.time + cursor.value.month + cursor.value.day + cursor.value.year; 
  
          const deleteBtn = createElement('button');
          para.appendChild(deleteBtn);
          deleteBtn.textContent = 'X';
  
          deleteBtn.onclick = deleteTask;
  
          cursor.continue();
        } 
  
        
      }
  
  
    }  
    
  form.onsubmit = addData;
   

  function addData(e) {
    e.preventDefualt();

    let data = [ 
      { taskTitle: taskTitle.value, 
        time: time.value, 
        day: day.value, 
        month: month.value,
        year: year.value 
      }];

    let transaction = db.transaction(['toDoList'], 'readwrite');
    let objectStore = transaction.objectStore('toDoList');
    let request = objectStore.add(data[0]);

    request.onsuccess = function() {
      taskTitle.value = '';
      time.value = '';
      day.value = '';
      month.value = '';
      year.value = '';
    }

    request.onerror = function(e) {
      console.log('adding data to DB problem' + e.target.errorCode);
    }

    request.oncomplete = function() {
      displayData();
    }
     
  }

  

} 
    
  





}