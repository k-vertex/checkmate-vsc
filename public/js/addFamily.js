document.addEventListener('DOMContentLoaded', function() {
    const formContainer = document.querySelector('.form-container')
    const backButton = document.querySelector('.back-btn');

    backButton.addEventListener('click', function(event) {
        event.preventDefault(); 
        window.location.href = '/main'; 
    });

    formContainer.addEventListener('click', function(event) {
        if (event.target && event.target.classList.contains('add-btn')) {
            event.preventDefault();

            const form = event.target.closest('form');
            const name = form.querySelector('[name="name"]').value;
            const rrn = form.querySelector('[name="rrn"]').value;
            const device_token = form.querySelector('[name="device_token"]').value;
            const type = form.querySelector('select').value;

            const rrnRegex = /^\d{6}-\d{7}$/;
            const rrnError = document.getElementById('rrn-error');
            if (!rrnRegex.test(rrn)) {
                rrnError.style.display = 'inline'; 
                return;
            } else {
                rrnError.style.display = 'none'; 
            }
            
            const data = {
                name: name,
                rrn: rrn,
                device_token: device_token,
                fid: window.fid,
                type: type
            };

            fetch('/main/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    window.location.href = "/main"
                } else {
                    alert("저장 중 오류가 발생했습니다.");
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert("저장 중 오류가 발생했습니다.");
            });
        }
    });
});
