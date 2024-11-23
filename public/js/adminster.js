document.addEventListener('DOMContentLoaded', function() {
    const toggleIcons = document.querySelectorAll('.toggle-icon');
    
    toggleIcons.forEach(icon => {
        icon.addEventListener('click', function() {
            const familyAttribute = this.closest('.family-attribute'); 
            const peopleSections = familyAttribute.querySelectorAll('.family-attribute--people'); 
            const fix = familyAttribute.querySelector('.fa-wrench');
            const plus = familyAttribute.querySelector('.fa-plus');
            const hmm = familyAttribute.querySelector('.family-attribute--headers');

            peopleSections.forEach(peopleSection => {
                peopleSection.classList.toggle('hide'); 
            });
            
            if (fix) fix.classList.toggle('hide');
            if (hmm) hmm.classList.toggle('hide');
            if (plus) plus.classList.toggle('hide');

            if (this.classList.contains('fa-chevron-down')) {
                this.classList.remove('fa-chevron-down');
                this.classList.add('fa-chevron-right');
            } else {
                this.classList.remove('fa-chevron-right');
                this.classList.add('fa-chevron-down');
            }
        });
    });

    const plusIcons = document.querySelectorAll('.fa-plus');
    
    plusIcons.forEach(plus => {
        plus.addEventListener('click', function () {
            const familyAttribute = this.closest('.family-attribute'); 
            const fid = familyAttribute.getAttribute('data-fid'); 
            
            window.location.href = `/main/add/${fid}`; 
        });
    });

    const wrenchIcons = document.querySelectorAll('.fa-wrench');
    
    wrenchIcons.forEach(wrench => {
        wrench.addEventListener('click', function () {
            const people = this.closest('.family-attribute--people');
            const id = people.getAttribute('id');  
            const type = people.getAttribute('data-type');

            if (type === '학생') {
                window.location.href = `/main/edit/student/${id}`; 
            } else if (type === '부모') {
                window.location.href = `/main/edit/parent/${id}`; 
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

