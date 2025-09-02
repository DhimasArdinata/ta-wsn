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
            <svg id="system-diagram" viewBox="0 0 450 240" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 0 L 10 5 L 0 10 z" fill="#475569"/>
                    </marker>
                    <!-- Definisikan filter untuk bayangan halus -->
                    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur"/>
                        <feOffset in="blur" dx="2" dy="2" result="offsetBlur"/>
                        <feMerge>
                            <feMergeNode in="offsetBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                    <style>
                        .diag-sublabel { font: 600 8px var(--font-sans); fill: #334155; text-anchor: middle; }
                        .main-label { font: 700 11px var(--font-sans); fill: white; text-anchor: middle; }
                        .icon-label { font: 400 14px sans-serif; text-anchor: middle; }
                        .detail-label { font: 600 7px var(--font-sans); fill: #e2e8f0; text-anchor: middle; }
                    </style>
                </defs>

                <!-- Garis Koneksi -->
                <path d="M 105 120 C 130 120, 130 120, 155 120" stroke="#475569" stroke-width="1.5" stroke-dasharray="5,5" marker-end="url(#arrow)"/>
                <path d="M 295 120 C 320 120, 320 120, 345 120" stroke="#475569" stroke-width="2" marker-end="url(#arrow)"/>
                <path d="M 295 130 C 320 130, 320 130, 345 130" stroke="#475569" stroke-width="2" marker-start="url(#arrow)"/>
                <path d="M 225 90 C 225 70, 225 70, 225 50" stroke="#dc2626" stroke-width="2" stroke-dasharray="3,3" marker-end="url(#arrow)"/>
                
                <!-- Label Koneksi -->
                <text x="130" y="110" class="diag-sublabel">Data Sensor (WiFi)</text>
                <text x="320" y="110" class="diag-sublabel">Komunikasi API</text>
                <text x="320" y="142" class="diag-sublabel">(HTTPS)</text>
                <text x="225" y="65" class="diag-sublabel">Sinyal Kontrol</text>

                <!-- Komponen Sensor Node -->
                <g class="component" data-info="node">
                    <rect x="20" y="90" width="85" height="60" fill="#26a69a" rx="8" filter="url(#shadow)"/>
                    <text y="115" class="icon-label">
                        <tspan x="62.5">🌡️</tspan>
                    </text>
                    <text y="130" class="main-label">
                        <tspan x="62.5">SENSOR NODE</tspan>
                    </text>
                </g>

                <!-- Komponen Gateway -->
                <g class="component" data-info="gateway">
                    <rect x="155" y="85" width="140" height="70" fill="#00796b" rx="8" filter="url(#shadow)"/>
                     <text y="105" class="icon-label">
                        <tspan x="225">🧠</tspan>
                    </text>
                    <text y="122" class="main-label">
                        <tspan x="225">GATEWAY</tspan>
                    </text>
                    <text y="135" class="detail-label">
                        <tspan x="225">📶 WiFi + GPRS</tspan>
                    </text>
                </g>

                <!-- Komponen Cloud -->
                <g class="component" data-info="cloud">
                    <path d="M 350 125 C 340 105, 370 95, 380 105 C 400 105, 410 120, 400 135 C 400 150, 370 155, 360 145 C 345 145, 340 135, 350 125" fill="#3b82f6" filter="url(#shadow)"/>
                    <text y="120" class="icon-label">
                        <tspan x="375">☁️</tspan>
                    </text>
                    <text y="135" class="main-label">
                        <tspan x="375">CLOUD / API</tspan>
                    </text>
                </g>

                <!-- Komponen Aktuator -->
                <g class="component" data-info="actuator">
                    <rect x="200" y="25" width="50" height="25" fill="#f59e0b" rx="5" filter="url(#shadow)"/>
                    <text y="41" class="main-label" fill="#1c1917" font-size="8px">
                        <tspan x="225">AKTUATOR</tspan>
                    </text>
                </g>
            </svg>
        `;
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

    function typeCommand(pElement, command, onComplete) {
      let i = 0;
      const typingInterval = 50;
      function typeChar() {
        if (i < command.length) {
          pElement.innerHTML += command.charAt(i);
          i++;
          setTimeout(typeChar, typingInterval);
        } else {
          onComplete();
        }
      }
      typeChar();
    }

    steps.forEach((step, index) => {
      delay += step.delayBefore || 0;
      setTimeout(() => {
        if (isTerminal) {
          const p = document.createElement("p");
          p.className = step.class || "";
          container.appendChild(p);

          if (step.command) {
            const prompt = document.createElement("span");
            prompt.className = "prompt";
            prompt.innerText = "> ";
            p.appendChild(prompt);

            const cmdSpan = document.createElement("span");
            cmdSpan.className = "cmd";
            p.appendChild(cmdSpan);

            typeCommand(cmdSpan, step.command, () => {
              container.scrollTop = container.scrollHeight;
            });
          } else {
            p.innerHTML = step.text;
          }
        } else {
          const div = document.createElement("div");
          div.className = "flow-item";
          div.innerHTML = step.icon
            ? `<div class="flow-icon">${step.icon}</div><div>${step.text}</div>`
            : step.text;
          container.appendChild(div);
          void div.offsetWidth;
          div.classList.add("visible");
        }

        container.scrollTop = container.scrollHeight;
        if (index === steps.length - 1) {
          button.disabled = false;
        }
      }, delay);
      delay += step.delayAfter || 1200;
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
    { icon: "---", text: "--- Siklus berikutnya ---", delayAfter: 1500 },
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

  // --- *** ULTIMATE TERMINAL SIMULATION STEPS V2 *** ---
  const nodeTerminalSimSteps = [
    {
      class: "sys",
      text: "[SYSTEM] Greenhouse Node Terminal Connected.",
      delayAfter: 500,
    },
    { command: "help", delayBefore: 1000, delayAfter: 1500 },
    {
      class: "",
      text: "--- Available Commands ---<br>Public Commands:<br>&nbsp;&nbsp;help&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- (Description for help)<br>&nbsp;&nbsp;login&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- (Description for login)<br>&nbsp;&nbsp;status&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- (Description for status)<br>Type 'login &lt;password&gt;' to access Admin Commands.",
    },
    { command: "login rahasia123", delayBefore: 2000, delayAfter: 1500 },
    {
      class: "ok",
      text: "[AUTH] Login successful. Admin commands are enabled.",
    },
    { command: "help", delayBefore: 1000, delayAfter: 2000 },
    {
      class: "",
      text: "--- Available Commands ---<br>Public Commands:<br>&nbsp;&nbsp;... (sama seperti sebelumnya)<br>Admin Commands (Authenticated):<br>&nbsp;&nbsp;getconfig&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- (Description for getconfig)<br>&nbsp;&nbsp;setconfig&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- (Description for setconfig)<br>&nbsp;&nbsp;clearcache&nbsp;&nbsp;&nbsp;&nbsp; - (Description for clearcache)<br>&nbsp;&nbsp;factory_reset - (Description for factory_reset)<br>&nbsp;&nbsp;reboot&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;- (Description for reboot)",
    },
    { command: "cache_status", delayBefore: 2000, delayAfter: 1500 },
    {
      class: "",
      text: "--- Cache Status (Binary Ring Buffer) ---<br>Queued Data: 98230 bytes<br>Head Pointer: 54321 | Tail Pointer: 56091",
    },
    { command: "reboot", delayBefore: 3000, delayAfter: 1500 },
    { class: "sys", text: "Rebooting..." },
  ];
  const gatewayTerminalSimSteps = [
    { class: "sys", text: "[System] Connected to ESP32!", delayAfter: 500 },
    { command: "status", delayBefore: 1000, delayAfter: 1500 },
    {
      class: "sys",
      text: "[RX] --- System Status ---<br>[RX] Firmware: 3.2.0, GH_ID: 1<br>[RX] GPRS Connected: Yes, Signal: 25<br>[RX] Time: 2024-05-21 14:30:15<br>[RX] Temp: 31.2C, Hum: 85%, Light: 12000<br>[RX] Relays (Exh,Deh,Blw): ON, OFF, ON",
    },
    { command: "reboot salah_pass", delayBefore: 2000, delayAfter: 1500 },
    {
      class: "err",
      text: "[RX] Error: Incorrect password. Usage: reboot &lt;password&gt;",
    },
    { command: "reboot medini123", delayBefore: 2000, delayAfter: 1500 },
    { class: "sys", text: "[RX] Rebooting gateway by command..." },
    {
      class: "sys",
      text: "[System] Connection lost. Retrying...",
      delayAfter: 1500,
    },
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
