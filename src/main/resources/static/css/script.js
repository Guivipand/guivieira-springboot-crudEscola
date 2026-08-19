/* ==========================================
   Efeitos Visuais 3D, Drag & Drop e Fundo Animado
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    // ------------------------------------------
    // 1. Efeito 3D Tilt apenas para Dashboard Cards
    // ------------------------------------------
    const dashboardCards = document.querySelectorAll('.dashboard-card');
    dashboardCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            if (card.classList.contains('dragging')) return;
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
            if (card.classList.contains('dragging')) return;
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
        });
    });

    // ------------------------------------------
    // 2. Drag and Drop para Reorganizar Cards
    // ------------------------------------------
    const grid = document.querySelector('.dashboard-grid');
    if (grid) {
        let draggedItem = null;

        // Restaura ordem salva no localStorage
        const savedOrder = JSON.parse(localStorage.getItem('dashboard_cards_order') || '[]');
        if (savedOrder.length > 0) {
            const cardsMap = {};
            grid.querySelectorAll('.dashboard-card').forEach(card => {
                const id = card.getAttribute('data-id');
                if (id) cardsMap[id] = card;
            });
            savedOrder.forEach(id => {
                if (cardsMap[id]) {
                    grid.appendChild(cardsMap[id]);
                }
            });
        }

        function saveOrder() {
            const order = Array.from(grid.querySelectorAll('.dashboard-card'))
                .map(card => card.getAttribute('data-id'))
                .filter(Boolean);
            localStorage.setItem('dashboard_cards_order', JSON.stringify(order));
        }

        grid.querySelectorAll('.dashboard-card').forEach(card => {
            card.addEventListener('dragstart', (e) => {
                draggedItem = card;
                card.classList.add('dragging');
                e.dataTransfer.effectAllowed = 'move';
                const id = card.getAttribute('data-id');
                if (id) e.dataTransfer.setData('text/plain', id);
            });

            card.addEventListener('dragend', () => {
                draggedItem = null;
                grid.querySelectorAll('.dashboard-card').forEach(c => {
                    c.classList.remove('dragging', 'drag-over');
                    c.style.transform = '';
                });
                saveOrder();
            });

            card.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
                if (card !== draggedItem) {
                    card.classList.add('drag-over');
                }
            });

            card.addEventListener('dragleave', () => {
                card.classList.remove('drag-over');
            });

            card.addEventListener('drop', (e) => {
                e.preventDefault();
                card.classList.remove('drag-over');
                if (draggedItem && draggedItem !== card) {
                    const allCards = Array.from(grid.querySelectorAll('.dashboard-card'));
                    const draggedPos = allCards.indexOf(draggedItem);
                    const targetPos = allCards.indexOf(card);

                    if (draggedPos < targetPos) {
                        card.after(draggedItem);
                    } else {
                        card.before(draggedItem);
                    }
                    saveOrder();
                }
            });
        });
    }

    // ------------------------------------------
    // 3. Animação de Minis Cadernos no Fundo (Estrelas)
    // ------------------------------------------
    function createNotebookBackground() {
        if (document.getElementById('bg-notebooks-container')) return;

        const container = document.createElement('div');
        container.id = 'bg-notebooks-container';
        document.body.prepend(container);

        const icons = ['fa-book', 'fa-book-open', 'fa-book-bookmark', 'fa-graduation-cap', 'fa-pencil-alt', 'fa-file-alt'];
        const totalParticles = 30;

        for (let i = 0; i < totalParticles; i++) {
            const el = document.createElement('i');
            const iconClass = icons[Math.floor(Math.random() * icons.length)];
            el.className = `fas ${iconClass} floating-notebook`;

            const left = Math.random() * 100;
            const duration = 12 + Math.random() * 22;
            const delay = Math.random() * 18;
            const size = 14 + Math.random() * 18;

            el.style.cssText = `
                left: ${left}vw;
                animation-duration: ${duration}s;
                animation-delay: -${delay}s;
                font-size: ${size}px;
            `;

            container.appendChild(el);
        }
    }

    createNotebookBackground();
});
