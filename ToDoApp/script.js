function showToDoApp() {
  document.getElementById("welcome-screen").classList.add("hidden");
  document.getElementById("todo-app").classList.remove("hidden");
}

function addTask() {
  const input = document.getElementById('taskInput');
  const timeInput = document.getElementById('taskTime');
  const taskText = input.value.trim();
  const taskTime = timeInput.value;

  if (taskText === '' || taskTime === '') return;

  const li = document.createElement('li');
  li.setAttribute('data-time', taskTime);

  const span = document.createElement('span');
  span.className = 'task-text';
  span.textContent = `${taskText} (${taskTime})`;
  li.appendChild(span);

  // Complete button
  const completeBtn = document.createElement('button');
  completeBtn.textContent = 'Complete';
  completeBtn.onclick = function() {
    li.classList.add('completed');
    updateOngoingTask();
  };
  li.appendChild(completeBtn);

  // Delete button
  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete';
  deleteBtn.onclick = function() {
    li.remove();
    updateOngoingTask();
  };
  li.appendChild(deleteBtn);

  document.getElementById('taskList').appendChild(li);
  input.value = '';
  timeInput.value = '';
  updateOngoingTask();
}

// This function checks every minute if a task's time matches the current time
function updateOngoingTask() {
  const ongoingTaskDiv = document.getElementById('ongoing-task');
  const now = new Date();
  const currentTime = now.toTimeString().slice(0,5); // "HH:MM" in 24-hour format

  const tasks = Array.from(document.querySelectorAll('#taskList li:not(.completed)'));
  const ongoing = tasks.find(li => li.getAttribute('data-time') === currentTime);

  if (ongoing) {
    ongoingTaskDiv.textContent = ongoing.querySelector('.task-text').textContent;
    ongoingTaskDiv.classList.remove('ongoing-task-empty');
  } else {
    ongoingTaskDiv.textContent = 'No ongoing task';
    ongoingTaskDiv.classList.add('ongoing-task-empty');
  }
}

// Check every minute for ongoing tasks
setInterval(updateOngoingTask, 60000);
// Also check immediately on page load and after any task change
updateOngoingTask();

// Show popup on Get Started
document.querySelector('.get-started').onclick = function(e) {
  e.preventDefault();
  document.getElementById('userPopup').classList.remove('hidden');
};

// Handle submit
document.getElementById('userSubmitBtn').onclick = function() {
  const username = document.getElementById('usernameInput').value.trim();
  const email = document.getElementById('emailInput').value.trim();
  if (username && email) {
    localStorage.setItem('username', username);
    localStorage.setItem('email', email);
    // Redirect to add.html after successful input
    window.location.href = "add.html";
  } else {
    alert('Please enter both username and email.');
    return;
  }
  if (!email.includes('@')) {
    alert("email id must conatin '@'");
    return;
  }
};

// Optional: Prevent background scroll when popup is open
const popup = document.getElementById('userPopup');
const body = document.body;
const observer = new MutationObserver(() => {
  if (!popup.classList.contains('hidden')) {
    body.style.overflow = 'hidden';
  } else {
    body.style.overflow = '';
  }
});
observer.observe(popup, { attributes: true, attributeFilter: ['class'] });