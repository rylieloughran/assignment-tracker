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
    estimatedTime: estimatedTime,
    subtasks: []
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
<article class="bg-white/80 backdrop-blur border border-sky-200/80 rounded-xl p-5 shadow-sm space-y-4" data-id="${item.id}">
    <header class="space-y-1">
        <div class="flex justify-between items-start gap-2">
            <h3 class="text-base font-bold text-slate-800 tracking-wide">${escapeHtml(item.title)}</h3>
            <span class="shrink-0 text-xs font-semibold px-3.5 py-1.5 border rounded-lg">
                ${urgencyLabels[item.assignmentUrgency]}
            </span>
        </div>
        
        <div class="text-xs text-slate-600">
            <span class="inline-block mr-6"><strong class="font-semibold text-slate-700">Course:</strong> ${escapeHtml(item.courseName)}</span>
            <span class="inline-block mr-6"><strong class="font-semibold text-slate-700">Due Date:</strong> <span class="due-date-display text-slate-800 font-medium">${displayDueDate}</span> ${counterProcrastinationMode ? '<em class="text-rose-500 ml-1">(Shifted 1 day earlier)</em>' : ''}</span>
            <span class="inline-block"><strong class="font-semibold text-slate-700">Est. Time Total:</strong> ${item.estimatedTime} mins</span>
        </div>
    </header>

    <!-- Custom Styled Progress Bar -->
    <div class="space-y-1.5">
        <div class="flex justify-between text-xs text-slate-700 font-semibold">
            <span>Overall Progress</span>
            <span>${progressPercent}%</span>
        </div>
        <div class="w-full bg-sky-100 rounded-full h-2.5 overflow-hidden border border-sky-200">
            <div class="bg-sky-400 h-2.5 rounded-full transition-all duration-300" style="width: ${progressPercent}%"></div>
        </div>
    </div>

    <!-- Subtasks Section -->
    <div class="space-y-3 pt-2 border-t border-sky-100">
        ${subtasks.length > 0 ? `
            <ul class="space-y-1.5">
                ${subtasks.map((sub, index) => `
                    <li class="flex items-center gap-2 text-xs text-slate-700">
                        <label class="flex items-center gap-2 cursor-pointer select-none">
                            <input type="checkbox" ${sub.completed ? 'checked' : ''} 
                                onchange="toggleSubtask('${item.id}', ${index})"
                                class="rounded accent-sky-500 cursor-pointer">
                            <span class="${sub.completed ? 'line-through text-slate-400' : 'text-slate-800'}">
                                ${escapeHtml(sub.text)} (${sub.estTime} mins)
                            </span>
                        </label>
                    </li>
                `).join('')}
            </ul>
        ` : ''}

        <!-- Subtask Add Form -->
        <form class="flex flex-col sm:flex-row gap-2" onsubmit="handleAddSubtask(event, '${item.id}')">
            <input type="text" name="subtaskText" placeholder="New small task..." required
                class="flex-1 bg-sky-50/50 border border-sky-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-300">
            <input type="number" name="subtaskEst" placeholder="Est. Mins" min="5" step="5" required
                class="w-full sm:w-28 bg-sky-50/50 border border-sky-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-300">
            <button type="submit" 
                class="bg-sky-200 hover:bg-sky-300 text-slate-900 font-semibold px-3 py-1.5 rounded-lg text-xs transition cursor-pointer">
                Add Subtask
            </button>
        </form>
    </div>
</article>
`;

    }).join('');
}

function toggleSubtask(assignmentId, subtaskIndex) {
    const assignment = assignments.find(a => String(a.id) === String(assignmentId));
    if (assignment && assignment.subtasks[subtaskIndex]) {
        assignment.subtasks[subtaskIndex].completed = !assignment.subtasks[subtaskIndex].completed;
        renderAssignments();
    }
}

function handleAddSubtask(e, assignmentId) {
    e.preventDefault();
    const form = e.target;
    const text = form.subtaskText.value.trim();
    const estTime = parseInt(form.subtaskEst.value, 10) || 0;

    const assignment = assignments.find(a => String(a.id) === String(assignmentId));

    if(assignment) {
        if(!assignment.subtasks) {
            assignment.subtasks = [];
        }
        assignment.subtasks.push({text, estTime, completed: false});
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

async function saveAssignmentToBackend(assignment) {
  try {
    await fetch(`http://localhost:8080/api/assignments/${assignment.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(assignment)
    });
  } catch (error) {
    console.error('Error updating assignment:', error);
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