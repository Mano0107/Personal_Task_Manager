requireAuth();

// Global State
let allTasks = [];
let currentFilter = 'all';
let currentSearch = '';

// Calendar State
let currentDate = new Date();
let selectedDate = null;

document.addEventListener('DOMContentLoaded', () => {
    initSettings();
    initGreeting();
    loadTasks();
    setupEventListeners();
});

function initGreeting() {
    const hour = new Date().getHours();
    let greeting = 'Good Morning 👋';
    
    if (hour >= 5 && hour < 12) {
        greeting = 'Good Morning 👋';
    } else if (hour >= 12 && hour < 17) {
        greeting = 'Good Afternoon ☀️';
    } else if (hour >= 17 && hour < 21) {
        greeting = 'Good Evening 🌙';
    } else {
        greeting = 'Good Night 🌌';
    }
    
    const greetingEl = document.getElementById('greeting-title');
    if (greetingEl) {
        greetingEl.textContent = greeting;
    }
}

const modal = document.getElementById('task-modal');
const taskForm = document.getElementById('task-form');

function setupEventListeners() {
    // Modal
    taskForm.addEventListener('submit', handleTaskSubmit);
    
    // Search
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentSearch = e.target.value.toLowerCase();
            renderTasks();
        });
    }

    // Navigation and Filters
    const navItems = document.querySelectorAll('.nav-item');
    const filterBtns = document.querySelectorAll('.filter-btn');

    navItems.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const href = btn.getAttribute('href');
            if (!href || !href.startsWith('#')) e.preventDefault();

            if (btn.classList.contains('logout-btn')) return;

            navItems.forEach(el => el.classList.remove('active'));
            btn.classList.add('active');

            const view = btn.getAttribute('data-view');
            if (view) switchView(view);

            const filterVal = btn.getAttribute('data-filter');
            if (filterVal) {
                filterBtns.forEach(el => el.classList.remove('active'));
                const matchedFilter = document.querySelector(`.filter-btn[data-filter="${filterVal}"]`);
                if (matchedFilter) matchedFilter.classList.add('active');
                currentFilter = filterVal;
                renderTasks();
            }

            if (window.innerWidth <= 768) toggleSidebar();
        });
    });

    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            filterBtns.forEach(el => el.classList.remove('active'));
            btn.classList.add('active');

            const filterVal = btn.getAttribute('data-filter');
            if (filterVal) {
                navItems.forEach(el => el.classList.remove('active'));
                const matchedNav = document.querySelector(`.nav-item[data-filter="${filterVal}"]`);
                if (matchedNav) {
                    matchedNav.classList.add('active');
                } else {
                    const defaultNav = document.querySelector('.nav-item[data-filter="all"]');
                    if (defaultNav) defaultNav.classList.add('active');
                }
                
                currentFilter = filterVal;
                renderTasks();
            }
        });
    });

    setupSettingsListeners();

    // Calendar
    const prevBtn = document.getElementById('prev-month');
    const nextBtn = document.getElementById('next-month');
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderCalendar();
        });
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderCalendar();
        });
    }
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.classList.toggle('open');
    }
}

function toggleInsights() {
    const content = document.getElementById('insights-content');
    const icon = document.getElementById('insights-toggle-icon');
    if (content.classList.contains('hidden')) {
        content.classList.remove('hidden');
        icon.setAttribute('points', '18 15 12 9 6 15'); // arrow up
    } else {
        content.classList.add('hidden');
        icon.setAttribute('points', '6 9 12 15 18 9'); // arrow down
    }
}

function openModal(taskId = null) {
    taskForm.reset();
    document.getElementById('task-id').value = '';
    document.getElementById('modal-title').textContent = taskId ? 'Edit Task' : 'Create Task';
    
    if (taskId) {
        const task = allTasks.find(t => t.id === taskId);
        if (task) {
            document.getElementById('task-id').value = task.id;
            document.getElementById('title').value = task.title;
            document.getElementById('description').value = task.description || '';
            if (task.due_date) {
                document.getElementById('due-date').value = task.due_date;
            }
        }
    }
    
    modal.classList.add('active');
}

function closeModal() {
    modal.classList.remove('active');
}

async function handleTaskSubmit(e) {
    e.preventDefault();
    
    const id = document.getElementById('task-id').value;
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const dueDate = document.getElementById('due-date').value;
    const btn = document.getElementById('save-btn');
    
    const payload = {
        title,
        description: description || null,
        due_date: dueDate || null
    };
    
    try {
        btn.textContent = 'Saving...';
        btn.disabled = true;
        
        if (id) {
            await fetchAPI(`/tasks/${id}`, {
                method: 'PUT',
                body: JSON.stringify(payload)
            });
            showToast('Task updated successfully');
        } else {
            await fetchAPI('/tasks/', {
                method: 'POST',
                body: JSON.stringify(payload)
            });
            showToast('Task created successfully');
        }
        
        closeModal();
        await loadTasks();
    } catch (error) {
        showToast(error.message, true);
    } finally {
        btn.textContent = 'Save Task';
        btn.disabled = false;
    }
}

async function loadTasks() {
    try {
        const tasks = await fetchAPI('/tasks/');
        allTasks = tasks || [];
        updateStats();
        generateAIInsights();
        renderTasks();
        renderCalendar();
    } catch (error) {
        showToast('Failed to load tasks', true);
        document.getElementById('tasks-container').innerHTML = '<p style="color:var(--danger); grid-column:1/-1; text-align:center;">Error loading tasks. Please try again.</p>';
    }
}

function updateStats() {
    const total = allTasks.length;
    const completed = allTasks.filter(t => t.completed).length;
    const pending = total - completed;
    const highPriority = allTasks.filter(t => t.priority === 'High' && !t.completed).length;
    
    const today = new Date().toISOString().split('T')[0];
    const dueToday = allTasks.filter(t => t.due_date === today && !t.completed).length;

    document.getElementById('stat-total').textContent = total;
    document.getElementById('stat-completed').textContent = completed;
    document.getElementById('stat-pending').textContent = pending;
    
    const statToday = document.getElementById('stat-today');
    if (statToday) statToday.textContent = dueToday;
    
    const statHigh = document.getElementById('stat-high');
    if (statHigh) statHigh.textContent = highPriority;
    
    // Update summary text
    document.getElementById('task-summary-text').textContent = 
        pending > 0 
            ? `You have ${pending} pending task${pending > 1 ? 's' : ''}.`
            : (total > 0 ? 'All caught up! Great job.' : 'No tasks yet. Create one to get started.');
}

function generateAIInsights() {
    const content = document.getElementById('insights-content');
    if (!content) return;
    
    if (allTasks.length === 0) {
        content.innerHTML = '<div class="insight-item">Start by creating tasks. Our AI will analyze them and provide productivity insights here.</div>';
        return;
    }

    const pendingTasks = allTasks.filter(t => !t.completed);
    const today = new Date().toISOString().split('T')[0];
    
    const overdue = pendingTasks.filter(t => t.due_date && t.due_date < today);
    const highPriority = pendingTasks.filter(t => t.priority === 'High');
    
    let insightsHtml = '';

    if (overdue.length > 0) {
        insightsHtml += `<div class="insight-item" style="color: var(--danger)">You have ${overdue.length} overdue task${overdue.length > 1 ? 's' : ''}. Consider rescheduling or prioritizing them.</div>`;
    }

    if (highPriority.length > 0) {
        insightsHtml += `<div class="insight-item">Focus on your ${highPriority.length} High Priority task${highPriority.length > 1 ? 's' : ''} first to maximize impact today.</div>`;
    } else if (pendingTasks.length > 0) {
        insightsHtml += `<div class="insight-item">You have no High Priority tasks. Great time to knock out some lower priority items or plan ahead.</div>`;
    }

    if (pendingTasks.length > 5) {
        insightsHtml += `<div class="insight-item">High workload detected. Try breaking down larger tasks into smaller, manageable chunks.</div>`;
    }

    if (allTasks.length > 0 && pendingTasks.length === 0) {
        insightsHtml += `<div class="insight-item" style="color: var(--success)">Incredible! You've completed all your tasks. Take a well-deserved break!</div>`;
    }

    if (!insightsHtml) {
        insightsHtml = `<div class="insight-item">Your workload is well balanced. Keep up the steady pace!</div>`;
    }

    content.innerHTML = insightsHtml;
}

function renderTasks() {
    const container = document.getElementById('tasks-container');
    
    // Apply filters
    let filteredTasks = allTasks.filter(task => {
        // Text Search
        if (currentSearch && !task.title.toLowerCase().includes(currentSearch) && 
            (!task.description || !task.description.toLowerCase().includes(currentSearch))) {
            return false;
        }
        
        // Category Filter
        if (currentFilter === 'pending') return !task.completed;
        if (currentFilter === 'completed') return task.completed;
        if (currentFilter === 'high') return task.priority === 'High';
        return true; // 'all'
    });
    
    if (filteredTasks.length === 0) {
        const template = document.getElementById('empty-state-template');
        container.innerHTML = '';
        container.appendChild(template.content.cloneNode(true));
        
        // Update empty state text based on context
        const emptyText = container.querySelector('#empty-state-text');
        if (emptyText && allTasks.length > 0) {
            emptyText.textContent = "No tasks match your current filters or search.";
        }
        return;
    }
    
    const today = new Date().toISOString().split('T')[0];
    
    container.innerHTML = filteredTasks.map(task => {
        const isOverdue = task.due_date && task.due_date < today && !task.completed;
        
        return `
        <div class="task-card glass ${task.completed ? 'completed' : ''} priority-${task.priority}" onclick="openModal(${task.id})">
            <div class="task-header">
                <div class="task-title">${escapeHtml(task.title)}</div>
                <div class="priority-badge badge-${task.priority}">${task.priority}</div>
            </div>
            <div class="task-desc">${task.description ? escapeHtml(task.description) : '<span style="opacity:0.5;font-style:italic">No description provided</span>'}</div>
            <div class="task-footer">
                <div class="task-date ${isOverdue ? 'overdue' : ''}">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    ${task.due_date ? task.due_date : 'No due date'}
                </div>
                <div class="task-actions">
                    <button class="action-btn complete" onclick="toggleComplete(${task.id}, ${task.completed}, event)" title="${task.completed ? 'Mark pending' : 'Mark complete'}">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            ${task.completed 
                                ? '<polyline points="1 4 1 10 7 10"></polyline><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>' 
                                : '<polyline points="20 6 9 17 4 12"></polyline>'}
                        </svg>
                    </button>
                    <button class="action-btn" onclick="openModal(${task.id}); event.stopPropagation();" title="Edit">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>
                    <button class="action-btn delete" onclick="deleteTask(${task.id}, event)" title="Delete">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                </div>
            </div>
        </div>
        `;
    }).join('');
}

async function toggleComplete(id, currentStatus, e) {
    if (e) e.stopPropagation();
    try {
        await fetchAPI(`/tasks/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ completed: !currentStatus })
        });
        showToast(currentStatus ? 'Task marked as pending' : 'Task completed!');
        await loadTasks();
    } catch (error) {
        showToast('Failed to update task', true);
    }
}

async function deleteTask(id, e) {
    if (e) e.stopPropagation();
    if (confirm('Are you sure you want to delete this task?')) {
        try {
            await fetchAPI(`/tasks/${id}`, {
                method: 'DELETE'
            });
            showToast('Task deleted');
            await loadTasks();
        } catch (error) {
            showToast('Failed to delete task', true);
        }
    }
}

function escapeHtml(unsafe) {
    if (!unsafe) return '';
    return unsafe
         .toString()
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}

/* --- Calendar Logic --- */

function renderCalendar() {
    const grid = document.getElementById('calendar-grid');
    const monthYearText = document.getElementById('calendar-month-year');
    if (!grid || !monthYearText) return;

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startingDay = firstDay.getDay(); // 0 (Sun) to 6 (Sat)
    const totalDays = lastDay.getDate();
    
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    monthYearText.textContent = `${monthNames[month]} ${year}`;
    
    // Clear previous cells (keep headers)
    const headers = `
        <div class="calendar-day-header">Su</div>
        <div class="calendar-day-header">Mo</div>
        <div class="calendar-day-header">Tu</div>
        <div class="calendar-day-header">We</div>
        <div class="calendar-day-header">Th</div>
        <div class="calendar-day-header">Fr</div>
        <div class="calendar-day-header">Sa</div>
    `;
    let cellsHtml = '';

    const todayStr = new Date().toISOString().split('T')[0];
    const selectedStr = selectedDate ? selectedDate.toISOString().split('T')[0] : null;

    // Previous month filler
    for (let i = 0; i < startingDay; i++) {
        const day = prevMonthLastDay - startingDay + i + 1;
        cellsHtml += `<div class="calendar-cell other-month">${day}</div>`;
    }

    // Current month days
    for (let i = 1; i <= totalDays; i++) {
        // Create YYYY-MM-DD string for comparison
        const mStr = String(month + 1).padStart(2, '0');
        const dStr = String(i).padStart(2, '0');
        const dateStr = `${year}-${mStr}-${dStr}`;
        
        let classList = 'calendar-cell current-month';
        if (dateStr === todayStr) classList += ' today';
        if (dateStr === selectedStr) classList += ' selected';
        
        // Find tasks for this day
        const dayTasks = allTasks.filter(t => t.due_date === dateStr);
        let indicatorsHtml = '';
        
        if (dayTasks.length > 0) {
            indicatorsHtml += '<div class="calendar-indicators">';
            // Show up to 3 dots based on priority/status
            const displayTasks = dayTasks.slice(0, 3);
            displayTasks.forEach(t => {
                let pClass = 'low';
                if (t.completed) pClass = 'completed';
                else if (t.priority === 'High') pClass = 'high';
                else if (t.priority === 'Medium') pClass = 'medium';
                
                indicatorsHtml += `<div class="indicator ${pClass}"></div>`;
            });
            indicatorsHtml += '</div>';
        }

        cellsHtml += `<div class="${classList}" onclick="selectCalendarDate('${dateStr}')">
            ${i}
            ${indicatorsHtml}
        </div>`;
    }

    // Next month filler
    const totalCells = startingDay + totalDays;
    const remainingCells = Math.ceil(totalCells / 7) * 7 - totalCells;
    for (let i = 1; i <= remainingCells; i++) {
        cellsHtml += `<div class="calendar-cell other-month">${i}</div>`;
    }

    grid.innerHTML = headers + cellsHtml;
    
    // Auto-update selected day tasks if it is currently open
    if (selectedStr) {
        showTasksForDate(selectedStr);
    }
}

function selectCalendarDate(dateStr) {
    selectedDate = new Date(dateStr);
    renderCalendar(); // re-render to update selected styling
    showTasksForDate(dateStr);
}

function showTasksForDate(dateStr) {
    const dayTasksDiv = document.getElementById('calendar-day-tasks');
    const dayTasksList = document.getElementById('calendar-day-tasks-list');
    const selectedDateHeader = document.getElementById('calendar-selected-date');
    
    if (!dayTasksDiv || !dayTasksList) return;
    
    const dayTasks = allTasks.filter(t => t.due_date === dateStr);
    
    // Format date nice
    const d = new Date(dateStr);
    const niceDate = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    selectedDateHeader.textContent = `Tasks for ${niceDate}`;
    
    if (dayTasks.length === 0) {
        dayTasksList.innerHTML = '<p style="color:var(--text-muted); font-size: 13px;">No tasks due on this date.</p>';
    } else {
        dayTasksList.innerHTML = dayTasks.map(task => {
            return `
            <div class="mini-task-item priority-${task.priority} ${task.completed ? 'completed' : ''}" onclick="openModal(${task.id})" style="cursor:pointer;">
                <div class="mini-task-title" title="${escapeHtml(task.title)}">${escapeHtml(task.title)}</div>
                ${task.completed ? '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="var(--success)" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>' : ''}
            </div>
            `;
        }).join('');
    }
    
    dayTasksDiv.classList.remove('hidden');
}

/* --- Settings & Views Logic --- */

function switchView(viewId) {
    document.querySelectorAll('.view-section').forEach(view => {
        view.classList.remove('active');
        view.classList.add('hidden');
    });
    const targetView = document.getElementById('view-' + viewId);
    if (targetView) {
        targetView.classList.remove('hidden');
        targetView.classList.add('active');
    }
}

async function initSettings() {
    const color = localStorage.getItem('accent_color') || '#7C5CFF';
    applyAccentColor(color);

    document.querySelectorAll('.color-btn').forEach(btn => {
        if (btn.getAttribute('data-color') === color) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    try {
        const user = await fetchAPI('/auth/me');
        if (user && user.username) {
            const username = user.username;
            
            const userEl = document.getElementById('settings-username');
            if (userEl) userEl.textContent = username;
            
            const initials = username.split(' ')
                .map(n => n[0])
                .join('')
                .substring(0, 2)
                .toUpperCase();
                
            const avatar = document.querySelector('.avatar-placeholder');
            if (avatar) avatar.textContent = initials;
        }
    } catch(e) {
        console.error("Error loading profile", e);
    }
    
    // Apply initial theme
    const darkModeSaved = localStorage.getItem('pref_pref-dark-mode');
    const isDarkMode = darkModeSaved === null ? true : (darkModeSaved === 'true');
    applyTheme(isDarkMode);
}

function setupSettingsListeners() {
    document.querySelectorAll('.color-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const color = btn.getAttribute('data-color');
            localStorage.setItem('accent_color', color);
            applyAccentColor(color);
        });
    });
    
    const toggles = document.querySelectorAll('.settings-card input[type="checkbox"]');
    toggles.forEach(toggle => {
        const key = 'pref_' + toggle.id;
        const saved = localStorage.getItem(key);
        if (saved !== null) {
            toggle.checked = saved === 'true';
        }
        toggle.addEventListener('change', (e) => {
            localStorage.setItem(key, e.target.checked);
            
            // Handle Dark Mode toggle explicitly
            if (toggle.id === 'pref-dark-mode') {
                applyTheme(e.target.checked);
            } else {
                showToast('Preference saved');
            }
        });
    });
}

function applyTheme(isDark) {
    if (isDark) {
        document.body.classList.remove('light-theme');
    } else {
        document.body.classList.add('light-theme');
    }
}

function applyAccentColor(color) {
    document.documentElement.style.setProperty('--accent', color);
}

async function clearCompletedTasks() {
    if (confirm('Are you sure you want to permanently delete all completed tasks?')) {
        try {
            const completed = allTasks.filter(t => t.completed);
            for (let t of completed) {
                await fetchAPI('/tasks/' + t.id, { method: 'DELETE' });
            }
            showToast('Completed tasks cleared');
            await loadTasks();
        } catch(e) {
            showToast('Error clearing tasks', true);
        }
    }
}

function resetPreferences() {
    if (confirm('Reset all dashboard preferences to default?')) {
        localStorage.clear();
        const token = localStorage.getItem('token');
        if (token) localStorage.setItem('token', token);
        
        window.location.reload();
    }
}

