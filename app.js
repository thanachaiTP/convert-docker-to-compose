document.addEventListener('DOMContentLoaded', () => {
    const runInput = document.getElementById('dockerRunInput');
    const composeOutput = document.getElementById('composeOutput');
    const copyBtn = document.getElementById('copyBtn');
    const copyText = document.getElementById('copyText');

    // Options UI Control
    const enableLogLimit = document.getElementById('enableLogLimit');
    const logOptions = document.getElementById('logOptions');
    const logMaxSizeVal = document.getElementById('logMaxSizeVal');
    const logMaxSizeUnit = document.getElementById('logMaxSizeUnit');
    const logMaxFile = document.getElementById('logMaxFile');

    const enableResourceLimit = document.getElementById('enableResourceLimit');
    const resourceOptions = document.getElementById('resourceOptions');
    
    // Limits inputs
    const cpuLimit = document.getElementById('cpuLimit');
    const memLimitVal = document.getElementById('memLimitVal');
    const memLimitUnit = document.getElementById('memLimitUnit');
    
    // Reservations inputs
    const cpuReserve = document.getElementById('cpuReserve');
    const memReserveVal = document.getElementById('memReserveVal');
    const memReserveUnit = document.getElementById('memReserveUnit');

    // Toggle log section
    enableLogLimit.addEventListener('change', (e) => {
        logOptions.style.opacity = e.target.checked ? '1' : '0.5';
        logOptions.style.pointerEvents = e.target.checked ? 'auto' : 'none';
        generateCompose();
    });

    // Toggle resource section
    enableResourceLimit.addEventListener('change', (e) => {
        resourceOptions.style.opacity = e.target.checked ? '1' : '0.5';
        resourceOptions.style.pointerEvents = e.target.checked ? 'auto' : 'none';
        generateCompose();
    });

    // Add listeners to all inputs & dropdowns for instant reactivity
    const allInputs = [
        runInput, logMaxSizeVal, logMaxSizeUnit, logMaxFile,
        cpuLimit, memLimitVal, memLimitUnit,
        cpuReserve, memReserveVal, memReserveUnit
    ];
    
    allInputs.forEach(el => {
        el.addEventListener('input', generateCompose);
        el.addEventListener('change', generateCompose);
    });

    function generateCompose() {
        const rawInput = runInput.value.trim();
        if (!rawInput) {
            composeOutput.textContent = "# ผลลัพธ์จะแสดงที่นี่...";
            return;
        }

        const cleanInput = rawInput.replace(/\\\n/g, ' ').replace(/\s+/g, ' ');
        
        if (!cleanInput.startsWith('docker run')) {
            composeOutput.textContent = "# Error: คำสั่งต้องเริ่มต้นด้วย 'docker run'";
            return;
        }

        // Extracting elements
        const nameMatch = cleanInput.match(/--name\s+([^\s]+)/);
        const serviceName = nameMatch ? nameMatch[1] : 'web_service';
        
        const portMatches = [...cleanInput.matchAll(/(?:-p|--publish)\s+([^\s]+)/g)];
        const ports = portMatches.map(m => m[1]);

        const envMatches = [...cleanInput.matchAll(/(?:-e|--env)\s+([^\s]+)/g)];
        const envs = envMatches.map(m => m[1]);

        const volMatches = [...cleanInput.matchAll(/(?:-v|--volume)\s+([^\s]+)/g)];
        const volumes = volMatches.map(m => m[1]);

        let words = cleanInput.split(' ');
        let image = 'nginx:latest';
        
        for (let i = words.length - 1; i >= 0; i--) {
            if (words[i] && !words[i].startsWith('-') && i > 1 && !words[i-1].startsWith('-')) {
                image = words[i];
                break;
            }
        }

        // --- Generate YAML ---
        let yaml = `version: "3.8"\n\nservices:\n  ${serviceName}:\n    image: ${image}\n`;

        if (cleanInput.includes('--restart')) {
            const restartMatch = cleanInput.match(/--restart\s+([^\s]+)/);
            if (restartMatch) yaml += `    restart: ${restartMatch[1]}\n`;
        } else {
            yaml += `    restart: always\n`;
        }

        if (ports.length > 0) {
            yaml += `    ports:\n`;
            ports.forEach(p => { yaml += `      - "${p}"\n`; });
        }

        if (envs.length > 0) {
            yaml += `    environment:\n`;
            envs.forEach(e => { yaml += `      - ${e}\n`; });
        }

        if (volumes.length > 0) {
            yaml += `    volumes:\n`;
            volumes.forEach(v => { yaml += `      - ${v}\n`; });
        }

        // Feature 1: Logging Limit with Unit selection
        if (enableLogLimit.checked) {
            const sizeVal = logMaxSizeVal.value || '10';
            const sizeUnit = logMaxSizeUnit.value; // 'm' or 'g'
            yaml += `    logging:\n`;
            yaml += `      driver: "json-file"\n`;
            yaml += `      options:\n`;
            yaml += `        max-size: "${sizeVal}${sizeUnit}"\n`;
            yaml += `        max-file: "${logMaxFile.value || '3'}"\n`;
        }

        // Feature 2: Resource Management (Limits & Reservations)
        if (enableResourceLimit.checked) {
            let hasLimits = cpuLimit.value || memLimitVal.value;
            let hasReserves = cpuReserve.value || memReserveVal.value;

            if (hasLimits || hasReserves) {
                yaml += `    deploy:\n`;
                yaml += `      resources:\n`;

                // Limits block
                if (hasLimits) {
                    yaml += `        limits:\n`;
                    if (cpuLimit.value) {
                        yaml += `          cpus: '${cpuLimit.value}'\n`;
                    }
                    if (memLimitVal.value) {
                        yaml += `          memory: ${memLimitVal.value}${memLimitUnit.value}\n`;
                    }
                }

                // Reservations block
                if (hasReserves) {
                    yaml += `        reservations:\n`;
                    if (cpuReserve.value) {
                        yaml += `          cpus: '${cpuReserve.value}'\n`;
                    }
                    if (memReserveVal.value) {
                        yaml += `          memory: ${memReserveVal.value}${memReserveUnit.value}\n`;
                    }
                }
            }
        }

        composeOutput.textContent = yaml;
    }

    // Copy to clipboard function
    copyBtn.addEventListener('click', () => {
        const textToCopy = composeOutput.textContent;
        if (textToCopy && !textToCopy.startsWith('#')) {
            navigator.clipboard.writeText(textToCopy).then(() => {
                copyText.textContent = 'Copied!';
                setTimeout(() => { copyText.textContent = 'Copy'; }, 2000);
            });
        }
    });
});
