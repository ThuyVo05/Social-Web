const API = '/api/posts';
const postList = document.getElementById('post-list');
const form = document.getElementById('post-form');
const authNav = document.getElementById('auth-nav');

function renderAuthNav() {
    const user = getUser();
    if (user) {
        authNav.innerHTML = `
            <span class="username">${user.username}</span>
            <button class="auth-link auth-link-btn" id="logout-btn">Đăng xuất</button>
        `;
        document.getElementById('logout-btn').addEventListener('click', logout);
        form.classList.remove('hidden');
    } else {
        authNav.innerHTML = `
            <a href="login.html" class="auth-link">Đăng nhập</a>
            <a href="register.html" class="auth-link auth-link-primary">Đăng ký</a>
        `;
        form.classList.add('hidden');
    }
}

async function loadPosts() {
    try {
        const res = await fetch(API);
        if (!res.ok) {
            throw new Error('Failed to fetch posts');
        }
        const posts = await res.json();
        const loggedIn = isLoggedIn();

        postList.innerHTML = posts.map(post => {
            const date = post.createdAt || post.created_at;
            const deleteBtn = loggedIn
                ? `<button onclick="deletePost(${post.id})">Xóa</button>`
                : '';
            return `
                <li class="post">
                    <strong>${post.author}</strong>
                    <p>${post.content}</p>
                    <small>${new Date(date).toLocaleString('vi-VN')}</small>
                    ${deleteBtn}
                </li>
            `;
        }).join('');
    } catch (error) {
        console.error('Error loading posts:', error);
        postList.innerHTML = '<li class="post">Không thể tải bài viết</li>';
    }
}

async function deletePost(id) {
    try {
        const res = await fetch(`${API}/${id}`, {
            method: 'DELETE',
            headers: authHeaders(),
        });
        if (!res.ok) {
            throw new Error('Failed to delete post');
        }
        loadPosts();
    } catch (error) {
        console.error('Error deleting post:', error);
    }
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const content = document.getElementById('content').value;
    try {
        const res = await fetch(API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...authHeaders(),
            },
            body: JSON.stringify({ content }),
        });
        if (!res.ok) {
            throw new Error('Failed to create post');
        }
        form.reset();
        loadPosts();
    } catch (error) {
        console.error('Error creating post:', error);
    }
});

renderAuthNav();
loadPosts();
