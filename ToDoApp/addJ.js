const taskList = document.getElementById("taskList");

const tasks = [
  {
    title: "Lunch with client",
    desc: "Ask Secretary",
    time: "10:30 AM"
  },
  {
    title: "Check Emails",
    desc: "Open PC",
    time: "01:45 PM"
  },
  {
    title: "Lunch with client",
    desc: "Lunch in office",
    time: "03:31 PM"
  }
];

function loadTasks() {
  taskList.innerHTML = "";
  tasks.forEach(task => {
    const taskEl = document.createElement("div");
    taskEl.className = "task-item";
    taskEl.innerHTML = `
      <div class="task-title">${task.title}</div>
      <div class="task-desc">${task.desc}</div>
      <div class="task-time">${task.time}</div>
    `;
    taskList.appendChild(taskEl);
  });
}

function addTask() {
  const newTask = {
    title: "New Task",
    desc: "Details here",
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
  tasks.push(newTask);
  loadTasks();
}

loadTasks();