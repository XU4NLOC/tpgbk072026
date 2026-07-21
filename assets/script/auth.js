(function () {
    'use strict';

    const modal = document.querySelector('[data-auth-modal]');
    const form = document.querySelector('[data-auth-form]');
    if (!modal || !form) return;

    const state = { user: null, mode: 'login', pending: false };
    const emailInput = form.elements.email;
    const passwordInput = form.elements.password;
    const title = document.getElementById('auth-title');
    const intro = document.querySelector('[data-auth-intro]');
    const message = document.querySelector('[data-auth-message]');
    const help = document.querySelector('[data-password-help]');
    const submit = form.querySelector('.auth-submit');

    function isEnglish() {
        return localStorage.getItem('template') === 'en';
    }

    function copy() {
        const en = isEnglish();
        return state.mode === 'login'
            ? { title: en ? 'Log in' : 'Đăng nhập', intro: en ? 'Log in to access your The Peak Garden account.' : 'Đăng nhập để truy cập tài khoản The Peak Garden của bạn.', submit: en ? 'Log in' : 'Đăng nhập' }
            : { title: en ? 'Create account' : 'Tạo tài khoản', intro: en ? 'Use your email and a secure password of at least 12 characters.' : 'Sử dụng email và mật khẩu an toàn có ít nhất 12 ký tự.', submit: en ? 'Sign up' : 'Đăng ký' };
    }

    function renderMode() {
        const text = copy();
        title.textContent = text.title;
        intro.textContent = text.intro;
        submit.textContent = text.submit;
        passwordInput.autocomplete = state.mode === 'login' ? 'current-password' : 'new-password';
        help.hidden = state.mode !== 'signup';
        document.querySelectorAll('[data-auth-tab]').forEach(function (tab) {
            tab.classList.toggle('active', tab.dataset.authTab === state.mode);
            tab.setAttribute('aria-selected', tab.dataset.authTab === state.mode ? 'true' : 'false');
        });
        message.textContent = '';
    }

    function renderUser() {
        const en = isEnglish();
        document.querySelectorAll('[data-auth-open]').forEach(function (button) {
            button.hidden = Boolean(state.user);
            button.textContent = en ? 'Log in' : 'Đăng nhập';
        });
        document.querySelectorAll('[data-auth-account]').forEach(function (account) { account.hidden = !state.user; });
        document.querySelectorAll('[data-auth-email]').forEach(function (element) { element.textContent = state.user ? state.user.email : ''; });
        document.querySelectorAll('[data-auth-logout]').forEach(function (button) { button.textContent = en ? 'Log out' : 'Đăng xuất'; });
    }

    function openModal() {
        modal.hidden = false;
        document.body.classList.add('auth-modal-open');
        renderMode();
        window.setTimeout(function () { emailInput.focus(); }, 0);
    }

    function closeModal() {
        modal.hidden = true;
        document.body.classList.remove('auth-modal-open');
        form.reset();
        message.textContent = '';
    }

    async function request(path, options) {
        const response = await fetch(path, Object.assign({ credentials: 'same-origin', headers: { 'Content-Type': 'application/json' } }, options || {}));
        let data = {};
        try { data = await response.json(); } catch (_) {}
        if (!response.ok) throw new Error(data.error || (isEnglish() ? 'Something went wrong. Please try again.' : 'Có lỗi xảy ra. Vui lòng thử lại.'));
        return data;
    }

    document.querySelectorAll('[data-auth-open]').forEach(function (button) { button.addEventListener('click', openModal); });
    document.querySelectorAll('[data-auth-close]').forEach(function (button) { button.addEventListener('click', closeModal); });
    document.querySelectorAll('[data-auth-tab]').forEach(function (tab) {
        tab.addEventListener('click', function () { state.mode = tab.dataset.authTab; renderMode(); });
    });
    document.querySelector('[data-password-toggle]').addEventListener('click', function (event) {
        const showing = passwordInput.type === 'text';
        passwordInput.type = showing ? 'password' : 'text';
        event.currentTarget.textContent = showing ? (isEnglish() ? 'Show' : 'Hiện') : (isEnglish() ? 'Hide' : 'Ẩn');
    });
    document.addEventListener('keydown', function (event) { if (event.key === 'Escape' && !modal.hidden) closeModal(); });

    form.addEventListener('submit', async function (event) {
        event.preventDefault();
        if (state.pending) return;
        if (!form.checkValidity()) { form.reportValidity(); return; }
        state.pending = true;
        submit.disabled = true;
        message.textContent = '';
        try {
            const data = await request('/api/auth/' + state.mode, { method: 'POST', body: JSON.stringify({ email: emailInput.value, password: passwordInput.value }) });
            state.user = data.user;
            renderUser();
            closeModal();
        } catch (error) {
            message.textContent = error.message;
        } finally {
            state.pending = false;
            submit.disabled = false;
        }
    });

    document.querySelectorAll('[data-auth-logout]').forEach(function (button) {
        button.addEventListener('click', async function () {
            try { await request('/api/auth/logout', { method: 'POST' }); } catch (_) {}
            state.user = null;
            renderUser();
        });
    });

    request('/api/auth/me').then(function (data) { state.user = data.user; renderUser(); }).catch(renderUser);
}());
