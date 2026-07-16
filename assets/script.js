document.addEventListener("DOMContentLoaded", () => {
    // Gọi hàm kéo nạp toàn bộ dữ liệu từ data.json
    loadDashboardData();
});

function loadDashboardData() {
    fetch('./data/data.json?v=' + new Date().getTime())
        .then(response => {
            if (!response.ok) throw new Error("Không thể tải file dữ liệu JSON");
            return response.json();
        })
        .then(data => {
            // Cập nhật ngày giờ cào cuối cùng dưới chân trang
            if (data.last_updated) {
                document.getElementById("last-updated-text").innerText = `Cập nhật cuối lúc: ${data.last_updated}`;
            }

            // --- TAB 1: HOME (NEWS & WEATHER) ---
            renderTechNews(data.vnexpress_it);
            renderWeather(data.weather_danang);

            // --- TAB 3: CODEFORCES ---
            renderCodeforces(data.codeforces_contests);

            // --- TAB 4: VIỆC LÀM IT ---
            renderITJobs(data.it_jobs);

            // --- TAB 5: GIẢI TRÍ ---
            renderGaming(data.gaming_meta);

            // --- TAB 6: GEAR TECH ---
            renderGearDeals(data.gear_deals);

            // --- TAB 7: NHẬT BẢN ---
            renderYenRate(data.yen_rate);
            renderJapanNews(data.japan_news);
        })
        .catch(error => {
            console.error("Lỗi đồng bộ dữ liệu Tổng Hành Dinh:", error);
        });
}

// 1. Render Tin Tức IT (Tab 1)
function renderTechNews(news) {
    const newsList = document.getElementById("news-list");
    if (!newsList) return;
    if (!news || news.length === 0) {
        newsList.innerHTML = `<li style="color: red;">Không có dữ liệu tin tức.</li>`;
        return;
    }
    newsList.innerHTML = "";
    news.forEach(article => {
        const li = document.createElement("li");
        li.innerHTML = `
            <div class="article-title">📌 ${article.title}</div>
            <span class="date">${article.published}</span>
            <div class="article-content">
                ${article.description}<br>
                <a href="${article.link}" target="_blank" class="read-more-btn">🔗 Đọc toàn văn tại nguồn VNExpress</a>
            </div>
        `;
        const titleEl = li.querySelector('.article-title');
        const contentEl = li.querySelector('.article-content');
        titleEl.addEventListener('click', () => {
            contentEl.style.display = contentEl.style.display === 'block' ? 'none' : 'block';
        });
        newsList.appendChild(li);
    });
}

// 2. Render Thời Tiết (Tab 1)
function renderWeather(weather) {
    const weatherBox = document.querySelector("#tab-home .empty-box");
    if (!weatherBox || !weather) return;
    const timeIcon = weather.is_day === 1 ? "☀️ Ban ngày" : "🌙 Ban đêm";
    weatherBox.innerHTML = `
        <h2>🌦️ Trạm Khí Tượng Đà Nẵng</h2>
        <div style="font-size: 3.5rem; font-weight: bold; color: var(--accent); margin: 20px 0; text-align: center;">
            ${weather.temp}°C
        </div>
        <div style="text-align: center; color: #ccc; font-size: 1.1rem; line-height: 1.6;">
            <p>Trạng thái: <strong style="color: #fff;">${timeIcon}</strong></p>
            <p>Sức gió: <strong style="color: #fff;">${weather.wind} km/h</strong></p>
        </div>
    `;
    weatherBox.classList.remove("empty-box");
}

// 3. Render Codeforces Contests (Tab 3)
function renderCodeforces(contests) {
    const cfList = document.getElementById("codeforces-list");
    if (!cfList) return;
    if (!contests || contests.length === 0) {
        cfList.innerHTML = `<li class="loading">Không có kỳ thi nào sắp diễn ra hoặc lỗi kết nối.</li>`;
        return;
    }
    cfList.innerHTML = "";
    contests.forEach(c => {
        const li = document.createElement("li");
        li.className = "cf-box";
        li.innerHTML = `
            <div>
                <div class="cf-name">🏆 ${c.name}</div>
                <div class="cf-time">📅 Thời gian: ${c.time}</div>
                <div class="cf-duration">⏳ Thời lượng: ${c.duration}</div>
            </div>
            <a href="https://codeforces.com/contest/${c.id}" target="_blank" class="read-more-btn" style="align-self: flex-start; margin-top: 10px;">🔗 Vào Đấu Trường</a>
        `;
        cfList.appendChild(li);
    });
}

// 4. Render Việc Làm IT (Tab 4)
function renderITJobs(jobs) {
    const jobsList = document.getElementById("jobs-list");
    if (!jobsList) return;
    if (!jobs || jobs.length === 0) {
        jobsList.innerHTML = `<li class="loading">Đang cập nhật danh sách việc làm...</li>`;
        return;
    }
    jobsList.innerHTML = "";
    jobs.forEach(j => {
        const li = document.createElement("li");
        li.className = "job-box";
        li.innerHTML = `
            <div>
                <div class="job-title">💻 ${j.title}</div>
                <div class="job-company">🏢 ${j.company}</div>
                <div class="job-location">📍 ${j.location}</div>
                <div class="job-salary">💰 ${j.salary}</div>
            </div>
            <a href="${j.link}" target="_blank" class="read-more-btn" style="align-self: flex-start; margin-top: 10px;">🔗 Xem Chi Tiết Job</a>
        `;
        jobsList.appendChild(li);
    });
}

// 5. Render Giải Trí TFT & Valorant (Tab 5)
function renderGaming(gaming) {
    const tftList = document.getElementById("tft-list");
    const valStatus = document.getElementById("val-status");
    if (!gaming) return;

    // Render TFT
    if (tftList && gaming.tft_meta) {
        tftList.innerHTML = "";
        gaming.tft_meta.forEach(comp => {
            const li = document.createElement("li");
            li.innerHTML = `
                <div style="font-weight: bold; color: #fff; font-size: 1.05rem;">🔮 ${comp.deck}</div>
                <div style="font-size: 0.9rem; color: var(--accent-orange); margin: 5px 0;">Độ khó: ${comp.difficulty}</div>
                <div style="font-size: 0.9rem; color: #aaa;">Trang bị khuyên dùng: <em>${comp.items}</em></div>
            `;
            tftList.appendChild(li);
        });
    }

    // Render Valorant Status
    if (valStatus && gaming.valorant_status) {
        valStatus.innerHTML = `
            <div style="padding: 10px 0;">
                <p>⚡ Server: <strong style="color: var(--accent);">${gaming.valorant_status.server}</strong></p>
                <p>📋 Phiên bản: <strong style="color: #fff;">${gaming.valorant_status.patch}</strong></p>
                <p>🔥 Meta Agent: <strong style="color: var(--accent-red);">${gaming.valorant_status.top_agents}</strong></p>
            </div>
        `;
    }
}

// 6. Render Gear Sales (Tab 6)
function renderGearDeals(gear) {
    const gearList = document.getElementById("gear-list");
    if (!gearList) return;
    if (!gear || gear.length === 0) {
        gearList.innerHTML = `<div class="loading">Không có dữ liệu săn sale.</div>`;
        return;
    }
    gearList.innerHTML = "";
    gear.forEach(item => {
        const card = document.createElement("div");
        card.className = "gear-card";
        card.innerHTML = `
            <div class="gear-name">${item.name}</div>
            <div class="gear-prices">
                <div class="gear-original">Gốc: ${item.original_price}</div>
                <div class="gear-current">${item.current_price}</div>
                <div class="gear-discount">${item.discount}</div>
            </div>
            <div class="gear-status">${item.status}</div>
        `;
        gearList.appendChild(card);
    });
}

// 7. Render Tỷ giá Yên Nhật & Tin Nhật (Tab 7)
function renderYenRate(yen) {
    const yenContainer = document.getElementById("yen-rate-container");
    if (!yenContainer) return;
    if (!yen) {
        yenContainer.innerHTML = `<div class="loading">Lỗi đồng bộ tỷ giá.</div>`;
        return;
    }
    yenContainer.innerHTML = `
        <div style="font-size: 3.5rem; font-weight: bold; color: var(--accent); margin: 20px 0; text-align: center;">
            ${yen.jpy_to_vnd} <span style="font-size: 1.5rem; color: #fff;">VNĐ</span>
        </div>
        <div style="text-align: center; color: #ccc; font-size: 1.1rem;">
            <p>1 Yên Nhật (JPY) = <strong>${yen.jpy_to_vnd} VNĐ</strong></p>
        </div>
    `;
}

function renderJapanNews(news) {
    const jpNewsList = document.getElementById("japan-news-list");
    if (!jpNewsList) return;
    if (!news || news.length === 0) {
        jpNewsList.innerHTML = `<li class="loading">Đang tải tin tức Nhật Bản...</li>`;
        return;
    }
    jpNewsList.innerHTML = "";
    news.forEach(article => {
        const li = document.createElement("li");
        li.innerHTML = `
            <a href="${article.link}" target="_blank" class="article-title" style="margin-bottom: 4px; text-decoration: none;">🗼 ${article.title}</a>
            <span class="date">${article.published}</span>
        `;
        jpNewsList.appendChild(li);
    });
}

// --- LOGIC CHUYỂN TAB ---
function openTab(evt, tabName) {
    const tabContents = document.getElementsByClassName("tab-content");
    for (let i = 0; i < tabContents.length; i++) {
        tabContents[i].style.display = "none";
    }

    const navBtns = document.getElementsByClassName("nav-btn");
    for (let i = 0; i < navBtns.length; i++) {
        navBtns[i].className = navBtns[i].className.replace(" active", "");
    }

    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}
