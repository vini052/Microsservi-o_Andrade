document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signupForm');

    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const signupData = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            password: document.getElementById('password').value
        };

        try {
            const response = await fetch('/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(signupData)
            });

            const responseData = await response.json();
            if (response.ok) {
                alert(responseData.message);
                window.location.href = 'index.html';
            } else {
                alert(responseData.message);
            }
        } catch (error) {
            console.error('Erro na requisição:', error);
            alert('Erro no cadastro, tente novamente');
        }
    });
});
