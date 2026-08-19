/* ==========================================
   Efeitos Visuais 3D, Fundo Animado com Física, Desenho com Lápis e Luz Dinâmica
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ------------------------------------------
    // 1. Sistema 1: Embaralhar Letras (Mantendo 1ª Maiúscula)
    // ------------------------------------------
    let isTextScrambled = false;

    function scrambleWord(word) {
        if (word.length <= 1) return word;

        const isFirstUpper = /^[A-ZÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ]/.test(word);
        const isAllUpper = word === word.toUpperCase() && word.length > 1;

        let letters = word.toLowerCase().split('');

        for (let i = letters.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [letters[i], letters[j]] = [letters[j], letters[i]];
        }

        if (isAllUpper) {
            return letters.join('').toUpperCase();
        } else if (isFirstUpper) {
            return letters[0].toUpperCase() + letters.slice(1).join('');
        } else {
            return letters.join('');
        }
    }

    function scrambleString(str) {
        return str.replace(/[a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ]+/g, (word) => scrambleWord(word));
    }

    function toggleTextScramble() {
        const textNodes = [];

        function collectTextNodes(node) {
            if (node.nodeType === Node.TEXT_NODE) {
                if (node.textContent.trim().length > 0) {
                    textNodes.push(node);
                }
            } else {
                if (node.nodeName !== 'SCRIPT' && node.nodeName !== 'STYLE' && node.nodeName !== 'NOSCRIPT' && !node.classList?.contains('light-switch-wrapper') && !node.classList?.contains('dice-btn-wrapper') && !node.classList?.contains('speed-btn-wrapper') && !node.classList?.contains('direction-btn-wrapper') && !node.classList?.contains('voxel-btn-wrapper')) {
                    for (let child of node.childNodes) {
                        collectTextNodes(child);
                    }
                }
            }
        }

        const mainContainer = document.querySelector('main') || document.body;
        collectTextNodes(mainContainer);

        if (!isTextScrambled) {
            textNodes.forEach(node => {
                if (!node._originalText) {
                    node._originalText = node.textContent;
                }
                node.textContent = scrambleString(node._originalText);
            });
            isTextScrambled = true;
        } else {
            textNodes.forEach(node => {
                if (node._originalText) {
                    node.textContent = node._originalText;
                }
            });
            isTextScrambled = false;
        }
    }

    // ------------------------------------------
    // 2. Sistema 2: Embaralhar Cores em #HEX Total (Fundo, Cards, Footer, Textos, Tudo!)
    // ------------------------------------------
    let isColorRandomized = false;
    let colorModifiedElements = [];

    function getRandomHexColor() {
        return '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0');
    }

    function toggleColorRandomizer() {
        if (!isColorRandomized) {
            colorModifiedElements = [];
            const selector = 'body, header, nav, footer, main, .container-main, h1, h2, h3, h4, h5, p, span, a, i, button, td, th, tr, label, .dashboard-card, .floating-notebook, .btn, .card, .navbar, table, .footer-content-right';
            const elements = document.querySelectorAll(selector);

            elements.forEach(el => {
                if (el.classList.contains('light-switch-wrapper') || el.classList.contains('dice-btn-wrapper') || el.classList.contains('speed-btn-wrapper') || el.classList.contains('direction-btn-wrapper') || el.classList.contains('voxel-btn-wrapper') || el.closest('.light-switch-wrapper') || el.closest('.dice-btn-wrapper') || el.closest('.speed-btn-wrapper') || el.closest('.direction-btn-wrapper') || el.closest('.voxel-btn-wrapper')) return;

                if (!el._origStyle) {
                    el._origStyle = {
                        color: el.style.color || '',
                        background: el.style.background || '',
                        backgroundColor: el.style.backgroundColor || '',
                        borderColor: el.style.borderColor || '',
                        filter: el.style.filter || '',
                        boxShadow: el.style.boxShadow || ''
                    };
                }

                colorModifiedElements.push(el);

                const hex1 = getRandomHexColor();
                const hex2 = getRandomHexColor();
                const hex3 = getRandomHexColor();

                if (el.tagName === 'BODY' || el.tagName === 'MAIN' || el.classList.contains('container-main')) {
                    el.style.setProperty('background', hex1, 'important');
                    el.style.setProperty('background-color', hex1, 'important');
                } else if (el.tagName === 'FOOTER' || el.tagName === 'HEADER' || el.tagName === 'NAV' || el.classList.contains('navbar')) {
                    el.style.setProperty('background', hex1, 'important');
                    el.style.setProperty('background-color', hex1, 'important');
                    el.style.setProperty('border-color', hex2, 'important');
                } else if (el.classList.contains('dashboard-card')) {
                    el.style.setProperty('background', hex1, 'important');
                    el.style.setProperty('background-color', hex1, 'important');
                    el.style.setProperty('border-color', hex2, 'important');
                    el.style.setProperty('box-shadow', `0 12px 30px ${hex2}`, 'important');
                } else if (el.classList.contains('floating-notebook')) {
                    el.style.setProperty('color', hex1, 'important');
                    el.style.setProperty('filter', `drop-shadow(0 0 14px ${hex1})`, 'important');
                } else if (['H1', 'H2', 'H3', 'H4', 'H5', 'P', 'SPAN', 'A', 'LABEL', 'I'].includes(el.tagName)) {
                    el.style.setProperty('color', hex1, 'important');
                } else if (el.tagName === 'BUTTON' || el.classList.contains('btn')) {
                    el.style.setProperty('background', hex1, 'important');
                    el.style.setProperty('background-color', hex1, 'important');
                    el.style.setProperty('border-color', hex2, 'important');
                    el.style.setProperty('color', hex3, 'important');
                } else if (el.tagName === 'TD' || el.tagName === 'TH' || el.tagName === 'TABLE') {
                    el.style.setProperty('background-color', hex1, 'important');
                    el.style.setProperty('color', hex2, 'important');
                    el.style.setProperty('border-color', hex3, 'important');
                }
            });

            isColorRandomized = true;
        } else {
            colorModifiedElements.forEach(el => {
                if (el._origStyle) {
                    el.style.color = el._origStyle.color;
                    el.style.background = el._origStyle.background;
                    el.style.backgroundColor = el._origStyle.backgroundColor;
                    el.style.borderColor = el._origStyle.borderColor;
                    el.style.filter = el._origStyle.filter;
                    el.style.boxShadow = el._origStyle.boxShadow;
                }
            });
            isColorRandomized = false;
        }
    }

    // ------------------------------------------
    // 3. Sistema 3: Desenhar no Fundo com o Ícone de Lápis (Temporário e Virando Pó)
    // ------------------------------------------
    let drawingCanvas = null;
    let drawingCtx = null;
    let isDrawingWithPencil = false;
    let lastPencilPos = { x: 0, y: 0 };
    let pencilStrokes = [];
    let pencilDustParticles = [];
    let isCanvasLoopRunning = false;

    function initDrawingCanvas() {
        if (drawingCanvas) return;
        drawingCanvas = document.createElement('canvas');
        drawingCanvas.id = 'bg-drawing-canvas';
        drawingCanvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            pointer-events: none;
            z-index: 10;
        `;
        document.body.prepend(drawingCanvas);

        function resizeCanvas() {
            drawingCanvas.width = window.innerWidth;
            drawingCanvas.height = window.innerHeight;
        }
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        drawingCtx = drawingCanvas.getContext('2d');
    }

    function startCanvasAnimationLoop() {
        if (!isCanvasLoopRunning) {
            isCanvasLoopRunning = true;
            requestAnimationFrame(updateCanvasFrame);
        }
    }

    function drawLineSegment(x1, y1, x2, y2, color) {
        initDrawingCanvas();
        const strokeColor = color || '#38bdf8';

        pencilStrokes.push({
            x1, y1, x2, y2,
            color: strokeColor,
            maxLife: 60,
            life: 60,
            width: 5
        });

        for (let i = 0; i < 3; i++) {
            pencilDustParticles.push({
                x: x2 + (Math.random() - 0.5) * 8,
                y: y2 + (Math.random() - 0.5) * 8,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2 - 0.5,
                size: Math.random() * 3 + 1,
                color: strokeColor,
                alpha: 1.0,
                decay: 0.02 + Math.random() * 0.025
            });
        }

        startCanvasAnimationLoop();
    }

    function updateCanvasFrame() {
        if (!drawingCtx || !drawingCanvas) {
            isCanvasLoopRunning = false;
            return;
        }

        drawingCtx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
        let activeItems = false;

        for (let i = pencilStrokes.length - 1; i >= 0; i--) {
            const stroke = pencilStrokes[i];
            stroke.life -= 1;
            const alpha = Math.max(0, stroke.life / stroke.maxLife);

            if (alpha <= 0) {
                pencilStrokes.splice(i, 1);
                continue;
            }

            activeItems = true;

            if (stroke.life < stroke.maxLife * 0.6 && Math.random() < 0.25) {
                const r = Math.random();
                const px = stroke.x1 + (stroke.x2 - stroke.x1) * r;
                const py = stroke.y1 + (stroke.y2 - stroke.y1) * r;
                pencilDustParticles.push({
                    x: px,
                    y: py,
                    vx: (Math.random() - 0.5) * 1.5,
                    vy: (Math.random() - 0.5) * 1.5 - 0.3,
                    size: Math.random() * 2.5 + 1,
                    color: stroke.color,
                    alpha: alpha,
                    decay: 0.03 + Math.random() * 0.03
                });
            }

            drawingCtx.save();
            drawingCtx.globalAlpha = alpha;
            drawingCtx.strokeStyle = stroke.color;
            drawingCtx.lineWidth = stroke.width * (0.3 + 0.7 * alpha);
            drawingCtx.lineCap = 'round';
            drawingCtx.lineJoin = 'round';
            drawingCtx.shadowBlur = 10 * alpha;
            drawingCtx.shadowColor = stroke.color;

            drawingCtx.beginPath();
            drawingCtx.moveTo(stroke.x1, stroke.y1);
            drawingCtx.lineTo(stroke.x2, stroke.y2);
            drawingCtx.stroke();
            drawingCtx.restore();
        }

        for (let i = pencilDustParticles.length - 1; i >= 0; i--) {
            const p = pencilDustParticles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.alpha -= p.decay;

            if (p.alpha <= 0) {
                pencilDustParticles.splice(i, 1);
                continue;
            }

            activeItems = true;

            drawingCtx.save();
            drawingCtx.globalAlpha = Math.max(0, p.alpha);
            drawingCtx.fillStyle = p.color;
            drawingCtx.shadowBlur = 6 * p.alpha;
            drawingCtx.shadowColor = p.color;

            drawingCtx.beginPath();
            drawingCtx.arc(p.x, p.y, Math.max(0.1, p.size * p.alpha), 0, Math.PI * 2);
            drawingCtx.fill();
            drawingCtx.restore();
        }

        if (activeItems || isDrawingWithPencil) {
            requestAnimationFrame(updateCanvasFrame);
        } else {
            isCanvasLoopRunning = false;
        }
    }

    // ------------------------------------------
    // 4. Sistema 4: Efeito 3D Voxel em CSS Avançado & Direção dos Ícones
    // ------------------------------------------
    let isVoxelModeActive = localStorage.getItem('bg_voxel_mode') === 'true';

    function applyVoxelToElement(el) {
        if (!el) return;
        if (isVoxelModeActive) {
            el.classList.add('voxel-mode');
            let cube3d = el.querySelector('.voxel-cube-3d');
            if (!cube3d) {
                const fontClasses = Array.from(el.classList).filter(c => c.startsWith('fa-'));
                const fontString = fontClasses.join(' ');
                const computedSize = parseInt(el.style.fontSize) || 28;
                const cubeSize = Math.max(24, Math.min(48, Math.round(computedSize * 1.3)));

                el.style.setProperty('--cube-size', `${cubeSize}px`);

                cube3d = document.createElement('div');
                cube3d.className = 'voxel-cube-3d';

                const faces = ['front', 'back', 'left', 'right', 'top', 'bottom'];
                faces.forEach(faceName => {
                    const face = document.createElement('div');
                    face.className = `cube-face cube-${faceName}`;
                    if (faceName === 'front' || faceName === 'back') {
                        const icon = document.createElement('i');
                        icon.className = `fas ${fontString}`;
                        face.appendChild(icon);
                    }
                    cube3d.appendChild(face);
                });

                el._savedIconClasses = fontClasses;
                fontClasses.forEach(c => el.classList.remove(c));
                el.appendChild(cube3d);
            }
        } else {
            el.classList.remove('voxel-mode');
            const cube3d = el.querySelector('.voxel-cube-3d');
            if (cube3d) {
                cube3d.remove();
            }
            if (el._savedIconClasses) {
                el._savedIconClasses.forEach(c => el.classList.add(c));
            }
        }
    }

    let landedVoxelBlocks = [];

    function calculateVoxelLandingTop(currentLeft, cubeSize, currentEl) {
        const footer = document.querySelector('footer');
        let floorY = window.innerHeight - cubeSize - 8;
        if (footer) {
            const footerRect = footer.getBoundingClientRect();
            floorY = footerRect.top - cubeSize + 2;
        }
        let highestTop = floorY;

        landedVoxelBlocks.forEach(b => {
            if (!b.element || !document.body.contains(b.element) || b.element === currentEl) return;
            const bRect = b.element.getBoundingClientRect();
            const centerDist = Math.abs((currentLeft + cubeSize / 2) - (bRect.left + bRect.width / 2));
            if (centerDist < cubeSize * 0.85) {
                if (bRect.top < highestTop) {
                    highestTop = bRect.top;
                }
            }
        });

        return Math.max(10, highestTop - cubeSize + 2);
    }

    function updateVoxelModeState() {
        localStorage.setItem('bg_voxel_mode', isVoxelModeActive);
        const voxelBtn = document.getElementById('voxel-mode-trigger');
        if (voxelBtn) {
            voxelBtn.classList.toggle('active', isVoxelModeActive);
        }

        if (!isVoxelModeActive) {
            landedVoxelBlocks.forEach(b => {
                if (b.element && document.body.contains(b.element)) {
                    b.element.classList.remove('accumulated-voxel', 'falling-to-stack');
                    b.element.style.animation = '';
                    resetNotebook(b.element, null);
                }
            });
            landedVoxelBlocks = [];
        }

        const notebooks = document.querySelectorAll('.floating-notebook');
        notebooks.forEach(el => applyVoxelToElement(el));
    }

    let bgDirectionAngle = parseInt(localStorage.getItem('bg_direction_angle')) || 0;

    function updateBgDirection(angle) {
        bgDirectionAngle = (angle % 360 + 360) % 360;
        localStorage.setItem('bg_direction_angle', bgDirectionAngle);

        const arrowIcon = document.getElementById('direction-arrow-icon');
        if (arrowIcon) {
            arrowIcon.style.transform = `rotate(${bgDirectionAngle - 45}deg)`;
        }

        const rad = bgDirectionAngle * (Math.PI / 180);
        const startX = -Math.sin(rad) * 65;
        const startY = Math.cos(rad) * 65;
        const endX = Math.sin(rad) * 65;
        const endY = -Math.cos(rad) * 65;

        document.documentElement.style.setProperty('--bg-start-x', `${startX.toFixed(2)}vh`);
        document.documentElement.style.setProperty('--bg-start-y', `${startY.toFixed(2)}vh`);
        document.documentElement.style.setProperty('--bg-end-x', `${endX.toFixed(2)}vh`);
        document.documentElement.style.setProperty('--bg-end-y', `${endY.toFixed(2)}vh`);
    }

    updateBgDirection(bgDirectionAngle);

    function initDynamicLighting() {
        let overlay = document.getElementById('dynamic-lighting-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'dynamic-lighting-overlay';
            document.body.appendChild(overlay);
        }

        let spotlightRadius = parseInt(localStorage.getItem('flashlight_size')) || 300;
        document.documentElement.style.setProperty('--flashlight-size', `${spotlightRadius}px`);

        window.addEventListener('mousemove', (e) => {
            document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
            document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
        });

        window.addEventListener('wheel', (e) => {
            if (!document.body.classList.contains('lights-off')) return;

            if (e.deltaY < 0) {
                spotlightRadius = Math.min(750, spotlightRadius + 30);
            } else if (e.deltaY > 0) {
                spotlightRadius = Math.max(120, spotlightRadius - 30);
            }

            document.documentElement.style.setProperty('--flashlight-size', `${spotlightRadius}px`);
            localStorage.setItem('flashlight_size', spotlightRadius);
        }, { passive: true });

        const savedState = localStorage.getItem('dynamic_lights_state') || 'on';
        if (savedState === 'off') {
            document.body.classList.add('lights-off');
        }

        // Inserção dos Controles no Canto Esquerdo do Footer
        const footer = document.querySelector('footer');
        if (footer && !footer.querySelector('.footer-controls-left')) {
            const existingContent = footer.innerHTML;
            footer.innerHTML = `
                <div class="footer-controls-left">
                    <div class="light-switch-wrapper" id="light-switch-trigger" title="Clique para apagar/acender as luzes">
                        <div class="light-switch-plate">
                            <div class="light-switch-toggle"></div>
                        </div>
                        <i class="fas fa-lightbulb"></i>
                    </div>
                    <button class="dice-btn-wrapper" id="dice-scramble-trigger" title="Embaralhar letras (Mantendo 1ª maiúscula)">
                        <i class="fas fa-dice"></i>
                    </button>
                    <button class="dice-btn-wrapper" id="dice-color-trigger" title="Randomizar cores #HEX de TODOS os elementos">
                        <i class="fas fa-dice-d20"></i>
                    </button>
                    <div class="speed-btn-wrapper" title="Digite a velocidade desejada (ex: 0.5, 2, 5, 10)">
                        <i class="fas fa-tachometer-alt"></i>
                        <input type="number" id="speed-custom-input" class="speed-input" value="1" min="0.01" max="500" step="0.5">
                        <span>x</span>
                    </div>
                    <button class="direction-btn-wrapper" id="direction-arrow-trigger" title="Clique ou arraste para girar a direção dos ícones do fundo">
                        <i class="fas fa-location-arrow" id="direction-arrow-icon"></i>
                    </button>
                    <button class="voxel-btn-wrapper" id="voxel-mode-trigger" title="Ativar/Desativar efeito 3D Voxel em todos os ícones">
                        <i class="fas fa-cubes" id="voxel-btn-icon"></i>
                    </button>
                </div>
                <div class="footer-content-right">
                    ${existingContent}
                </div>
            `;

            updateBgDirection(bgDirectionAngle);

            const switchBtn = footer.querySelector('#light-switch-trigger');
            switchBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                document.body.classList.toggle('lights-off');
                const isOff = document.body.classList.contains('lights-off');
                localStorage.setItem('dynamic_lights_state', isOff ? 'off' : 'on');
            });

            const diceBtn = footer.querySelector('#dice-scramble-trigger');
            diceBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                diceBtn.classList.add('rolling');
                toggleTextScramble();
                setTimeout(() => {
                    diceBtn.classList.remove('rolling');
                }, 600);
            });

            const colorDiceBtn = footer.querySelector('#dice-color-trigger');
            colorDiceBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                colorDiceBtn.classList.add('rolling');
                toggleColorRandomizer();
                setTimeout(() => {
                    colorDiceBtn.classList.remove('rolling');
                }, 600);
            });

            const speedInput = footer.querySelector('#speed-custom-input');
            speedInput.addEventListener('input', () => {
                const val = parseFloat(speedInput.value);
                if (!isNaN(val) && val > 0) {
                    document.documentElement.style.setProperty('--bg-speed-mult', 1 / val);
                }
            });
            speedInput.addEventListener('click', (e) => e.stopPropagation());

            const dirBtn = footer.querySelector('#direction-arrow-trigger');
            if (dirBtn) {
                let isDraggingArrow = false;

                dirBtn.addEventListener('click', (e) => {
                    if (isDraggingArrow) return;
                    e.stopPropagation();
                    updateBgDirection(bgDirectionAngle + 45);
                });

                dirBtn.addEventListener('pointerdown', (e) => {
                    if (e.button !== 0) return;
                    e.stopPropagation();
                    let startX = e.clientX;
                    let startY = e.clientY;
                    let dragged = false;

                    const rect = dirBtn.getBoundingClientRect();
                    const centerX = rect.left + rect.width / 2;
                    const centerY = rect.top + rect.height / 2;

                    function onPointerMove(moveEvent) {
                        const dist = Math.hypot(moveEvent.clientX - startX, moveEvent.clientY - startY);
                        if (dist > 4) {
                            dragged = true;
                            isDraggingArrow = true;
                        }

                        if (dragged) {
                            const dx = moveEvent.clientX - centerX;
                            const dy = moveEvent.clientY - centerY;
                            const angleRad = Math.atan2(dy, dx);
                            let angleDeg = angleRad * (180 / Math.PI) + 90;
                            updateBgDirection(Math.round(angleDeg));
                        }
                    }

                    function onPointerUp() {
                        window.removeEventListener('pointermove', onPointerMove);
                        window.removeEventListener('pointerup', onPointerUp);
                        setTimeout(() => {
                            isDraggingArrow = false;
                        }, 50);
                    }

                    window.addEventListener('pointermove', onPointerMove);
                    window.addEventListener('pointerup', onPointerUp);
                });

                dirBtn.addEventListener('wheel', (e) => {
                    e.stopPropagation();
                    const delta = e.deltaY < 0 ? -15 : 15;
                    updateBgDirection(bgDirectionAngle + delta);
                }, { passive: true });
            }

            const voxelBtn = footer.querySelector('#voxel-mode-trigger');
            if (voxelBtn) {
                if (isVoxelModeActive) voxelBtn.classList.add('active');
                voxelBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    isVoxelModeActive = !isVoxelModeActive;
                    updateVoxelModeState();
                });
            }
        }
    }

    initDynamicLighting();

    // ------------------------------------------
    // 5. Sistema de Física Interativa (Apenas Item Segurado Empurra)
    // ------------------------------------------
    const physicsEntities = [];
    let isPhysicsLoopRunning = false;

    function startPhysicsLoop() {
        if (!isPhysicsLoopRunning) {
            isPhysicsLoopRunning = true;
            requestAnimationFrame(updatePhysicsLoop);
        }
    }

    function updatePhysicsLoop() {
        let activeDisplacement = false;

        for (let i = 0; i < physicsEntities.length; i++) {
            const a = physicsEntities[i];
            if (!a.isHeld) continue;

            for (let j = 0; j < physicsEntities.length; j++) {
                if (i === j) continue;
                const b = physicsEntities[j];

                if (!a.element || !b.element) continue;
                if (!document.body.contains(a.element) || !document.body.contains(b.element)) continue;

                const rectA = a.element.getBoundingClientRect();
                const rectB = b.element.getBoundingClientRect();

                const centerA = {
                    x: rectA.left + rectA.width / 2,
                    y: rectA.top + rectA.height / 2
                };
                const centerB = {
                    x: rectB.left + rectB.width / 2,
                    y: rectB.top + rectB.height / 2
                };

                const dx = centerB.x - centerA.x;
                const dy = centerB.y - centerA.y;
                const dist = Math.hypot(dx, dy) || 0.1;
                const minDist = a.radius + b.radius;

                if (dist < minDist) {
                    const overlap = minDist - dist;
                    const nx = dx / dist;
                    const ny = dy / dist;

                    b.px += nx * overlap * 0.85;
                    b.py += ny * overlap * 0.85;

                    b.vx += nx * (a.vx || 0) * 0.35;
                    b.vy += ny * (a.vy || 0) * 0.35;
                }
            }
        }

        physicsEntities.forEach(ent => {
            if (!ent.element || !document.body.contains(ent.element)) return;

            if (ent.type === 'card') {
                if (ent.isHeld) {
                    activeDisplacement = true;
                    ent.element.classList.add('holding-physics');
                    const rot = Math.max(-12, Math.min(12, ent.px * 0.05));
                    ent.element.style.transform = `translate3d(${ent.px}px, ${ent.py}px, 0px) scale(1.05) rotate(${rot}deg)`;
                } else {
                    const stiffness = 0.14;
                    const damping = 0.74;

                    const ax = -stiffness * ent.px;
                    const ay = -stiffness * ent.py;

                    ent.vx = (ent.vx + ax) * damping;
                    ent.vy = (ent.vy + ay) * damping;

                    ent.px += ent.vx;
                    ent.py += ent.vy;

                    if (Math.abs(ent.px) > 0.1 || Math.abs(ent.py) > 0.1 || Math.abs(ent.vx) > 0.1 || Math.abs(ent.vy) > 0.1) {
                        activeDisplacement = true;
                        ent.element.classList.add('physics-active');
                        const rot = Math.max(-10, Math.min(10, ent.px * 0.05));
                        ent.element.style.transform = `translate3d(${ent.px}px, ${ent.py}px, 0px) rotate(${rot}deg)`;
                    } else {
                        ent.px = 0;
                        ent.py = 0;
                        ent.vx = 0;
                        ent.vy = 0;
                        ent.element.classList.remove('physics-active', 'holding-physics');
                        ent.element.style.transform = '';
                    }
                }
            } else if (ent.type === 'notebook') {
                if (ent.isHeld) {
                    activeDisplacement = true;
                } else {
                    ent.vx *= 0.82;
                    ent.vy *= 0.82;
                    ent.px += ent.vx;
                    ent.py += ent.vy;
                    ent.px *= 0.84;
                    ent.py *= 0.84;

                    if (Math.abs(ent.px) > 0.1 || Math.abs(ent.py) > 0.1 || Math.abs(ent.vx) > 0.1 || Math.abs(ent.vy) > 0.1) {
                        activeDisplacement = true;
                        ent.element.style.transform = `translate3d(${ent.px}px, ${ent.py}px, 0px)`;
                    } else {
                        ent.px = 0;
                        ent.py = 0;
                        ent.vx = 0;
                        ent.vy = 0;
                        if (!ent.element.classList.contains('grabbing') && !ent.element.classList.contains('falling') && !ent.element.classList.contains('falling-from-drag')) {
                            ent.element.style.transform = '';
                        }
                    }
                }
            }
        });

        if (activeDisplacement) {
            requestAnimationFrame(updatePhysicsLoop);
        } else {
            isPhysicsLoopRunning = false;
        }
    }

    // ------------------------------------------
    // 6. Dashboard Cards (Física & Navegação Normal por Clique)
    // ------------------------------------------
    const grid = document.querySelector('.dashboard-grid');
    if (grid) {
        grid.querySelectorAll('.dashboard-card').forEach(card => {
            const physicsEntity = {
                element: card,
                type: 'card',
                px: 0,
                py: 0,
                vx: 0,
                vy: 0,
                isHeld: false,
                radius: 95
            };
            physicsEntities.push(physicsEntity);

            card.addEventListener('dragstart', (e) => e.preventDefault());

            card.addEventListener('mousemove', (e) => {
                if (physicsEntity.isHeld || Math.abs(physicsEntity.px) > 1 || Math.abs(physicsEntity.py) > 1) return;
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = ((y - centerY) / centerY) * -10;
                const rotateY = ((x - centerX) / centerX) * 10;
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(6px)`;
            });

            card.addEventListener('mouseleave', () => {
                if (physicsEntity.isHeld || Math.abs(physicsEntity.px) > 1 || Math.abs(physicsEntity.py) > 1) return;
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
            });

            card.addEventListener('pointerdown', (e) => {
                if (e.button !== 0) return;
                e.preventDefault();

                const startX = e.clientX;
                const startY = e.clientY;
                let lastPointerX = e.clientX;
                let lastPointerY = e.clientY;
                let hasMoved = false;

                physicsEntity.isHeld = true;
                physicsEntity.vx = 0;
                physicsEntity.vy = 0;
                startPhysicsLoop();

                try {
                    card.setPointerCapture(e.pointerId);
                } catch (err) {}

                function onPointerMove(moveEvent) {
                    const dx = moveEvent.clientX - startX;
                    const dy = moveEvent.clientY - startY;

                    if (Math.hypot(dx, dy) > 5) {
                        hasMoved = true;
                    }

                    physicsEntity.vx = moveEvent.clientX - lastPointerX;
                    physicsEntity.vy = moveEvent.clientY - lastPointerY;
                    lastPointerX = moveEvent.clientX;
                    lastPointerY = moveEvent.clientY;

                    physicsEntity.px = dx;
                    physicsEntity.py = dy;

                    startPhysicsLoop();
                }

                function onPointerUp(upEvent) {
                    card.removeEventListener('pointermove', onPointerMove);
                    card.removeEventListener('pointerup', onPointerUp);
                    card.removeEventListener('pointercancel', onPointerUp);

                    try {
                        card.releasePointerCapture(e.pointerId);
                    } catch (err) {}

                    physicsEntity.isHeld = false;
                    startPhysicsLoop();

                    if (!hasMoved) {
                        const href = card.getAttribute('href');
                        if (href) {
                            window.location.href = href;
                        }
                    }
                }

                card.addEventListener('pointermove', onPointerMove);
                card.addEventListener('pointerup', onPointerUp);
                card.addEventListener('pointercancel', onPointerUp);
            });
        });
    }

    // ------------------------------------------
    // 7. Animação de Minis Cadernos no Fundo (Arrastáveis, Velocidade Digitar & Desenho de Lápis)
    // ------------------------------------------
    function createNotebookBackground() {
        if (document.getElementById('bg-notebooks-container')) return;

        const container = document.createElement('div');
        container.id = 'bg-notebooks-container';
        document.body.prepend(container);

        const icons = ['fa-book', 'fa-book-open', 'fa-book-bookmark', 'fa-graduation-cap', 'fa-pencil-alt', 'fa-file-alt'];
        const totalParticles = 30;

        function resetNotebook(el, physicsEntity) {
            const spreadX = (Math.random() - 0.5) * 96;
            const spreadY = (Math.random() - 0.5) * 50;
            const duration = 12 + Math.random() * 22;
            const delay = Math.random() * 18;
            const size = 14 + Math.random() * 18;
            const iconClass = icons[Math.floor(Math.random() * icons.length)];

            el.className = `fas ${iconClass} floating-notebook`;
            el.style.cssText = `
                left: calc(50vw + ${spreadX}vw);
                top: calc(50vh + ${spreadY}vh);
                bottom: auto;
                position: absolute;
                --base-duration: ${duration}s;
                animation-delay: -${delay}s;
                font-size: ${size}px;
            `;
            el.style.removeProperty('--fall-distance');
            el.style.removeProperty('--fall-rotation');

            applyVoxelToElement(el);

            if (isColorRandomized) {
                const color = getRandomHexColor();
                el.style.setProperty('color', color, 'important');
                el.style.setProperty('filter', `drop-shadow(0 0 12px ${color})`, 'important');
            }

            if (physicsEntity) {
                physicsEntity.px = 0;
                physicsEntity.py = 0;
                physicsEntity.vx = 0;
                physicsEntity.vy = 0;
                physicsEntity.isHeld = false;
            }
        }

        function attachNotebookEvents(el, physicsEntity) {
            el.addEventListener('pointerdown', (e) => {
                if (el.classList.contains('falling') || el.classList.contains('falling-from-drag') || el.classList.contains('fading-out')) return;
                e.preventDefault();
                e.stopPropagation();

                const rect = el.getBoundingClientRect();
                const offsetX = e.clientX - rect.left;
                const offsetY = e.clientY - rect.top;
                const startX = e.clientX;
                const startY = e.clientY;
                let isDragged = false;

                const isPencil = el.classList.contains('fa-pencil-alt') || el.querySelector('.fa-pencil-alt') !== null || (el._savedIconClasses && el._savedIconClasses.includes('fa-pencil-alt'));
                if (isPencil) {
                    initDrawingCanvas();
                    isDrawingWithPencil = true;
                    const initRect = el.getBoundingClientRect();
                    lastPencilPos = {
                        x: initRect.left + initRect.width * 0.1,
                        y: initRect.bottom - initRect.height * 0.1
                    };
                }

                el.style.animation = 'none';
                el.style.position = 'fixed';
                el.style.top = `${rect.top}px`;
                el.style.left = `${rect.left}px`;
                el.style.bottom = 'auto';

                el.classList.add('grabbing');
                physicsEntity.isHeld = true;
                startPhysicsLoop();

                try {
                    el.setPointerCapture(e.pointerId);
                } catch (err) {}

                function onPointerMove(moveEvent) {
                    const distMoved = Math.hypot(moveEvent.clientX - startX, moveEvent.clientY - startY);
                    if (distMoved > 4) {
                        isDragged = true;
                    }

                    if (isDragged) {
                        const newLeft = moveEvent.clientX - offsetX;
                        const newTop = moveEvent.clientY - offsetY;
                        el.style.left = `${newLeft}px`;
                        el.style.top = `${newTop}px`;
                        startPhysicsLoop();
                    }

                    if (isDrawingWithPencil && isPencil) {
                        const currentRect = el.getBoundingClientRect();
                        const tipX = currentRect.left + currentRect.width * 0.1;
                        const tipY = currentRect.bottom - currentRect.height * 0.1;
                        const pencilColor = el.style.color || '#38bdf8';
                        drawLineSegment(lastPencilPos.x, lastPencilPos.y, tipX, tipY, pencilColor);
                        lastPencilPos = { x: tipX, y: tipY };
                    }
                }

                function onPointerUp(upEvent) {
                    el.removeEventListener('pointermove', onPointerMove);
                    el.removeEventListener('pointerup', onPointerUp);
                    el.removeEventListener('pointercancel', onPointerUp);

                    try {
                        el.releasePointerCapture(e.pointerId);
                    } catch (err) {}

                    if (isPencil) {
                        isDrawingWithPencil = false;
                    }

                    el.classList.remove('grabbing');
                    physicsEntity.isHeld = false;

                    const existingIndex = landedVoxelBlocks.findIndex(b => b.element === el);
                    if (existingIndex !== -1) {
                        landedVoxelBlocks.splice(existingIndex, 1);
                    }
                    el.classList.remove('accumulated-voxel', 'falling-to-stack');

                    if (isVoxelModeActive) {
                        const currentRect = el.getBoundingClientRect();
                        const cubeSize = currentRect.height || 36;
                        let currentLeft = currentRect.left;
                        const currentTop = currentRect.top;

                        landedVoxelBlocks.forEach(b => {
                            if (!b.element || !document.body.contains(b.element) || b.element === el) return;
                            const bRect = b.element.getBoundingClientRect();
                            const centerDiff = Math.abs((currentLeft + cubeSize / 2) - (bRect.left + bRect.width / 2));
                            if (centerDiff < cubeSize * 0.45) {
                                currentLeft = bRect.left;
                            }
                        });

                        const targetTop = calculateVoxelLandingTop(currentLeft, cubeSize, el);
                        const fallDistance = Math.max(0, targetTop - currentTop);

                        el.style.setProperty('--fall-distance', `${fallDistance}px`);
                        el.style.animation = 'none';
                        void el.offsetHeight;

                        el.classList.add('falling-to-stack');

                        const fallDuration = Math.min(600, Math.max(250, fallDistance * 1.1));
                        setTimeout(() => {
                            el.classList.remove('falling-to-stack');
                            el.style.animation = '';
                            el.style.position = 'fixed';
                            el.style.top = `${targetTop}px`;
                            el.style.left = `${currentLeft}px`;
                            el.style.bottom = 'auto';
                            el.classList.add('accumulated-voxel');

                            landedVoxelBlocks.push({
                                element: el,
                                top: targetTop,
                                left: currentLeft,
                                width: cubeSize,
                                height: cubeSize
                            });
                        }, fallDuration);

                        return;
                    }

                    const currentRect = el.getBoundingClientRect();
                    const windowHeight = window.innerHeight;
                    const currentTop = currentRect.top;
                    const targetTop = windowHeight - currentRect.height - 15;
                    const fallDistance = Math.max(0, targetTop - currentTop);

                    const randomRotation = (Math.random() > 0.5 ? 1 : -1) * (360 + Math.floor(Math.random() * 360));

                    el.style.setProperty('--fall-distance', `${fallDistance}px`);
                    el.style.setProperty('--fall-rotation', `${randomRotation}deg`);

                    void el.offsetHeight;

                    if (isDragged) {
                        el.classList.add('falling-from-drag');
                    } else {
                        el.classList.add('falling');
                    }

                    setTimeout(() => {
                        el.classList.add('fading-out');
                        setTimeout(() => {
                            resetNotebook(el, physicsEntity);
                        }, 800);
                    }, 2800);
                }

                el.addEventListener('pointermove', onPointerMove);
                el.addEventListener('pointerup', onPointerUp);
                el.addEventListener('pointercancel', onPointerUp);
            });
        }

        for (let i = 0; i < totalParticles; i++) {
            const el = document.createElement('i');
            const iconClass = icons[Math.floor(Math.random() * icons.length)];
            el.className = `fas ${iconClass} floating-notebook`;

            const spreadX = (Math.random() - 0.5) * 96;
            const spreadY = (Math.random() - 0.5) * 50;
            const duration = 12 + Math.random() * 22;
            const delay = Math.random() * 18;
            const size = 14 + Math.random() * 18;

            el.style.cssText = `
                left: calc(50vw + ${spreadX}vw);
                top: calc(50vh + ${spreadY}vh);
                bottom: auto;
                position: absolute;
                --base-duration: ${duration}s;
                animation-delay: -${delay}s;
                font-size: ${size}px;
            `;

            const physicsEntity = {
                element: el,
                type: 'notebook',
                px: 0,
                py: 0,
                vx: 0,
                vy: 0,
                isHeld: false,
                radius: 25
            };
            physicsEntities.push(physicsEntity);

            attachNotebookEvents(el, physicsEntity);
            applyVoxelToElement(el);
            container.appendChild(el);
        }
    }

    createNotebookBackground();
});
