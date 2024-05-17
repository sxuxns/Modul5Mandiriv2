$(document).ready(function() {
    $('#registerForm').on('submit', function(e) {
        e.preventDefault();

        const username = String($('#username').val());
        const password = String($('#password').val());

        if (username === "" || password === "") {
            Swal.fire({
                icon: 'warning',
                title: 'Warning',
                text: 'All fields are required',
            });
            return;
        }

        $.ajax({
            url: 'https://localhost:7131/register',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ username, password }),
            success: function(response) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Registration successful',
                    showConfirmButton: false,
                    timer: 1500
                }).then(() => {
                    window.location.href = 'login.html';
                });
            },
            error: function(xhr, status, error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Registration failed: ' + xhr.responseText,
                });
            }
        });
    });
});