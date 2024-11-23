document.addEventListener('DOMContentLoaded', function() {
    const formContainer = document.querySelector('.form-container')
    const backButton = document.querySelector('.back-btn');
    const deleteButton = document.querySelector('.delete-btn');

    const form = document.querySelector('form');
    const id = form.action.split('/').pop();

    backButton.addEventListener('click', function(event) {
        event.preventDefault(); 
        window.location.href = '/main'; 
    });

    deleteButton.addEventListener('click', function (event) {
        event.preventDefault();

    
        const type = form.querySelector('select').value;
        const rType = type === 'student' ? 'student' : 'parent';


        fetch(`/main/edit/${rType}/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ type: rType }), 
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    alert('삭제가 완료되었습니다.');
                    window.location.href = '/main';
                } else {
                    alert('삭제 중 오류가 발생했습니다.');
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('삭제 중 오류가 발생했습니다.');
            });
    });

    formContainer.addEventListener('click', function(event) {
        if (event.target && event.target.classList.contains('add-btn')) {
            event.preventDefault();

            const name = form.querySelector('[name="name"]').value;
            const rrn = form.querySelector('[name="rrn"]').value;
            const device_token = form.querySelector('[name="device_token"]').value;
            const type = form.querySelector('select').value;

            const rType = type === 'student' ? "student" : "parent";

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
                type: type
            };

            fetch(`/main/edit/${rType}/${id}`, {
                method: 'PUT',
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
                    alert("수정 중 오류가 발생했습니다.");
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert("수정 중 오류가 발생했습니다.");
            });
        }
    });
});
