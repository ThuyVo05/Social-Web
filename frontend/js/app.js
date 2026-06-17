const API = '/api/posts';
const postList = document.getElementById('post-list');
const form = document.getElementById('post-form');

async function loadPosts() {
    try {
        const res = await fetch(API);
        if (!res.ok) {
            throw new Error('Failed to fetch posts');
        }
        const posts = await res.json();

        postList.innerHTML = posts.map(post => `
            <li class="post">
                <strong>${post.author}</strong>
                <p>${post.content}</p>
                <small>${new Date(post.createdAt).toLocaleString('vi-VN')}</small>
                <button onclick="deletePost(${post.id})">Xóa</button>
            </li>
        `).join('');
    } catch (error) {
        console.error('Error loading posts:', error);
        postList.innerHTML = '<li class="post">Error loading posts</li>';
    }
}

async function deletePost(id) {
    try {
        const res = await fetch(`${API}/${id}`, {
            method: 'DELETE',
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
    const author = document.getElementById('author').value;
    const content = document.getElementById('content').value;
    try {
        const res = await fetch(API, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({author, content}),
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

loadPosts();