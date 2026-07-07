// Transición de página y navegación
function enablePageTransition() {
    requestAnimationFrame(() => {
        document.body.classList.add('is-visible');
    });
}

function setupBackLinkTransition() {
    const backLink = document.getElementById('back-link');
    if (!backLink) return;

    backLink.addEventListener('click', (event) => {
        event.preventDefault();
        const targetUrl = backLink.getAttribute('href') || './index.html';
        document.body.classList.remove('is-visible');
        document.body.classList.add('is-transitioning');
        setTimeout(() => {
            window.location.href = targetUrl;
        }, 200);
    });
}

// Botones de utilidad (Copiar Enlace e Imprimir)
function initReaderTools() {
    const copyBtn = document.getElementById('copy-link-btn');
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(window.location.href).then(() => {
                const orig = copyBtn.innerHTML;
                copyBtn.innerHTML = '✅ Copiado';
                copyBtn.style.borderColor = 'var(--accent-blue)';
                setTimeout(() => {
                    copyBtn.innerHTML = orig;
                    copyBtn.style.borderColor = '';
                }, 2000);
            }).catch(err => alert('No se pudo copiar el enlace: ' + err));
        });
    }

    const printBtn = document.getElementById('print-btn');
    if (printBtn) {
        printBtn.addEventListener('click', () => {
            window.print();
        });
    }
}

// Convertidor de Markdown con IDs para la tabla de contenidos
function markdownToHtmlWithIds(md) {
    let html = md;
    let headingCount = 0;

    // Blockquotes
    html = html.replace(/^> (.*?)$/gm, '<blockquote>$1</blockquote>');

    // Encabezados H3
    html = html.replace(/^### (.*?)$/gm, (match, title) => {
        headingCount++;
        const id = `section-${headingCount}`;
        return `<h3 id="${id}" class="doc-heading level-3">${title}</h3>`;
    });

    // Encabezados H2
    html = html.replace(/^## (.*?)$/gm, (match, title) => {
        headingCount++;
        const id = `section-${headingCount}`;
        return `<h2 id="${id}" class="doc-heading level-2">${title}</h2>`;
    });

    // Encabezado H1
    html = html.replace(/^# (.*?)$/gm, '<h1>$1</h1>');

    // Negritas e Itálicas
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Enlaces
    html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1 ↗</a>');

    // Listas
    html = html.replace(/^- (.*?)$/gm, '<li>$1</li>');
    html = html.replace(/^\* (.*?)$/gm, '<li>$1</li>');

    html = html.replace(/(<li>.*?<\/li>\n?)+/g, (match) => {
        return `<ul>${match}</ul>`;
    });

    // Párrafos
    html = html.split('\n\n').map(block => {
        const trimmed = block.trim();
        if (!trimmed) return '';
        if (trimmed.match(/^<(h1|h2|h3|ul|ol|blockquote|li)/)) return trimmed;
        return '<p>' + trimmed.replace(/\n/g, '<br>') + '</p>';
    }).join('\n');

    return html;
}

// Generar Índice de Contenidos (Estilo Microsoft Docs)
function generateTableOfContents() {
    const tocList = document.getElementById('toc-list');
    if (!tocList) return;

    const headings = document.querySelectorAll('#content .doc-heading');
    if (headings.length === 0) {
        tocList.innerHTML = '<li class="toc-item"><span style="color: var(--text-muted);">Sin secciones</span></li>';
        return;
    }

    tocList.innerHTML = '';

    headings.forEach((heading, index) => {
        const id = heading.getAttribute('id');
        const text = heading.textContent;
        const level = heading.classList.contains('level-3') ? 'level-3' : 'level-2';

        const li = document.createElement('li');
        li.className = `toc-item ${level}`;

        const a = document.createElement('a');
        a.className = 'toc-link';
        a.href = `#${id}`;
        a.textContent = text;

        if (index === 0) a.classList.add('active');

        a.addEventListener('click', (e) => {
            e.preventDefault();
            const targetEl = document.getElementById(id);
            if (targetEl) {
                targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
                document.querySelectorAll('.toc-link').forEach(l => l.classList.remove('active'));
                a.classList.add('active');
            }
        });

        li.appendChild(a);
        tocList.appendChild(li);
    });

    // Intersection Observer para resaltar la sección activa
    const observerOptions = {
        root: null,
        rootMargin: '-80px 0px -70% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                document.querySelectorAll('.toc-link').forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, observerOptions);

    headings.forEach(heading => observer.observe(heading));
}

async function getDefaultPolicyId() {
    try {
        const res = await fetch('./policies.json');
        if (!res.ok) return null;
        const data = await res.json();
        return data?.policies?.[0]?.id || null;
    } catch {
        return null;
    }
}

// Cargar documento Markdown
async function loadPolicy() {
    const contentEl = document.getElementById('content');
    const titleEl = document.getElementById('page-title');
    const navTitleEl = document.getElementById('nav-policy-title');
    const platformEl = document.getElementById('doc-platform');

    try {
        const params = new URLSearchParams(window.location.search);
        let policyId = params.get('id');
        if (!policyId) policyId = await getDefaultPolicyId();
        if (!policyId) throw new Error('No se especificó ninguna política.');

        let policyMeta = null;
        try {
            const res = await fetch('./policies.json');
            if (res.ok) {
                const data = await res.json();
                policyMeta = (data.policies || []).find(p => p.id === policyId);
            }
        } catch {
            // Ignorar
        }

        if (policyMeta?.name) {
            document.title = `${policyMeta.name} | Trébol Asociados`;
            if (titleEl) titleEl.textContent = policyMeta.name;
            if (navTitleEl) navTitleEl.textContent = policyMeta.name;
        }

        if (platformEl) {
            if (policyId.includes('googleplay')) platformEl.textContent = 'Google Play (Android)';
            else if (policyId.includes('microsoftstore')) platformEl.textContent = 'Microsoft Store (Windows)';
            else platformEl.textContent = 'Documento Oficial';
        }

        const mdResponse = await fetch(`/politicas/${policyId}.md`);
        if (!mdResponse.ok) throw new Error('No se encontró el archivo de la política.');
        
        const mdContent = await mdResponse.text();

        const htmlContent = markdownToHtmlWithIds(mdContent);
        if (contentEl) contentEl.innerHTML = htmlContent;

        generateTableOfContents();

    } catch (error) {
        if (contentEl) {
            contentEl.innerHTML = `
                <div style="background: #FFF5F5; border: 1px solid #FDE7E9; color: #A80000; padding: 32px; border-radius: 8px; text-align: center; margin: 40px 0;">
                    <div style="margin-bottom: 12px;"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#A80000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg></div>
                    <h3 style="color: #A80000; margin-bottom: 8px;">Error al cargar el documento</h3>
                    <p style="color: var(--text-secondary);">${error.message}</p>
                    <a href="./index.html" class="back-btn" style="margin-top: 16px; display: inline-flex;">← Volver al listado</a>
                </div>
            `;
        }
    }
}

// Elevación dinámica de barra superior al hacer scroll
function setupScrollElevation() {
    const nav = document.querySelector('.reader-nav');
    if (!nav) return;
    window.addEventListener('scroll', () => {
        if (window.scrollY > 10) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
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
    initReaderTools();
    setupBackLinkTransition();
    loadPolicy();
    enablePageTransition();
    setupScrollElevation();
    setupContactModal();
});
