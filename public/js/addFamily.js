document.addEventListener('DOMContentLoaded', function() {
    const formContainer = document.querySelector('.form-container');
    const addMemberButton = document.querySelector('.family-plus');
    const backButton = document.querySelector('.back-btn');

    backButton.addEventListener('click', function(event) {
        event.preventDefault(); 
        window.location.href = '/main'; 
    });
    
    addMemberButton.addEventListener('click', function(event) {
        event.preventDefault(); 
        
        const newForm = document.createElement('form');
        newForm.innerHTML = `
            <div class="input-box">
                <input type="text" placeholder="이름" name="name" required>
            </div>
            <div class="input-box">
                <input type="text" placeholder="주민등록번호" name="rrn" required>
            </div>
            <div class="input-box">
                <input type="text" placeholder="기기토큰" name="device_token" required>
            </div>
            <div class="input-box">
                <select>
                    <option value="student">학생</option>
                    <option value="parent">부모</option>
                </select>
            </div>
            <div class="form-btn">
                <button class="btn1" type="button">삭제</button>
                <button class="btn2">저장</button>
            </div>
        `;
        
        formContainer.appendChild(newForm);
        updateDeleteButton();
        updateFormAlignment(); 

        document.querySelector('.form-container').addEventListener('click', (event) => {
            if (event.target && event.target.classList.contains('btn1')) {
                event.preventDefault();  
                const form = event.target.closest('form');
                form.remove();
                updateDeleteButton();  
                updateFormAlignment(); 
            }
        });
    });

    const updateDeleteButton = () => {
        const formCount = document.querySelectorAll('.form-container form').length;
        const deleteButton = document.querySelector('.btn1');

        if (formCount <= 1) {
            deleteButton.disabled = true; 
        } else {
            deleteButton.disabled = false; 
        }
    };

    const updateFormAlignment = () => {
        const forms = formContainer.querySelectorAll('form');
        
        if (forms.length === 1 || forms.length === 2 || forms.length === 3) {
            formContainer.style.justifyContent = 'center'; 
        } else {
            formContainer.style.justifyContent = 'flex-start'; 
        }
    };

    formContainer.addEventListener('click', function(event) {
        if (event.target && event.target.classList.contains('btn2')) {
            event.preventDefault();

            const form = event.target.closest('form');
            const name = form.querySelector('[name="name"]').value;
            const rrn = form.querySelector('[name="rrn"]').value;
            const device_token = form.querySelector('[name="device_token"]').value;
            const type = form.querySelector('select').value;

            console.log(window.fid);

            const data = {
                name: name,
                rrn: rrn,
                device_token: device_token,
                fid: window.fid,
                type: type
            };

            console.log(data);

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
                    window.location.href = "/main";
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
