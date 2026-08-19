/* ==========================================
   Efeitos Visuais 3D, Fundo Animado com Física e Sistema de Luz Dinâmica
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ------------------------------------------
    // 1. Sistema de Embaralhar Letras (Mantendo 1ª Maiúscula)
    // ------------------------------------------
    let isTextScrambled = false;

    function scrambleWord(word) {
        if (word.length <= 1) return word;

        const isFirstUpper = /^[A-ZÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ]/.test(word);
        const isAllUpper = word === word.toUpperCase() && word.length > 1;

        let letters = word.toLowerCase().split('');

        // Algoritmo Fisher-Yates para embaralhar
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
                if (node.nodeName !== 'SCRIPT' && node.nodeName !== 'STYLE' && node.nodeName !== 'NOSCRIPT' && !node.classList?.contains('light-switch-wrapper') && !node.classList?.contains('dice-btn-wrapper')) {
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
    // 2. Sistema de Luz Dinâmica & Controles do Footer
    // ------------------------------------------
    function initDynamicLighting() {
        // Overlay de Luz Dinâmica que segue a lanterna do mouse
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

        // Zoom da Lanterna via Scroll do Mouse (Wheel) quando as luzes estão APAGADAS
        let hintTimeout = null;
        function showFlashlightSizeHint(size) {
            let hint = document.getElementById('flashlight-size-hint');
            if (!hint) {
                hint = document.createElement('div');
                hint.id = 'flashlight-size-hint';
                document.body.appendChild(hint);
            }
            hint.innerHTML = `<i class="fas fa-search"></i> Foco da Lanterna: ${size}px`;
            hint.classList.add('visible');

            clearTimeout(hintTimeout);
            hintTimeout = setTimeout(() => {
                hint.classList.remove('visible');
            }, 1200);
        }

        window.addEventListener('wheel', (e) => {
            if (!document.body.classList.contains('lights-off')) return;

            if (e.deltaY < 0) {
                spotlightRadius = Math.min(750, spotlightRadius + 30);
            } else if (e.deltaY > 0) {
                spotlightRadius = Math.max(120, spotlightRadius - 30);
            }

            document.documentElement.style.setProperty('--flashlight-size', `${spotlightRadius}px`);
            localStorage.setItem('flashlight_size', spotlightRadius);
            showFlashlightSizeHint(spotlightRadius);
        }, { passive: true });

        // Carrega estado salvo no localStorage
        const savedState = localStorage.getItem('dynamic_lights_state') || 'on';
        if (savedState === 'off') {
            document.body.classList.add('lights-off');
        }

        // Inserção dos Controles no Canto Esquerdo do Footer (Switch + Botão de Dado)
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
                </div>
                <div class="footer-content-right">
                    ${existingContent}
                </div>
            `;

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
        }
    }

    initDynamicLighting();

    // ------------------------------------------
    // 3. Sistema de Física Interativa (Apenas Item Segurado Empurra)
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

        // Apenas a entidade SEGURADA empurra as outras coisas ao seu redor
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
    // 4. Dashboard Cards (Física & Navegação Normal por Clique)
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
                        // Clique simples normal -> navega imediatamente para o link!
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
    // 5. Animação de Minis Cadernos no Fundo (Arrastáveis & Interativo)
    // ------------------------------------------
    function createNotebookBackground() {
        if (document.getElementById('bg-notebooks-container')) return;

        const container = document.createElement('div');
        container.id = 'bg-notebooks-container';
        document.body.prepend(container);

        const icons = ['fa-book', 'fa-book-open', 'fa-book-bookmark', 'fa-graduation-cap', 'fa-pencil-alt', 'fa-file-alt'];
        const totalParticles = 30;

        function resetNotebook(el, physicsEntity) {
            const left = Math.random() * 95;
            const duration = 12 + Math.random() * 22;
            const delay = Math.random() * 18;
            const size = 14 + Math.random() * 18;
            const iconClass = icons[Math.floor(Math.random() * icons.length)];

            el.className = `fas ${iconClass} floating-notebook`;
            el.style.cssText = `
                left: ${left}vw;
                animation-duration: ${duration}s;
                animation-delay: -${delay}s;
                font-size: ${size}px;
                position: absolute;
                bottom: -60px;
                top: auto;
            `;
            el.style.removeProperty('--fall-distance');
            el.style.removeProperty('--fall-rotation');

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
                }

                function onPointerUp(upEvent) {
                    el.removeEventListener('pointermove', onPointerMove);
                    el.removeEventListener('pointerup', onPointerUp);
                    el.removeEventListener('pointercancel', onPointerUp);

                    try {
                        el.releasePointerCapture(e.pointerId);
                    } catch (err) {}

                    el.classList.remove('grabbing');
                    physicsEntity.isHeld = false;

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

            const left = Math.random() * 95;
            const duration = 12 + Math.random() * 22;
            const delay = Math.random() * 18;
            const size = 14 + Math.random() * 18;

            el.style.cssText = `
                left: ${left}vw;
                animation-duration: ${duration}s;
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
            container.appendChild(el);
        }
    }

    createNotebookBackground();
});
