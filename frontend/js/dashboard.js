document.addEventListener("DOMContentLoaded", async () => {
  checkAuth();
  await loadDashboardData();
});

async function loadDashboardData() {
  try {
    const user = getCurrentUser();
    const profile = await api.getProfile();

    // Update user info
    document.getElementById("userName").textContent = user.username;
    document.getElementById("welcomeName").textContent = user.username;

    // Show/hide admin panel link based on role
    if (user.role === "admin" || user.role === "hod") {
      document.getElementById("adminPanelLink").classList.remove("hidden");
    }

    // Load academic records
    if (profile.academic_record) {
      const academic = profile.academic_record;
      document.getElementById("branch").textContent = academic.branch;
      document.getElementById("semester").textContent =
        `${academic.semester}th Semester`;
      document.getElementById("enrollmentNo").textContent =
        profile.enrollment_no;
      document.getElementById("enrollmentYear").textContent =
        academic.enrollment_year;

      // Calculate average attendance
      if (academic.attendance) {
        const attendanceValues = Object.values(academic.attendance);
        const avgAttendance =
          attendanceValues.reduce((a, b) => a + b, 0) / attendanceValues.length;
        document.getElementById("attendancePercentage").textContent =
          `${Math.round(avgAttendance)}%`;
        document.querySelector(
          "#attendancePercentage + .w-full .bg-gradient-to-r",
        ).style.width = `${avgAttendance}%`;
      }

      // Calculate CGPA from subjects
      if (academic.subjects && academic.subjects.length) {
        const totalMarks = academic.subjects.reduce(
          (sum, subj) => sum + (subj.marks || 0),
          0,
        );
        const cgpa = (totalMarks / (academic.subjects.length * 10)).toFixed(1);
        document.getElementById("cgpa").textContent = cgpa;
      }

      // Fee status
      if (academic.fees) {
        const feeStatus = academic.fees.status || "Paid";
        document.getElementById("feeStatus").textContent = feeStatus;
      }
    }

    // Load recent posts
    const posts = await api.getPosts({ limit: 3 });
    const recentPostsContainer = document.getElementById("recentPosts");
    if (posts.length) {
      recentPostsContainer.innerHTML = posts
        .slice(0, 3)
        .map(
          (post) => `
                <div class="flex items-start space-x-3">
                    <i class="fas ${post.type === "notice" ? "fa-bullhorn" : post.type === "event" ? "fa-calendar-alt" : "fa-chart-line"} text-purple-500 mt-1"></i>
                    <div>
                        <p class="font-semibold">${escapeHtml(post.title)}</p>
                        <p class="text-sm text-gray-400">${escapeHtml(post.content.substring(0, 100))}...</p>
                    </div>
                </div>
            `,
        )
        .join("");
    }

    // Load upcoming events
    const events = posts.filter((p) => p.type === "event");
    document.getElementById("upcomingEvents").textContent = events.length;
  } catch (error) {
    console.error("Error loading dashboard:", error);
  }
}

// User menu dropdown
document.getElementById("userMenuBtn")?.addEventListener("click", () => {
  // You can implement a dropdown menu here
  if (confirm("Logout?")) {
    api.logout();
  }
});
