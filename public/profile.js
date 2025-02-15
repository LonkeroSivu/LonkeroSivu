const API_URL = "http://localhost:3000";

// Hae profiilitiedot
async function loadProfile() {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get("user");
    if (!userId) return alert("Käyttäjää ei löydy!");

    const res = await fetch(`${API_URL}/profile/${userId}`);
    const data = await res.json();

    if (data.success) {
        document.getElementById("username").textContent = data.userId;
        document.getElementById("avatar").src = API_URL + data.avatar;
        document.getElementById("bio").textContent = data.bio;

        const userVideos = document.getElementById("userVideos");
        userVideos.innerHTML = data.videos.map(v => `<p>${v.title} - <a href="${API_URL}${v.url}" target="_blank">Katso</a></p>`).join("");
    } else {
        alert("Profiilia ei löydy!");
    }
}

loadProfile();
