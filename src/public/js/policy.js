// Convertir markdown simple a HTML
function markdownToHtml(md) {
    let html = md;
    
    // Títulos
    html = html.replace(/^### (.*?)$/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.*?)$/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.*?)$/gm, '<h1>$1</h1>');
    
    // Negritas
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Itálicas
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Enlaces
    html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>');
    
    // Párrafos
    html = html.split('\n\n').map(p => {
        if (p.match(/^<[h|u|o]/)) return p;
        return '<p>' + p.replace(/\n/g, '<br>') + '</p>';
    }).join('\n');
    
    return html;
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

async function setTitleFromPolicies(policyId) {
    try {
        const res = await fetch('./policies.json');
        if (!res.ok) return;
        const data = await res.json();
        const policy = (data.policies || []).find(p => p.id === policyId);
        if (!policy?.name) return;
        document.title = policy.name;
        const titleEl = document.getElementById('page-title');
        if (titleEl) titleEl.textContent = policy.name;
    } catch {
        // no-op
    }
}

// Cargar política
async function loadPolicy() {
    try {
        const params = new URLSearchParams(window.location.search);
        let policyId = params.get('id');
        if (!policyId) policyId = await getDefaultPolicyId();
        if (!policyId) throw new Error('No se encontró ninguna política para mostrar');

        await setTitleFromPolicies(policyId);

        // Cargar el markdown
        const mdResponse = await fetch(`/politicas/${policyId}.md`);
        if (!mdResponse.ok) throw new Error('Política no encontrada');
        const mdContent = await mdResponse.text();

        // Convertir y mostrar
        const policyHtml = markdownToHtml(mdContent);
        const appBrandHtml = `
            <div class="policy-app-brand">
                <img src="./assets/Logo SANMU - 71x71.png" alt="SANMU">
            </div>
        `;
        document.getElementById('content').innerHTML = appBrandHtml + policyHtml;
    } catch (error) {
        document.getElementById('content').innerHTML = `
            <div style="background: #ffebee; color: #c62828; padding: 20px; border-radius: 6px;">
                Error: ${error.message}
            </div>
        `;
    }
}

loadPolicy();
