const API = '/api/messages';
const messageList = document.getElementById('message-list');
const form = document.getElementById('message-form');
const contentInput = document.getElementById('content');
const preview = document.getElementById('preview');
const authNav = document.getElementById('auth-nav');

function renderAuthNav() {
    const user = getUser();
    if (user) {
        authNav.innerHTML = `
            <a href="chat.html" class="auth-link">Chat</a>
            <span class="username">${user.username}</span>
            <button class="auth-link auth-link-btn" id="logout-btn">Đăng xuất</button>
        `;
        document.getElementById('logout-btn').addEventListener('click', logout);
        form.classList.remove('hidden');
    } else {
        authNav.innerHTML = `
            <a href="chat.html" class="auth-link">Chat</a>
            <a href="login.html" class="auth-link">Đăng nhập</a>
            <a href="register.html" class="auth-link auth-link-primary">Đăng ký</a>
        `;
        form.classList.add('hidden');
    }
}

function renderMessage(message) {
    const image = message.image_url
        ? `<img src="${message.image_url}" alt="Image" class="message-image" />`
        : '';
    const date = message.created_at || message.createdAt;
    return `
        <li>
            <span class="username">${message.author}</span>
            <span class="content">${message.content}</span>
            ${image}
            <small>${new Date(date).toLocaleString('vi-VN')}</small>
        </li>
    `;
}

async function loadMessages() {
    try {
        const res = await fetch(API, { headers: authHeaders() });
        if (!res.ok) {
            throw new Error('Failed to fetch messages');
        }
        const messages = await res.json();
        messageList.innerHTML = messages.map(renderMessage).join('');
        messageList.scrollTop = messageList.scrollHeight;
    } catch (error) {
        console.error('Error loading messages:', error);
        messageList.innerHTML = '<li>Không thể tải tin nhắn</li>';
    }
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData();
    const content = document.getElementById('content').value;
    const image = document.getElementById('image').files[0];
    if (content) {
        formData.append('content', content);
    }
    if (image) {
        formData.append('image', image);
    }
    if (!content.trim() && !image) {
        alert('Cần có nội dung hoặc ảnh');
        return;
    }
    try {
        const res = await fetch(API, { method: 'POST', headers: authHeaders(), body: formData });
        if (!res.ok) {
            throw new Error('Failed to send message');
        }
        form.reset();
        loadMessages();
    } catch (error) {
        console.error('Error sending message:', error);
    }
});

renderAuthNav();
loadMessages();
setInterval(loadMessages, 3000);
