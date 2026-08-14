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

// Formateo de texto en línea (código, negrita, cursiva, enlaces)
function formatInlineMarkdown(text) {
    if (!text) return '';
    let s = text;
    // Código en línea
    s = s.replace(/`([^`]+)`/g, '<code>$1</code>');
    // Negrita
    s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    // Cursiva
    s = s.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    // Enlaces markdown
    s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1 ↗</a>');
    return s;
}

// Convertidor de Markdown a HTML robusto con soporte de tablas, listas, código y IDs para la tabla de contenidos
function markdownToHtmlWithIds(md) {
    const lines = md.split(/\r?\n/);
    const html = [];
    let headingCount = 0;
    let inTable = false;
    let tableRows = [];
    let inUl = false;
    let inOl = false;
    let inBlockquote = false;
    let blockquoteLines = [];

    function flushBlockquote() {
        if (inBlockquote) {
            html.push(`<blockquote>${blockquoteLines.join('<br>')}</blockquote>`);
            blockquoteLines = [];
            inBlockquote = false;
        }
    }

    function flushList() {
        if (inUl) {
            html.push('</ul>');
            inUl = false;
        }
        if (inOl) {
            html.push('</ol>');
            inOl = false;
        }
    }

    function flushTable() {
        if (inTable) {
            if (tableRows.length > 0) {
                let tableHtml = '<div class="table-container"><table>';
                const headerRow = tableRows[0];
                let startBody = 1;
                if (tableRows.length > 1 && /^\|?[\s-:]+\|[\s\-:|]+$/.test(tableRows[1].trim())) {
                    startBody = 2;
                }
                
                // Encabezados
                const ths = headerRow.split('|').filter((c, i, a) => !(i === 0 && c === '') && !(i === a.length - 1 && c === ''));
                tableHtml += '<thead><tr>' + ths.map(c => `<th>${formatInlineMarkdown(c.trim())}</th>`).join('') + '</tr></thead>';
                
                // Cuerpo de la tabla
                tableHtml += '<tbody>';
                for (let r = startBody; r < tableRows.length; r++) {
                    const rowText = tableRows[r].trim();
                    if (!rowText || /^\|?[\s-:]+\|[\s\-:|]+$/.test(rowText)) continue;
                    const tds = rowText.split('|').filter((c, i, a) => !(i === 0 && c === '') && !(i === a.length - 1 && c === ''));
                    tableHtml += '<tr>' + tds.map(c => `<td>${formatInlineMarkdown(c.trim())}</td>`).join('') + '</tr>';
                }
                tableHtml += '</tbody></table></div>';
                html.push(tableHtml);
            }
            tableRows = [];
            inTable = false;
        }
    }

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();

        // Línea vacía
        if (!trimmed) {
            flushTable();
            flushList();
            flushBlockquote();
            continue;
        }

        // Regla horizontal (separador)
        if (/^(\-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
            flushTable();
            flushList();
            flushBlockquote();
            html.push('<hr class="doc-divider">');
            continue;
        }

        // Fila de tabla
        if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
            flushList();
            flushBlockquote();
            inTable = true;
            tableRows.push(trimmed);
            continue;
        } else if (inTable) {
            flushTable();
        }

        // Citas / Blockquotes
        if (trimmed.startsWith('>')) {
            flushTable();
            flushList();
            inBlockquote = true;
            blockquoteLines.push(formatInlineMarkdown(trimmed.replace(/^>\s*/, '')));
            continue;
        } else if (inBlockquote) {
            flushBlockquote();
        }

        // Encabezados
        if (trimmed.startsWith('### ')) {
            flushTable();
            flushList();
            headingCount++;
            const id = `section-${headingCount}`;
            const title = formatInlineMarkdown(trimmed.substring(4));
            html.push(`<h3 id="${id}" class="doc-heading level-3">${title}</h3>`);
            continue;
        }
        if (trimmed.startsWith('## ')) {
            flushTable();
            flushList();
            headingCount++;
            const id = `section-${headingCount}`;
            const title = formatInlineMarkdown(trimmed.substring(3));
            html.push(`<h2 id="${id}" class="doc-heading level-2">${title}</h2>`);
            continue;
        }
        if (trimmed.startsWith('# ')) {
            flushTable();
            flushList();
            const title = formatInlineMarkdown(trimmed.substring(2));
            html.push(`<h1>${title}</h1>`);
            continue;
        }

        // Listas desordenadas
        if (/^[-*]\s+/.test(trimmed)) {
            flushTable();
            if (inOl) { html.push('</ol>'); inOl = false; }
            if (!inUl) { html.push('<ul>'); inUl = true; }
            html.push(`<li>${formatInlineMarkdown(trimmed.replace(/^[-*]\s+/, ''))}</li>`);
            continue;
        }

        // Listas numeradas
        if (/^\d+\.\s+/.test(trimmed)) {
            flushTable();
            if (inUl) { html.push('</ul>'); inUl = false; }
            if (!inOl) { html.push('<ol>'); inOl = true; }
            html.push(`<li>${formatInlineMarkdown(trimmed.replace(/^\d+\.\s+/, ''))}</li>`);
            continue;
        }

        // Texto regular
        flushList();
        html.push(`<p>${formatInlineMarkdown(trimmed)}</p>`);
    }

    flushTable();
    flushList();
    flushBlockquote();

    return html.join('\n');
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
    const logoEl = document.getElementById('doc-app-logo');

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
            if (policyId.includes('pemtree') || policyId.includes('web')) {
                platformEl.textContent = 'Web App Oficial (Netlify)';
            } else if (policyId.includes('googleplay')) {
                platformEl.textContent = 'Google Play (Android)';
            } else if (policyId.includes('microsoftstore')) {
                platformEl.textContent = 'Microsoft Store (Windows)';
            } else {
                platformEl.textContent = 'Documento Oficial';
            }
        }

        if (logoEl) {
            if (policyId.includes('pemtree')) {
                logoEl.src = './assets/Logo Trébol Asociados_sinFondo.png';
                logoEl.alt = 'PEMTREE';
            } else if (policyId.includes('googleplay') || policyId.includes('microsoftstore') || policyId.includes('samnu')) {
                logoEl.src = './assets/Logo SANMU - 71x71.png';
                logoEl.alt = 'SANMU';
            } else {
                logoEl.src = './assets/Logo Trébol Asociados_sinFondo.png';
                logoEl.alt = 'Trébol Asociados';
            }
        }

        const mdResponse = await fetch(`./politicas/${policyId}.md`);
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
                    <a href="./index.html" class="back-btn" style="margin-top: 16px; display: inline-flex;">← Volver</a>
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

// Menús y submenús móviles interactivos
function setupMobileSubmenus() {
    // 1. Submenú de herramientas en barra superior
    const menuBtn = document.getElementById('mobile-menu-btn');
    const submenu = document.getElementById('mobile-submenu');
    const mobileCopyBtn = document.getElementById('mobile-copy-btn');
    const mobilePrintBtn = document.getElementById('mobile-print-btn');

    if (menuBtn && submenu) {
        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            submenu.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (!submenu.contains(e.target) && e.target !== menuBtn) {
                submenu.classList.remove('active');
            }
        });
    }

    if (mobileCopyBtn) {
        mobileCopyBtn.addEventListener('click', () => {
            if (submenu) submenu.classList.remove('active');
            const copyBtn = document.getElementById('copy-link-btn');
            if (copyBtn) copyBtn.click();
            else {
                navigator.clipboard.writeText(window.location.href);
                alert('Enlace copiado al portapapeles');
            }
        });
    }

    if (mobilePrintBtn) {
        mobilePrintBtn.addEventListener('click', () => {
            if (submenu) submenu.classList.remove('active');
            window.print();
        });
    }

    // 2. Acordeón plegable para Tabla de Contenidos (TOC) en modo móvil/tableta
    const tocHeader = document.getElementById('toc-header');
    const tocSidebar = document.getElementById('toc-sidebar');
    const tocList = document.getElementById('toc-list');

    if (tocHeader && tocSidebar) {
        tocHeader.addEventListener('click', () => {
            tocSidebar.classList.toggle('expanded');
            const isExp = tocSidebar.classList.contains('expanded');
            tocHeader.setAttribute('aria-expanded', isExp);
        });

        if (tocList) {
            tocList.addEventListener('click', (e) => {
                if (e.target.tagName === 'A' || e.target.closest('a')) {
                    if (window.innerWidth <= 900) {
                        tocSidebar.classList.remove('expanded');
                        tocHeader.setAttribute('aria-expanded', 'false');
                    }
                }
            });
        }
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
    setupMobileSubmenus();
});
