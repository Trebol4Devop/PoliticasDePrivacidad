function enablePageTransition() {
    requestAnimationFrame(() => {
        document.body.classList.add('is-visible');
    });
}

function setupPolicyNavigationTransition() {
    document.addEventListener('click', (event) => {
        const link = event.target.closest('a.btn-view');
        if (!link) return;

        event.preventDefault();
        const targetUrl = link.getAttribute('href');
        if (!targetUrl) return;

        document.body.classList.remove('is-visible');
        document.body.classList.add('is-transitioning');
        setTimeout(() => {
            window.location.href = targetUrl;
        }, 220);
    });
}

// Cargar políticas
async function loadPolicies() {
    try {
        const response = await fetch('policies.json');
        const data = await response.json();

        const container = document.getElementById('policies-container');
        container.innerHTML = '';

        if (data.policies.length === 0) {
            container.innerHTML = '<p style="color: #999; text-align: center; padding: 40px;">No hay políticas disponibles</p>';
            return;
        }

        data.policies.forEach(policy => {
            const html = `
                <div class="policy-item">
                    <div class="policy-info">
                        <div class="policy-name">${policy.name}</div>
                        <div class="policy-meta">
                            ${policy.signed ? `Firmada el ${new Date(policy.signature.timestamp).toLocaleDateString('es-ES')}` : 'Sin firma'}
                        </div>
                    </div>
                    <div class="policy-status">
                        <div class="signature-badge ${policy.signed ? 'verified' : 'pending'}">
                            ${policy.signed ? 'Firmada' : 'Sin firma'}
                        </div>
                        <div class="btn-group">
                            <a href="policy.html?id=${policy.id}" class="btn btn-view">Ver</a>
                        </div>
                    </div>
                </div>
            `;
            container.innerHTML += html;
        });

        // Actualizar fecha
        document.getElementById('last-update').textContent = new Date(data.generatedAt).toLocaleDateString('es-ES');
    } catch (error) {
        document.getElementById('policies-container').innerHTML = `
            <div class="error">
                Error al cargar las políticas: ${error.message}
            </div>
        `;
    }
}

// Cargar al iniciar
loadPolicies();
setupPolicyNavigationTransition();
enablePageTransition();
