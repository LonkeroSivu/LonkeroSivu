const API_URL = "http://localhost:3000";

// Lataa videot
async function loadVideos() {
    const res = await fetch(`${API_URL}/videos`);
    const data = await res.json();

    if (data.success) {
        const videoList = document.getElementById("videoList");
        videoList.innerHTML = "";

        data.videos.forEach(video => {
            const div = document.createElement("div");
            div.innerHTML = `
                <h3>${video.title}</h3>
                <video width="320" height="240" controls>
                    <source src="${API_URL}${video.url}" type="video/mp4">
                </video>
                <p>
                    <a href="profile.html?user=${video.userId}" style="color:blue;">${video.userId}</a> 
                    <button onclick="vote('${video.url}', 'like')">👍</button> ${video.likes} 
                    <button onclick="vote('${video.url}', 'dislike')">👎</button> ${video.dislikes}
                </p>
            `;
            videoList.appendChild(div);
        });
    }
}

// Äänestäminen (Like/Dislike)
async function vote(videoUrl, type) {
    const userId = localStorage.getItem("username");
    if (!userId) return alert("Kirjaudu sisään!");

    const filename = videoUrl.split("/").pop();
    const res = await fetch(`${API_URL}/video/${filename}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, vote: type })
    });

    if (res.ok) loadVideos();
}

// Videon lataus
async function uploadVideo() {
    const userId = localStorage.getItem("username");
    if (!userId) return alert("Kirjaudu sisään!");

    const title = document.getElementById("videoTitle").value;
    const file = document.getElementById("videoFile").files[0];

    if (!title || !file) return alert("Täytä kaikki kentät!");

    const formData = new FormData();
    formData.append("video", file);
    formData.append("title", title);
    formData.append("userId", userId);

    const res = await fetch(`${API_URL}/upload`, { method: "POST", body: formData });
    if (res.ok) {
        alert("Video ladattu!");
        loadVideos();
    }
}

// Käyttäjänimen vaihto
async function changeUsername() {
    const currentUsername = localStorage.getItem("username");
    if (!currentUsername) return alert("Kirjaudu sisään!");

    const newUsername = document.getElementById("newUsername").value;
    if (!newUsername) return alert("Anna uusi käyttäjänimi!");

    const res = await fetch(`${API_URL}/change-username/${currentUsername}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newUsername })
    });

    if (res.ok) {
        localStorage.setItem("username", newUsername);
        alert("Käyttäjänimi vaihdettu!");
    } else {
        alert("Nimi on jo käytössä!");
    }
}

// Haku
async function search() {
    const query = document.getElementById("searchQuery").value;
    if (!query) return alert("Anna hakusana!");

    const userRes = await fetch(`${API_URL}/user/${query}`);
    const videoRes = await fetch(`${API_URL}/video/${query}`);

    let message = "";
    if (userRes.ok) message += `Käyttäjä löytyi: <a href="profile.html?user=${query}">${query}</a><br>`;
    if (videoRes.ok) {
        const videoData = await videoRes.json();
        message += `Videot: ${videoData.videos.map(v => v.title).join(", ")}`;
    }

    alert(message || "Ei tuloksia!");
}

loadVideos();
