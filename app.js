(function () {
    'use strict';

    const STORAGE_KEY = 'todo-list-items';

    const form = document.getElementById('todo-form');
    const input = document.getElementById('todo-input');
    const listEl = document.getElementById('todo-list');
    const footer = document.getElementById('footer');
    const countEl = document.getElementById('todo-count');
    const clearBtn = document.getElementById('clear-completed');
    const filterBtns = document.querySelectorAll('.filter-btn');

    let todos = loadTodos();
    let currentFilter = 'all';

    // ---- 主题切换（深色/浅色）----
    const THEME_KEY = 'todo-theme';
    const themeToggle = document.getElementById('theme-toggle');

    function getStoredTheme() {
        try {
            const t = localStorage.getItem(THEME_KEY);
            return t === 'dark' || t === 'light' ? t : null;
        } catch (e) {
            return null;
        }
    }

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
    }

    function currentTheme() {
        return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    }

    function toggleTheme() {
        const next = currentTheme() === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        try {
            localStorage.setItem(THEME_KEY, next);
        } catch (e) {}
    }

    // 初始化主题：优先用已保存的值，否则默认浅色
    applyTheme(getStoredTheme() || 'light');

    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // ---- 持久化 ----
    function loadTodos() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            const parsed = raw ? JSON.parse(raw) : [];
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            return [];
        }
    }

    function saveTodos() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    }

    // ---- 工具 ----
    function uid() {
        return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
    }

    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    // ---- 渲染 ----
    function getVisibleTodos() {
        if (currentFilter === 'active') {
            return todos.filter(t => !t.completed);
        }
        if (currentFilter === 'completed') {
            return todos.filter(t => t.completed);
        }
        return todos;
    }

    function render() {
        const visible = getVisibleTodos();

        if (visible.length === 0) {
            const msg = currentFilter === 'completed'
                ? '还没有已完成的任务'
                : currentFilter === 'active'
                    ? '没有未完成的任务，太棒了！'
                    : '还没有任务，添加一个吧';
            listEl.innerHTML = `<li class="empty-state">${msg}</li>`;
        } else {
            listEl.innerHTML = visible.map(renderItem).join('');
        }

        const activeCount = todos.filter(t => !t.completed).length;
        const completedCount = todos.length - activeCount;

        if (todos.length === 0) {
            footer.style.display = 'none';
        } else {
            footer.style.display = 'flex';
            countEl.innerHTML = `剩余 <strong>${activeCount}</strong> 项未完成`;
            clearBtn.style.visibility = completedCount > 0 ? 'visible' : 'hidden';
        }
    }

    function renderItem(todo) {
        return `
            <li class="todo-item ${todo.completed ? 'completed' : ''}" data-id="${todo.id}">
                <span class="checkbox" role="checkbox" aria-checked="${todo.completed}" tabindex="0"></span>
                <span class="todo-text">${escapeHtml(todo.text)}</span>
                <button class="btn-delete" aria-label="删除任务" title="删除">×</button>
            </li>
        `;
    }

    // ---- 操作 ----
    function addTodo(text) {
        const trimmed = text.trim();
        if (!trimmed) return;
        todos.unshift({ id: uid(), text: trimmed, completed: false });
        saveTodos();
        render();
    }

    function toggleTodo(id) {
        const todo = todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            saveTodos();
            render();
        }
    }

    function deleteTodo(id) {
        todos = todos.filter(t => t.id !== id);
        saveTodos();
        render();
    }

    function clearCompleted() {
        todos = todos.filter(t => !t.completed);
        saveTodos();
        render();
    }

    // ---- 事件 ----
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        addTodo(input.value);
        input.value = '';
        input.focus();
    });

    listEl.addEventListener('click', function (e) {
        const item = e.target.closest('.todo-item');
        if (!item) return;
        const id = item.dataset.id;

        if (e.target.classList.contains('btn-delete')) {
            deleteTodo(id);
        } else {
            toggleTodo(id);
        }
    });

    listEl.addEventListener('keydown', function (e) {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        const checkbox = e.target.closest('.checkbox');
        if (!checkbox) return;
        e.preventDefault();
        const item = checkbox.closest('.todo-item');
        if (item) toggleTodo(item.dataset.id);
    });

    clearBtn.addEventListener('click', clearCompleted);

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            render();
        });
    });

    // 初始渲染
    render();
})();
