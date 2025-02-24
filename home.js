document.addEventListener("DOMContentLoaded", function() {
    // 쿠키에서 특정 이름의 값을 가져오는 함수
    function getCookie(name) {
        const cookieArr = document.cookie.split("; ");
        for (let i = 0; i < cookieArr.length; i++) {
            const cookiePair = cookieArr[i].split("=");
            if (cookiePair[0] === name) {
                return cookiePair[1];
            }
        }
        return null;
    }

    // 쿠키에서 access_token이 있는지 확인
    const accessToken = getCookie("access_token");
    const authButtons = document.querySelector('.auth-buttons');

    if (true || accessToken) {
        // 로그인 상태라면 버튼을 "My Page"와 "Log Out"으로 교체
        authButtons.innerHTML = `
          <button class="btn" onclick="window.location.href='mypage/index.html'">My Page</button>
          <button class="btn" onclick="logout()">Log Out</button>
        `;
    }

    // 검색 기능 처리
    const searchModeSelect = document.getElementById('search-mode');
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');

    // 검색 모드 변경에 따른 플레이스홀더 업데이트
    searchModeSelect.addEventListener('change', function() {
        searchInput.placeholder = `Search ${this.value}...`;
    });

    // 검색 버튼 클릭 시, 검색 타입과 검색어를 쿼리 파라미터로 전달하여 searchpage로 이동
    searchButton.addEventListener('click', function() {
        const searchMode = searchModeSelect.value;
        const searchQuery = searchInput.value.trim();
        if (searchQuery === '') {
            alert('Please enter a search term.');
            return;
        }
        // URL 인코딩하여 안전하게 쿼리스트링에 포함
        const url = `search/index.html?type=${encodeURIComponent(searchMode)}&query=${encodeURIComponent(searchQuery)}`;
        window.location.href = url;
    });

    // 엔터키로 검색 실행
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchButton.click();
        }
    });
});

function logout() {}

// // 로그아웃 함수: 쿠키에서 토큰 삭제 후 메인 페이지로 이동
// function logout() {
//     // access_token과 refresh_token 쿠키 삭제 (경로는 설정된 값에 맞게 조정)
//     document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
//     document.cookie = "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
//     // 필요 시 서버 로그아웃 요청 추가
//     window.location.href = 'index.html';
// }
