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
  
    // 폼 제출 이벤트 (실제 작업 시 백엔드와 연동)
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      alert('Logging in...');
      // 여기에 로그인 처리 코드를 추가
    });
  
    signupForm.addEventListener('submit', function(e) {
      e.preventDefault();
      alert('Signing up...');
      // 여기에 회원가입 처리 코드를 추가
    });
  });
  