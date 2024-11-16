document.addEventListener('DOMContentLoaded', function() {
    const toggleIcons = document.querySelectorAll('.toggle-icon');
    
    toggleIcons.forEach(icon => {
        icon.addEventListener('click', function() {
            const familyAttribute = this.closest('.family-attribute'); 
            const peopleSections = familyAttribute.querySelectorAll('.family-attribute--people'); 
            const plus = familyAttribute.querySelector('.fa-plus');
            const fix = familyAttribute.querySelector('.fa-wrench');
        
            peopleSections.forEach(peopleSection => {
                peopleSection.classList.toggle('hide'); 
            });
            
            if (this.classList.contains('fa-chevron-down')) {
                this.classList.remove('fa-chevron-down');
                this.classList.add('fa-chevron-right');
                plus.style.display = 'inline';
                fix.style.display = 'inline'; 
            } else {
                this.classList.remove('fa-chevron-right');
                this.classList.add('fa-chevron-down');
                plus.style.display = 'none';  
                fix.style.display = 'none';
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const logoutButton = document.querySelector('.header-logout');

    logoutButton.addEventListener('click', function() {
        fetch('/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (response.ok) {
                window.location.href = '/';
            } else {
                alert('로그아웃 실패');
            }
        })
        .catch(error => {
            console.error('로그아웃 중 오류 발생:', error);
            alert('로그아웃 실패');
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const addFamilyButton = document.querySelector('.header-add');

    addFamilyButton.addEventListener('click', function() {
        window.location.href = '/main/add';
    })
});

