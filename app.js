let assignments = [];
let counterProcrastinationMode = false;

const assignmentForm = document.getElementById('assignment-form');
const assignmentsContainer = document.getElementById('assignments-container');
const procrastinationToggle = document.getElementById('procrastination-toggle');
const sortBySelect = document.getElementById('sort-by');

document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    loadAssignments();
});

function setupEventListeners() {
    if(assignmentForm) {
        assignmentForm.addEventListener('submit', handleAddAssignment);
    }

    if(procrastinationToggle) {
        procrastinationToggle.addEventListener('change', (e) => {
            counterProcrastinationMode = e.target.checked;
            renderAssignments();
        });
    }   
    if(sortBySelect) {
        sortBySelect.addEventListener('change', () => {
            renderAssignments();
        });
    }
}

async function handleAddAssignment(e) {
    e.preventDefault();

    const title = document.getElementById('assignment-title').value.trim();
    const courseName = document.getElementById('course-name').value.trim();
    const dueDate = document.getElementById('due-date').value;
    const assignmentUrgency = parseInt(
        document.getElementById('assignment-urgency').value,
        10
    );
    const estimatedTime = parseInt(
        document.getElementById('estimated-time').value,
        10
    ) || 0;

    const newAssignment = {
    title: title,
    courseName: courseName,
    dueDate: dueDate,
    assignmentUrgency: assignmentUrgency,
    estimatedTime: estimatedTime
};

    try {
        const response = await fetch('http://localhost:8080/api/assignments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newAssignment)
        });

        if (!response.ok) {
            throw new Error('Failed to create assignment');
        }

        const savedAssignment = await response.json();

        console.log('Assignment saved:', savedAssignment);

        assignmentForm.reset();

        await loadAssignments();

    } catch (error) {
        console.error('Error:', error);
        alert('Could not save assignment.');
    }
}

function getDisplayDate(dateString) {
    if(!dateString) return '';
    if(!counterProcrastinationMode) return dateString;

    const[year, month, day] = dateString.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day);
    dateObj.setDate(dateObj.getDate() - 1);

    const displayYear = dateObj.getFullYear();
    const displayMonth = String(dateObj.getMonth() + 1).padStart(2, '0');
    const displayDay = String(dateObj.getDate()).padStart(2, '0');

  return `${displayYear}-${displayMonth}-${displayDay}`;
}

function getSortedAssignments() {
    const sorted = [...assignments];
    const sortCriteria = sortBySelect ? sortBySelect.value : 'due-date-asc';

    return sorted.sort((a, b) => {
        if (sortCriteria === 'due-date-asc') {
            return new Date(a.dueDate) - new Date(b.dueDate);
        } else if (sortCriteria === 'assignment-urgency-asc') {
            return a.assignmentUrgency - b.assignmentUrgency;
        } else if (sortCriteria === 'estimated-time-asc') {
            return a.estimatedTime - b.estimatedTime;
        } else if (sortCriteria === 'estimated-time-desc') {
            return b.estimatedTime - a.estimatedTime;
        }
        return 0;
    });
}

function renderAssignments() {
    if(!assignmentsContainer) {
        return;
    }

    const list = getSortedAssignments();

    if(list.length === 0) {
        assignmentsContainer.innerHTML = '<p> No assignments added yet. </p>';
        return;
    }

    const urgencyLabels = { 1: 'Critical', 2: 'High', 3: 'Medium', 4: 'Low'};
    assignmentsContainer.innerHTML = list.map(item => {
        const displayDueDate = getDisplayDate(item.dueDate);
        const subtasks = item.subtasks || [];
const completedSubtasks = subtasks.filter(s => s.completed).length;
const totalSubtasks = subtasks.length;
        const progressPercent = totalSubtasks > 0 ? Math.round((completedSubtasks/totalSubtasks) * 100) : 0;

        return `
        <article class="assignment-card" data-id="${item.id}">
            <header>
                <h3>${escapeHtml(item.title)}</h3>
                <p><strong>Course:</strong> ${escapeHtml(item.courseName)} | <strong>Urgency:</strong> ${urgencyLabels[item.assignmentUrgency]}</p>
                <p>
                    <strong>Due Date:</strong> 
                    <span class="due-date-display">${displayDueDate}</span>
                    ${counterProcrastinationMode ? '<em>(Shifted 1 day earlier)</em>' : ''}
                </p>
                <p><strong>Est. Time Total:</strong> ${item.estimatedTime} mins</p>
            </header>

            <!-- Progress Bar -->
            <div>
                <label for="progress-${item.id}">Overall Progress:</label>
                <progress id="progress-${item.id}" value="${completedSubtasks}" max="${totalSubtasks || 1}"></progress>
                <span>${progressPercent}%</span>
            </div>

            <!-- Subtasks Section -->
            <div>
                ${subtasks.length > 0 ? `
                    <ul style="list-style: none; padding-left: 0;">
                        ${subtasks.map((sub, index) => `
                            <li>
                                <label>
                                    <input type="checkbox" ${sub.completed ? 'checked' : ''} 
                                        onchange="toggleSubtask(${item.id}, ${index})">
                                     ${escapeHtml(sub.text)} (${sub.estTime} mins)
                                </label>
                            </li>
                `).join('')}
            </ul>
            ` : ''}

                <form class="add-subtask-form" onsubmit="handleAddSubtask(event, ${item.id})">
                    <input type="text" name="subtaskText" placeholder="New small task..." required>
                    <input type="number" name="subtaskEst" placeholder="Estimated Minutes" min="5" step="5" required>
                    <button type="submit">Add Subtask</button>
                </form>
            </div>
        </article>
    `;

    }).join('');
}

function toggleSubtask(assignmentId, subtaskIndex) {
    const assignment = assignments.find(a => a.id === assignmentId);
    if (assignment && assignment.subtasks[subtaskIndex]) {
        assignment.subtasks[subtaskIndex].completed = !assignment.subtasks[subtaskIndex].completed;
        renderAssignments();
    }
}

function handleAddSubtask(e, assignmentId) {
    e.preventDefault();
    const form = e.target;
    const text = form.subtaskText.value.trim();
    const estimatedTime = parseInt(form.subtaskEst.value, 10) || 0;

    const assignment = assignments.find(a => a.id === assignmentId);
    if(assignment) {
        assignment.subtasks.push({text, estimatedTime, completed: false});
        renderAssignments();
    }
}

async function loadAssignments() {
    try {
        const response = await fetch('http://localhost:8080/api/assignments');

        if (!response.ok) {
            throw new Error('Failed to load assignments');
        }

        assignments = await response.json();

        renderAssignments();

    } catch (error) {
        console.error('Error loading assignments:', error);
    }
}

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, (m) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  })[m]);
}