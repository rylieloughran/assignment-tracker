let assignments = [];

const assignmentsContainer = document.getElementById('assignments-container');
const form = document.getElementById('assignment-form');
const sortDropdown = document.getElementById('sort-by');

document.addEventListener('DOMContentLoaded', () => {
    loadAssignments();
});

// --- Fetch and Render ---

async function loadAssignments() {
    try {
        const response = await fetch('http://localhost:8080/api/assignments');

        if (!response.ok) {
            throw new Error('Failed to load assignments');
        }

        assignments = await response.json();

        // Apply initial sort if dropdown has a value selected
        if (sortDropdown && sortDropdown.value) {
            applySort(sortDropdown.value);
        }

        renderAssignments();

    } catch (error) {
        console.error('Error loading assignments:', error);
        if (assignmentsContainer) {
            assignmentsContainer.innerHTML =
                '<p class="text-xs text-red-500">Could not load assignments.</p>';
        }
    }
}

function renderAssignments() {
    if (!assignmentsContainer) {
        return;
    }

    if (assignments.length === 0) {
        assignmentsContainer.innerHTML = '<p class="text-xs text-slate-500">No assignments found.</p>';
        return;
    }

    assignmentsContainer.innerHTML = assignments.map(item => {
        return `
            <article class="bg-white border border-sky-200 rounded-xl p-5 shadow-sm">
                
                <h3 class="text-base font-bold text-slate-800">
                    ${escapeHtml(item.title)}
                </h3>

                <p class="text-sm text-slate-600 mt-2">
                    <strong>Course:</strong>
                    ${escapeHtml(item.courseName)}
                </p>

                <p class="text-sm text-slate-600 mt-1">
                    <strong>Due:</strong>
                    ${escapeHtml(item.dueDate)}
                </p>

                <p class="text-xs text-slate-500 mt-3 flex gap-2">
                    <span class="inline-block bg-sky-50 border border-sky-200 text-sky-800 px-2 py-1 rounded">
                        Urgency: ${escapeHtml(getUrgencyLabel(item.urgency))}
                    </span>
                    <span class="inline-block bg-sky-50 border border-sky-200 text-sky-800 px-2 py-1 rounded">
                        Est. Time: ${escapeHtml(item.estimatedTime)} mins
                    </span>
                </p>

            </article>
        `;
    }).join('');
}

function escapeHtml(value) {
    const div = document.createElement('div');
    div.textContent = value ?? '';
    return div.innerHTML;
}

// Convert numeric urgency values back to readable strings for UI rendering
function getUrgencyLabel(level) {
    const labels = {
        1: 'Critical',
        2: 'High',
        3: 'Medium',
        4: 'Low'
    };
    return labels[level] || 'Low';
}

// --- Sorting Logic ---

function applySort(sortValue) {
    if (sortValue === 'due-date-asc') {
        assignments.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    } 
    else if (sortValue === 'assignment-urgency-asc') {
        // Direct numeric comparison: 1 (Critical) comes before 4 (Low)
        assignments.sort((a, b) => Number(a.urgency || 99) - Number(b.urgency || 99));
    } 
    else if (sortValue === 'estimated-time-asc') {
        assignments.sort((a, b) => Number(a.estimatedTime || 0) - Number(b.estimatedTime || 0));
    } 
    else if (sortValue === 'estimated-time-desc') {
        assignments.sort((a, b) => Number(b.estimatedTime || 0) - Number(a.estimatedTime || 0));
    }
}

// --- Event Listeners ---

// Listen for sort dropdown changes
if (sortDropdown) {
    sortDropdown.addEventListener('change', (e) => {
        applySort(e.target.value);
        renderAssignments();
    });
}

// Listen for form submission
if (form) {
    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Stop page from refreshing

        // Gather data with numeric conversions
        const newAssignment = {
            title: document.getElementById('assignment-title').value,
            courseName: document.getElementById('course-name').value,
            dueDate: document.getElementById('due-date').value,
            urgency: parseInt(document.getElementById('assignment-urgency').value, 10) || 4,
            estimatedTime: parseInt(document.getElementById('estimated-time').value, 10) || 0
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
                throw new Error('Failed to save assignment');
            }

            // Reload and clear form
            await loadAssignments();
            form.reset();

        } catch (error) {
            console.error('Error creating assignment:', error);
            alert('Could not create the assignment. Is your backend server running?');
        }
    });
}

const procrastinationToggle = document.getElementById('procrastination-toggle');
const procrastinationMessage = document.getElementById('procrastination-message');

if (procrastinationToggle) {
    procrastinationToggle.addEventListener('change', (e) => {
        if (e.target.checked) {
            procrastinationMessage.classList.remove('hidden');
            // Automatically sort by Urgency (Highest First) when toggled ON
            if (sortDropdown) {
                sortDropdown.value = 'assignment-urgency-asc';
                applySort('assignment-urgency-asc');
                renderAssignments();
            }
        } else {
            procrastinationMessage.classList.add('hidden');
        }
    });
}