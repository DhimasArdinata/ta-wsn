document.addEventListener("DOMContentLoaded", () => {
  // --- Tab Logic ---
  function setupTabs() {
    const tabContainers = document.querySelectorAll(".tabs");
    tabContainers.forEach((container) => {
      const tabButtons = container.querySelectorAll(".tab-button");
      const tabContents =
        container.parentElement.querySelectorAll(".tab-content");

      tabButtons.forEach((button) => {
        button.addEventListener("click", () => {
          tabButtons.forEach((btn) => btn.classList.remove("active"));
          button.classList.add("active");
          tabContents.forEach((content) => {
            content.classList.remove("active");
            if (content.id === button.dataset.tab) {
              content.classList.add("active");
            }
          });
        });
      });
    });
  }

  // --- Interactive Diagram Logic ---
  function setupDiagram() {
    const diagramContainer = document.querySelector(".diagram-container");
    const infoPanel = document.getElementById("info-panel");

    const svgContent = `
            <svg id="system-diagram" viewBox="0 0 450 220">
                <defs><marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#333"/></marker></defs>
                <path d="M 105 110 C 130 110, 130 110, 155 110" stroke="#333" stroke-width="1.5" stroke-dasharray="5,5" marker-end="url(#arrow)"/>
                <path d="M 295 110 C 320 110, 320 110, 345 110" stroke="#333" stroke-width="2" marker-end="url(#arrow)"/>
                <path d="M 295 120 C 320 120, 320 120, 345 120" stroke="#333" stroke-width="2" marker-start="url(#arrow)"/>
                <path d="M 225 85 C 225 60, 225 60, 225 35" stroke="#c62828" stroke-width="2" stroke-dasharray="3,3" marker-end="url(#arrow)"/>
                <text x="115" y="100" class="sub-label">Data Sensor (WiFi)</text><text x="300" y="100" class="sub-label">Komunikasi API (HTTPS)</text><text x="230" y="60" class="sub-label">Sinyal Kontrol</text>
                <g class="component" data-info="node"><rect x="20" y="80" width="85" height="60" fill="#26a69a" rx="8"/><text x="62.5" y="110" class="label" fill="white">SENSOR</text><text x="62.5" y="122" class="label" fill="white">NODE</text><text x="35" y="98" font-size="12px">🌡️</text></g>
                <g class="component" data-info="gateway"><rect x="155" y="75" width="140" height="70" fill="#00796b" rx="8"/><text x="225" y="110" class="label" fill="white">GATEWAY</text><text x="170" y="95" font-size="12px">🧠</text><text x="170" y="130" font-size="12px">📶 GPRS</text></g>
                <g class="component" data-info="cloud"><path d="M 350 115 C 340 95, 370 85, 380 95 C 400 95, 410 110, 400 125 C 400 140, 370 145, 360 135 C 345 135, 340 125, 350 115" fill="#1976d2"/><text x="380" y="118" class="label" fill="white">CLOUD / API</text></g>
                <g class="component" data-info="actuator"><rect x="200" y="10" width="50" height="25" fill="#ffb300" rx="5"/><text x="225" y="27" class="label" fill="#333">AKTUATOR</text></g>
            </svg>`;
    diagramContainer.innerHTML = svgContent;

    const componentInfo = {
      node: {
        title: "Sensor Node",
        text: "Perangkat ini bertugas mengukur suhu, kelembaban, dan cahaya. Ia memiliki fitur cache canggih untuk menyimpan data jika koneksi WiFi terputus, memastikan tidak ada data yang hilang.",
      },
      gateway: {
        title: "Gateway",
        text: "Ini adalah otak dari sistem. Ia menerima data, membuat keputusan, dan mengontrol aktuator. Memiliki koneksi ganda (WiFi + Seluler) untuk keandalan maksimal dan layar LCD untuk pemantauan.",
      },
      cloud: {
        title: "Cloud / Server API",
        text: "Server pusat yang menerima dan menyimpan semua data dari Sensor Node. Gateway juga mengambil data ambang batas dan status override manual dari sini.",
      },
      actuator: {
        title: "Aktuator",
        text: "Ini adalah perangkat fisik di greenhouse, seperti kipas exhaust, blower, atau dehumidifier. Gateway mengontrol perangkat ini melalui Relay.",
      },
    };
    document.querySelectorAll("#system-diagram .component").forEach((c) => {
      c.addEventListener("click", () => {
        infoPanel.innerHTML = `<h3>${info.title}</h3><p>${info.text}</p>`;
      });
    });
  }

  // --- General Simulation Runner ---
  function runSimulation(containerId, steps, button, isTerminal = false) {
    button.disabled = true;
    const container = document.getElementById(containerId);
    container.innerHTML = "";
    let delay = 0;
    steps.forEach((step, index) => {
      setTimeout(() => {
        const el = document.createElement(isTerminal ? "p" : "div");
        if (isTerminal) {
          el.className = step.class || "";
          el.innerHTML = step.text;
        } else {
          el.className = "flow-item";
          el.innerHTML = step.icon
            ? `<div class="flow-icon">${step.icon}</div><div>${step.text}</div>`
            : step.text;
        }
        container.appendChild(el);
        if (!isTerminal) {
          void el.offsetWidth;
          el.classList.add("visible");
        }
        container.scrollTop = container.scrollHeight;
        if (index === steps.length - 1) {
          button.disabled = false;
        }
      }, delay);
      delay += step.delay || 1200;
    });
  }

  // --- Portal Simulation Logic ---
  function runCaptivePortalSimulation(button) {
    button.disabled = true;
    const captiveScreen = document.getElementById("captive-portal-screen");
    let step = 0;
    const steps = [
      () => {
        captiveScreen.innerHTML = `<p style="font-weight:bold; text-align:center;">Pengaturan WiFi</p><hr><p>Pilih jaringan:</p><p style="color:var(--secondary-color)">&#10003; <b>Gateway-Config-1</b> (Terhubung)</p><p>&#9921; Tetangga_WiFi</p><p style="font-style:italic; text-align:center; margin-top: 20px;">Menunggu login jaringan...<br/>Halaman akan muncul otomatis.</p>`;
      },
      () => {
        captiveScreen.innerHTML = `<div class="portal-form"><h3>Konfigurasi Gateway</h3><p>Masukkan kredensial WiFi Anda.</p><label>WiFi SSID:</label><input type="text" value="GH Atas"><label>Password:</label><input type="password" value="•••••••••"><button>Simpan & Hubungkan</button></div>`;
      },
      () => {
        captiveScreen.innerHTML = `<div style="text-align:center; padding-top: 50px;"><h3>Menghubungkan...</h3><p>Mencoba terhubung ke 'GH Atas'. Mohon tunggu...</p></div>`;
      },
      () => {
        captiveScreen.innerHTML = `<div style="text-align:center; color: var(--success-color); padding-top: 50px;"><h3>Berhasil! ✅</h3><p>Gateway terhubung. Perangkat akan reboot dalam 3 detik...</p></div>`;
      },
      () => {
        button.disabled = false;
        captiveScreen.innerHTML = `<p>Klik tombol simulasi untuk memulai...</p>`;
      },
    ];

    function nextStep() {
      if (step < steps.length) {
        steps[step]();
        step++;
        setTimeout(nextStep, 2500);
      }
    }
    nextStep();
  }

  function runOtaSimulation(button) {
    button.disabled = true;
    const otaScreen = document.getElementById("ota-portal-content");
    otaScreen.innerHTML = `<h3>Firmware Web Updater</h3><p>Pilih file <code>.bin</code> untuk diunggah.</p><input type="text" readonly value="firmware-v3.2.1.bin" style="width: 70%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; background: #f9f9f9;"><button style="margin-left: 10px; padding: 8px 15px; background: var(--secondary-color); color: white; border:none; border-radius: 4px; cursor: pointer;">Upload</button><div class="progress-bar"><div id="ota-progress" class="progress-bar-fill"></div></div><p id="ota-status" style="text-align:center; font-weight: bold; margin-top: 10px;"></p>`;

    setTimeout(() => {
      const progressBar = document.getElementById("ota-progress");
      const statusText = document.getElementById("ota-status");
      statusText.innerText = "Mengunggah...";
      progressBar.style.width = "100%";
      progressBar.innerText = "100%";

      setTimeout(() => {
        statusText.style.color = "var(--success-color)";
        statusText.innerText = "Update Berhasil! Perangkat sedang reboot...";
        setTimeout(() => {
          otaScreen.innerHTML = `<p>Klik tombol simulasi untuk memulai...</p>`;
          button.disabled = false;
        }, 3000);
      }, 2200);
    }, 500);
  }

  // --- Simulation Steps Data ---
  const nodeSimSteps = [
    { icon: "🌡️", text: "Sensor Node membaca data suhu dan kelembaban." },
    { icon: "📝", text: "Data diformat menjadi sebuah paket JSON." },
    { icon: "📶", text: "Mencoba mengirim data via WiFi..." },
    {
      icon: "✅",
      text: "Koneksi WiFi berhasil! Data dikirim ke Server Cloud.",
    },
    { icon: "---", text: "--- Siklus berikutnya ---", delay: 1500 },
    { icon: "🌡️", text: "Sensor Node membaca data baru." },
    {
      icon: "❌",
      text: "<strong>Koneksi WiFi terputus!</strong> Pengiriman gagal.",
    },
    {
      icon: "📦",
      text: "<strong>Fitur Caching Aktif!</strong> Data disimpan ke dalam <em>Binary Ring Buffer</em> di memori internal Node.",
    },
    {
      icon: "🔄",
      text: "Node terus mencoba menyambung kembali ke WiFi sambil tetap menyimpan data baru ke cache...",
    },
    { icon: "✅", text: "<strong>Koneksi WiFi pulih!</strong>" },
    {
      icon: "📤",
      text: "Node mulai mengunggah semua data dari cache, dari yang terlama hingga terbaru.",
    },
    {
      icon: "💯",
      text: "Semua data berhasil terkirim. <strong>Tidak ada data yang hilang!</strong> Sistem kembali normal.",
    },
  ];
  const gatewaySimSteps = [
    {
      icon: "📡",
      text: "Gateway boot up, mencoba koneksi ke WiFi prioritas...",
    },
    {
      icon: "❌",
      text: "<strong>Koneksi WiFi gagal!</strong> Router mungkin mati.",
    },
    {
      icon: "📲",
      text: "<strong>Fitur Redundansi Aktif!</strong> Beralih ke koneksi cadangan GPRS (seluler)...",
    },
    { icon: "✅", text: "Koneksi GPRS berhasil. Gateway sekarang online." },
    {
      icon: "📥",
      text: "Gateway mengambil data ambang batas (Thresholds) dari Cloud API. Misal: Suhu Maks = 30°C.",
    },
    {
      icon: "📥",
      text: "Gateway mengambil data sensor terakhir dari Cloud API. Misal: Suhu saat ini = 32°C.",
    },
    {
      icon: "🧠",
      text: "<strong>Logika Kontrol Bekerja:</strong> Membandingkan data. <code>(32°C > 30°C)</code> bernilai BENAR.",
    },
    {
      icon: "💡",
      text: "<strong>Keputusan Dibuat:</strong> Perlu menyalakan kipas pendingin (Aktuator).",
    },
    { icon: "⚡", text: "Gateway mengirim sinyal listrik ke Relay Kipas." },
    {
      icon: "💨",
      text: "Relay menyala, Aktuator (Kipas) berputar, suhu mulai turun.",
    },
    {
      icon: "📤",
      text: "Gateway melaporkan status barunya (Relay Kipas: ON) ke Cloud API.",
    },
  ];
  const nodeTerminalSimSteps = [
    { class: "sys", text: "[SYSTEM] Greenhouse Node Terminal Connected." },
    {
      class: "",
      text: '<span class="prompt">> </span><span class="cmd">login rahasia123</span>',
      delay: 1500,
    },
    {
      class: "ok",
      text: "[AUTH] Login successful. Admin commands are enabled.",
    },
    {
      class: "",
      text: '<span class="prompt">> </span><span class="cmd">cache_status</span>',
      delay: 2000,
    },
    { class: "", text: "--- Cache Status (Binary Ring Buffer) ---" },
    { class: "", text: "Queued Data: 1450 bytes" },
    { class: "", text: "Head Pointer: 8730 | Tail Pointer: 7280" },
    {
      class: "",
      text: '<span class="prompt">> </span><span class="cmd">getconfig</span>',
      delay: 2500,
    },
    { class: "", text: "--- Active Configuration ---" },
    { class: "", text: "Data URL: https://atomic.web.id/api/sensor" },
    { class: "", text: "Data Upload Interval: 600000 ms" },
    {
      class: "err",
      text: "[ERROR] Access Denied. Please 'login <password>' first.",
      delay: 3000,
    },
    {
      class: "",
      text: '<span class="prompt">> </span><span class="cmd">status</span>',
    },
  ];
  const gatewayTerminalSimSteps = [
    { class: "sys", text: "[System] Connected to ESP32!" },
    {
      class: "",
      text: '<span class="prompt">> </span><span class="cmd">status</span>',
      delay: 1500,
    },
    { class: "sys", text: "[RX] --- System Status ---" },
    { class: "sys", text: "[RX] Firmware: 3.2.0, GH_ID: 1" },
    { class: "sys", text: "[RX] GPRS Connected: Yes, Signal: 25" },
    { class: "sys", text: "[RX] Relays (Exh,Deh,Blw): ON, OFF, ON" },
    {
      class: "",
      text: '<span class="prompt">> </span><span class="cmd">override exhaust off</span>',
      delay: 2500,
    },
    {
      class: "sys",
      text: "[RX] Manual override set for Relay Exhaust to OFF for 30 seconds.",
    },
    { class: "sys", text: "[RX] Relay 1 -> OFF (MANUAL)", delay: 1000 },
    {
      class: "sys",
      text: "[RX] Manual override for Relay Exhaust expired. Returning to auto mode.",
      delay: 30000,
    },
    { class: "sys", text: "[RX] Relay 1 -> ON (AUTO)" },
  ];

  // --- Initializations and Event Listeners ---
  setupTabs();
  setupDiagram();
  document
    .getElementById("start-node-simulation")
    .addEventListener("click", (e) =>
      runSimulation("node-flow-container", nodeSimSteps, e.target)
    );
  document
    .getElementById("start-gateway-simulation")
    .addEventListener("click", (e) =>
      runSimulation("gateway-flow-container", gatewaySimSteps, e.target)
    );
  document
    .getElementById("start-node-terminal-sim")
    .addEventListener("click", (e) =>
      runSimulation(
        "node-terminal-screen",
        nodeTerminalSimSteps,
        e.target,
        true
      )
    );
  document
    .getElementById("start-gateway-terminal-sim")
    .addEventListener("click", (e) =>
      runSimulation(
        "gateway-terminal-screen",
        gatewayTerminalSimSteps,
        e.target,
        true
      )
    );
  document
    .getElementById("start-captive-sim")
    .addEventListener("click", (e) => runCaptivePortalSimulation(e.target));
  document
    .getElementById("start-ota-sim")
    .addEventListener("click", (e) => runOtaSimulation(e.target));
});
