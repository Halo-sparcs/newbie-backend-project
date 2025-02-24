document.addEventListener("DOMContentLoaded", function() {
    const loginBtn = document.getElementById('login-btn');
    const signupBtn = document.getElementById('signup-btn');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
  
    // 토글 버튼 클릭 시 해당 폼 보이기
    loginBtn.addEventListener('click', function() {
      loginBtn.classList.add('active');
      signupBtn.classList.remove('active');
      loginForm.style.display = 'block';
      signupForm.style.display = 'none';
    });
  
    signupBtn.addEventListener('click', function() {
      signupBtn.classList.add('active');
      loginBtn.classList.remove('active');
      signupForm.style.display = 'block';
      loginForm.style.display = 'none';
    });
  
    // Login API
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const loginId = document.getElementById('login-id').value;
      const loginPwd = document.getElementById('login-password').value;
      
      fetch('auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          loginId: loginId,
          loginPwd: loginPwd
        })
      }).then(response => {
        if (response.ok) {
          alert('로그인 성공');
          window.location.href = '/index.html';
        } else {
          alert('로그인 실패');
        }
      })
    });
  
    signupForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const signupId = document.getElementById('signup-id').value;
      const signupPwd = document.getElementById('signup-password').value;
      const signupName = document.getElementById('signup-name').value;
      const signupContact = document.getElementById('signup-contact').value;

      fetch('auth/SignUp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          signupId: signupId,
          signupPwd: signupPwd,
          signupName: signupName,
          signupContact: signupContact
        })
      }).then(response => {
        if (response.ok) {
          alert('회원가입 성공');
          window.location.href = '/login.html';
        } else {
          alert('회원가입 실패');
        }
      })
    });
  });
  