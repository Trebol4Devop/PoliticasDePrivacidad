// Estado global de la aplicación
let allPolicies = [];
let currentFilter = 'all';
let searchQuery = '';

// Transiciones suaves de página
function enablePageTransition() {
    requestAnimationFrame(() => {
        document.body.classList.add('is-visible');
    });
}

function setupPolicyNavigationTransition() {
    document.addEventListener('click', (event) => {
        const link = event.target.closest('a.btn-primary');
        if (!link || link.getAttribute('target') === '_blank') return;

        const targetUrl = link.getAttribute('href');
        if (!targetUrl || targetUrl === '#' || targetUrl.startsWith('javascript:')) return;

        event.preventDefault();
        document.body.classList.remove('is-visible');
        document.body.classList.add('is-transitioning');
        setTimeout(() => {
            window.location.href = targetUrl;
        }, 200);
    });
}

// Formateadores para insignias de plataforma e idioma
function formatPlatform(policyId, policyName) {
    if (policyId.includes('googleplay') || policyName.toLowerCase().includes('google play')) {
        return '<span class="platform-badge">Google Play</span>';
    }
    if (policyId.includes('microsoftstore') || policyName.toLowerCase().includes('microsoft store')) {
        return '<span class="platform-badge">Microsoft Store</span>';
    }
    return '<span class="platform-badge">Plataforma Universal</span>';
}

function formatLanguage(policyId, policyName) {
    if (policyId.includes('_es_') || policyName.toLowerCase().includes('español')) {
        return '<span class="lang-badge">Español</span>';
    }
    if (policyId.includes('_en_') || policyName.toLowerCase().includes('english')) {
        return '<span class="lang-badge">English</span>';
    }
    return '<span class="lang-badge">General</span>';
}

// Cargar políticas desde policies.json
async function loadPolicies() {
    const container = document.getElementById('policies-container');
    try {
        const response = await fetch('policies.json');
        if (!response.ok) throw new Error('No se pudo acceder al archivo de políticas');
        
        const data = await response.json();
        allPolicies = data.policies || [];

        // Actualizar fecha de última actualización
        if (data.generatedAt) {
            const dateObj = new Date(data.generatedAt);
            const dateFormatted = dateObj.toLocaleDateString('es-ES', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            });
            const updateEl = document.getElementById('last-update');
            if (updateEl) updateEl.textContent = dateFormatted;
        }

        renderPolicies();
    } catch (error) {
        if (container) {
            container.innerHTML = `
                <div class="state-box" style="border-color: #FDE7E9; background: #FFF5F5;">
                    <div style="margin-bottom: 12px;"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#A80000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg></div>
                    <h3 style="color: #A80000; margin-bottom: 8px;">No se pudieron cargar las políticas</h3>
                    <p style="color: var(--text-secondary);">${error.message}</p>
                </div>
            `;
        }
    }
}

// Filtrado y renderizado minimalista
function renderPolicies() {
    const container = document.getElementById('policies-container');
    const countEl = document.getElementById('policy-count');
    if (!container) return;

    // Filtrar por categoría y búsqueda
    const filtered = allPolicies.filter(policy => {
        let matchesFilter = true;
        if (currentFilter === 'googleplay') matchesFilter = policy.id.includes('googleplay');
        else if (currentFilter === 'microsoftstore') matchesFilter = policy.id.includes('microsoftstore');
        else if (currentFilter === 'es') matchesFilter = policy.id.includes('_es_');
        else if (currentFilter === 'en') matchesFilter = policy.id.includes('_en_');

        let matchesSearch = true;
        if (searchQuery.trim() !== '') {
            const q = searchQuery.toLowerCase();
            matchesSearch = policy.name.toLowerCase().includes(q) || policy.id.toLowerCase().includes(q);
        }

        return matchesFilter && matchesSearch;
    });

    if (countEl) countEl.textContent = filtered.length;

    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="state-box">
                <div style="margin-bottom: 12px;"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg></div>
                <h3 style="color: var(--text-primary); margin-bottom: 8px;">No se encontraron resultados</h3>
                <p>No hay documentos que coincidan con la búsqueda o filtro actual.</p>
                <button onclick="resetFilters()" class="btn-primary" style="margin-top: 16px; background: var(--bg-tertiary); color: var(--text-primary);">
                    Restablecer filtros
                </button>
            </div>
        `;
        return;
    }

    container.innerHTML = '';

    filtered.forEach((policy, index) => {
        const platformHtml = formatPlatform(policy.id, policy.name);
        const langHtml = formatLanguage(policy.id, policy.name);

        const card = document.createElement('div');
        card.className = 'policy-card';
        card.style.animationDelay = `${index * 0.07}s`;
        card.innerHTML = `
            <div>
                <div class="card-top">
                    ${platformHtml}
                    ${langHtml}
                </div>
                
                <h3 class="card-title">${policy.name}</h3>
                <p class="card-desc">
                    Consulta el documento oficial sobre recopilación de datos, uso de información y protección de la privacidad del usuario.
                </p>
            </div>

            <div class="card-actions">
                <a href="policy.html?id=${policy.id}" class="btn-primary">
                    Leer política
                </a>
            </div>
        `;
        container.appendChild(card);
    });
}

// Controladores para filtros y búsqueda
function setupToolbarListeners() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value;
            renderPolicies();
        });
    }

    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.getAttribute('data-filter') || 'all';
            renderPolicies();
        });
    });
}

function resetFilters() {
    searchQuery = '';
    currentFilter = 'all';
    const searchInput = document.getElementById('search-input');
    if (searchInput) searchInput.value = '';
    
    document.querySelectorAll('.filter-btn').forEach(b => {
        b.classList.toggle('active', b.getAttribute('data-filter') === 'all');
    });
    renderPolicies();
}

// Efecto de elevación en navegación al hacer scroll
function setupScrollElevation() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    window.addEventListener('scroll', () => {
        if (window.scrollY > 10) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, { passive: true });
}

// Modal de Contacto interactivo
function setupContactModal() {
    const contactLinks = document.querySelectorAll('a[href="#contact"], #contact-link');
    const modal = document.getElementById('contact-modal');
    const closeBtn = document.getElementById('close-contact-btn');
    const copyBtn = document.getElementById('copy-email-btn');

    if (!modal) return;

    contactLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            modal.classList.add('active');
        });
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
        });
    }

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });

    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText('trebol4devop@proton.me').then(() => {
                const orig = copyBtn.innerHTML;
                copyBtn.innerHTML = 'Copiado';
                copyBtn.style.borderColor = 'var(--accent-blue)';
                copyBtn.style.color = 'var(--accent-blue)';
                setTimeout(() => {
                    copyBtn.innerHTML = orig;
                    copyBtn.style.borderColor = '';
                    copyBtn.style.color = '';
                }, 2000);
            }).catch(() => {
                alert('Correo: trebol4devop@proton.me');
            });
        });
    }
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    setupToolbarListeners();
    loadPolicies();
    setupPolicyNavigationTransition();
    enablePageTransition();
    setupScrollElevation();
    setupContactModal();
});
