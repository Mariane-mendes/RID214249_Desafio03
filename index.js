const getTasksFromLocalStorage = () => {
  const raw = localStorage.getItem('tasks');
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    return parsed.map(t => ({
      ...t,
      id: Number(t.id),
      checked: Boolean(t.checked)
    }));
  } catch (e) {
    console.error('Erro ao ler tasks do localStorage', e);
    return null;
  }
};

const setTasksInLocalStorage = (tasks) => {

  localStorage.setItem('tasks', JSON.stringify(tasks));
};

const DEFAULT_TASKS = [
  { id: 1, description: "Implementa tela de listagem de tarefas", tag: "frontend", createdAt: "Criado em: 21/08/2024", checked: false },
  { id: 2, description: "Criar endpoint para cadastro de tarefas", tag: "backend", createdAt: "Criado em: 21/08/2024", checked: false }, 
  { id: 3, description: "Implementa protótipo da listagem de tarefas", tag: "ux", createdAt: "Criado em: 21/08/2024", checked: false }
];

let tasks = getTasksFromLocalStorage() || DEFAULT_TASKS.slice();

if (!getTasksFromLocalStorage()) {
  setTasksInLocalStorage(tasks);
}

const renderTasksProgressData = (tasksList) => {
  let tasksProgressDOM = document.getElementById('tasks-progress');

  if (!tasksProgressDOM) {
    tasksProgressDOM = document.createElement('div');
    tasksProgressDOM.id = 'tasks-progress';
    document.getElementById('todo-footer').appendChild(tasksProgressDOM);
  }

  const completedCount = tasksList.filter(({ checked }) => checked).length;

  tasksProgressDOM.textContent = completedCount === 1 ? '1 tarefa concluída' : `${completedCount} tarefas concluídas`;
};

const createTaskListItem = (tasksData) => {
  const list = document.getElementById('todo-board-tasks');
  const toDo = document.createElement('li');

  const content = getButtonInput(tasksData);

  toDo.id = `task-${tasksData.id}`; 
  toDo.appendChild(content);
  list.appendChild(toDo);
};

const getButtonInput = ({ id, description, checked, tag, createdAt }) => {
  const label = document.createElement('label');
  const tagText = document.createElement('span');
  const dateElement = document.createElement('span');
  const button = document.createElement('button');
  const wrapper = document.createElement('div');
  const contentWrapper = document.createElement('div');
  const tagDateWrapper = document.createElement('div');

  const buttonId = id; 

  label.textContent = description;
  label.htmlFor = buttonId;
  label.className = 'tasks-title';

  tagText.textContent = tag;
  tagText.className = 'tasks-tag';

  dateElement.className = 'task-date';
  dateElement.textContent = createdAt;

  button.type = 'button';
  button.id = `btn-${buttonId}`;
  button.textContent = "Concluir";
  button.className = 'task-button';

  tagDateWrapper.className = 'tag-date-wrapper';
  tagDateWrapper.appendChild(tagText);
  tagDateWrapper.appendChild(dateElement);

  contentWrapper.className = 'content-wrapper-tasks';
  contentWrapper.appendChild(label);
  contentWrapper.appendChild(tagDateWrapper);

  wrapper.className = 'tasks-label-container';
  wrapper.appendChild(contentWrapper);
  wrapper.appendChild(button);

  if (checked) {
    wrapper.classList.add('tasks-completed');
    button.remove();

    const img = document.createElement('img');
    img.src = './Checked.png';
    img.alt = 'Tarefa concluída';
    img.classList.add('check-img');
    wrapper.appendChild(img);
  } else {
      button.addEventListener('click', () => {
      const task = tasks.find(t => Number(t.id) === Number(id));
      if (!task) return;

      if (!task.checked) {
        task.checked = true;                
        setTasksInLocalStorage(tasks);       
        renderTasksProgressData(tasks);      
      }

      button.remove();
      wrapper.classList.add('tasks-completed');
      const img = document.createElement('img');
      img.src = './Checked.png';
      img.alt = 'Tarefa concluída';
      img.classList.add('check-img');
      wrapper.appendChild(img);
    });
  }

  return wrapper;
};

const getNewTaskId = () => {
  const lastId = tasks[tasks.length - 1]?.id;
  return lastId ? Number(lastId) + 1 : 1;
};

const getNewTaskData = (event) => {
  const description = event.target.elements.description1.value.trim();
  const tag = event.target.elements.description2.value.trim();
  const id = getNewTaskId();
  const createdAt = `Criado em: ${new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" })}`;
  const checked = false;

  return { id, description, tag, createdAt, checked };
};

const addTasks = (event) => {
  event.preventDefault();
  const newTask = getNewTaskData(event);

  tasks.push(newTask);
  setTasksInLocalStorage(tasks);   
  createTaskListItem(newTask);     
  renderTasksProgressData(tasks);  
  event.target.reset();
};

window.onload = function () {
  const classeForm = document.getElementById('form-tasks-board');
  classeForm.addEventListener('submit', addTasks);

  tasks.forEach(task => createTaskListItem(task));

  renderTasksProgressData(tasks);
};
