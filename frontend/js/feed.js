// Load posts on page load
document.addEventListener("DOMContentLoaded", () => {
  checkAuth();
  loadPosts();
});

let currentPostId = null;

async function loadPosts() {
  try {
    const posts = await api.getPosts();
    displayPosts(posts);
  } catch (error) {
    console.error("Error loading posts:", error);
    document.getElementById("postsFeed").innerHTML = `
            <div class="text-center py-10">
                <i class="fas fa-exclamation-circle text-3xl text-red-500"></i>
                <p class="mt-2 text-gray-400">Failed to load posts</p>
            </div>
        `;
  }
}

function displayPosts(posts) {
  const feed = document.getElementById("postsFeed");

  if (!posts.length) {
    feed.innerHTML = `
            <div class="text-center py-10">
                <i class="fas fa-newspaper text-3xl text-purple-500"></i>
                <p class="mt-2 text-gray-400">No posts yet. Be the first to create one!</p>
            </div>
        `;
    return;
  }

  feed.innerHTML = posts
    .map(
      (post) => `
        <div class="glass-effect rounded-2xl p-6 post-card">
            <div class="flex items-start justify-between mb-4">
                <div class="flex items-center space-x-3">
                    <img src="${post.author.profile_picture || "https://via.placeholder.com/40"}" class="w-10 h-10 rounded-full">
                    <div>
                        <p class="font-semibold">${post.author.username}</p>
                        <p class="text-xs text-gray-400">${formatDate(post.created_at)}</p>
                    </div>
                </div>
                <span class="px-3 py-1 rounded-full text-xs bg-purple-500/20 text-purple-300">
                    ${getPostTypeIcon(post.type)} ${post.type.toUpperCase()}
                </span>
            </div>
            
            <h3 class="text-xl font-bold mb-2">${escapeHtml(post.title)}</h3>
            <p class="text-gray-300 mb-4">${escapeHtml(post.content)}</p>
            
            ${post.image_url ? `<img src="${post.image_url}" class="rounded-xl mb-4 max-h-96 w-full object-cover">` : ""}
            
            <div class="flex items-center space-x-6 mb-4">
                <button onclick="toggleLike(${post.id})" class="flex items-center space-x-2 hover:text-pink-500 transition">
                    <i class="fas fa-heart ${post.is_liked ? "text-pink-500" : ""}"></i>
                    <span id="likeCount-${post.id}">${post.likes_count || 0}</span>
                </button>
                <button onclick="toggleComments(${post.id})" class="flex items-center space-x-2 hover:text-purple-500 transition">
                    <i class="fas fa-comment"></i>
                    <span>${post.comments_count || 0}</span>
                </button>
                <button class="flex items-center space-x-2 hover:text-purple-500 transition">
                    <i class="fas fa-bookmark"></i>
                </button>
            </div>
            
            <div id="comments-${post.id}" class="comment-section">
                <div class="border-t border-gray-700 pt-4 mt-2">
                    <div class="flex items-center space-x-2 mb-3">
                        <input type="text" id="commentInput-${post.id}" placeholder="Write a comment..." 
                               class="flex-1 px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-sm">
                        <button onclick="addComment(${post.id})" class="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-sm">
                            Post
                        </button>
                    </div>
                    <div id="commentsList-${post.id}" class="space-y-3 max-h-48 overflow-y-auto">
                        <!-- Comments will be loaded here -->
                    </div>
                </div>
            </div>
        </div>
    `,
    )
    .join("");
}

function getPostTypeIcon(type) {
  const icons = {
    notice: "📢",
    event: "🎉",
    announcement: "📣",
  };
  return icons[type] || "📝";
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return "Today";
  } else if (diffDays === 1) {
    return "Yesterday";
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else {
    return date.toLocaleDateString();
  }
}

async function toggleLike(postId) {
  try {
    const response = await api.likePost(postId);
    const likeCountSpan = document.getElementById(`likeCount-${postId}`);
    if (likeCountSpan) {
      likeCountSpan.textContent = response.likes_count;
    }
  } catch (error) {
    console.error("Error liking post:", error);
  }
}

async function toggleComments(postId) {
  const commentsSection = document.getElementById(`comments-${postId}`);
  commentsSection.classList.toggle("active");

  if (commentsSection.classList.contains("active")) {
    await loadComments(postId);
  }
}

async function loadComments(postId) {
  try {
    const comments = await api.getComments(postId);
    const commentsList = document.getElementById(`commentsList-${postId}`);

    if (comments.length === 0) {
      commentsList.innerHTML =
        '<p class="text-gray-500 text-sm text-center">No comments yet</p>';
      return;
    }

    commentsList.innerHTML = comments
      .map(
        (comment) => `
            <div class="flex space-x-2">
                <img src="${comment.author.profile_picture || "https://via.placeholder.com/30"}" class="w-6 h-6 rounded-full">
                <div class="flex-1">
                    <p class="text-sm"><span class="font-semibold">${comment.author.username}</span> ${escapeHtml(comment.content)}</p>
                    <p class="text-xs text-gray-500">${formatDate(comment.created_at)}</p>
                </div>
            </div>
        `,
      )
      .join("");
  } catch (error) {
    console.error("Error loading comments:", error);
  }
}

async function addComment(postId) {
  const input = document.getElementById(`commentInput-${postId}`);
  const content = input.value.trim();

  if (!content) return;

  try {
    await api.addComment(postId, content);
    input.value = "";
    await loadComments(postId);

    // Refresh post to update comment count
    const posts = await api.getPosts();
    displayPosts(posts);
  } catch (error) {
    console.error("Error adding comment:", error);
  }
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// Modal functions
function openModal() {
  document.getElementById("createPostModal").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("createPostModal").classList.add("hidden");
  document.getElementById("postTitle").value = "";
  document.getElementById("postContent").value = "";
  document.getElementById("postImage").value = "";
}

async function createPost() {
  const title = document.getElementById("postTitle").value;
  const content = document.getElementById("postContent").value;
  const type = document.getElementById("postType").value;
  const image_url = document.getElementById("postImage").value;

  if (!title || !content) {
    alert("Please fill in all required fields");
    return;
  }

  try {
    await api.createPost({ title, content, type, image_url });
    closeModal();
    loadPosts();
  } catch (error) {
    console.error("Error creating post:", error);
    alert("Failed to create post");
  }
}

// Event listeners
document.getElementById("createPostBtn")?.addEventListener("click", openModal);
