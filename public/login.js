document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const loginData = {
            email: document.getElementById('email').value,
            password: document.getElementById('password').value
        };

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginData)
            });

            const responseData = await response.json();
            if (response.ok) {
                alert(responseData.message);
                window.location.href = '/home.html'; // Redirecione para a página principal após o login
            } else {
                alert(responseData.message);
            }
        } catch (error) {
            console.error('Erro na requisição:', error);
            alert('Erro no login, tente novamente');
        }
    });
});
