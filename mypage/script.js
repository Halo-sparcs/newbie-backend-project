document.addEventListener("DOMContentLoaded", function() {
    // 쿠키에서 특정 이름의 값을 읽어오는 헬퍼 함수
    function getCookie(name) {
      const value = "; " + document.cookie;
      const parts = value.split("; " + name + "=");
      if (parts.length === 2) return parts.pop().split(";").shift();
    }
  
    // 쿠키에서 내 id를 가져온다고 가정 (쿠키 이름: "user_id")
    const myUserId = getCookie("user_id");
    if (false && !myUserId) {
      alert("로그인이 필요합니다.");
      // 로그인이 필요한 페이지라면 로그인 페이지로 리다이렉트
      window.location.href = "../login.html";
      return;
    }
  
    // 백엔드에서 내 정보를 가져오는 모의 함수
    // 실제 구현에서는 fetch()로 API를 호출합니다.
    function fetchMyInfo(userId) {
      return new Promise((resolve) => {
        // 예시 데이터: user_id, user_pwd, username, contact, score
        const myInfo = {
          user_id: userId,
          user_pwd: "password123",  // 실제 환경에서는 비밀번호 노출은 X. 예시는 간단히 처리
          username: "홍길동",
          contact: "010-1234-5678",
          score: 85
        };
        setTimeout(() => resolve(myInfo), 300);
      });
    }
  
    // 내 정보를 화면에 렌더링하는 함수
    function renderMyInfo(info) {
      document.getElementById("user_id").value = info.user_id;
      document.getElementById("user_pwd").value = info.user_pwd;
      document.getElementById("username").value = info.username;
      document.getElementById("contact").value = info.contact;
      document.getElementById("score").value = info.score;
    }
  
    // 내 정보 수정 요청을 보내는 모의 함수 (실제 구현 시 API 호출)
    function updateMyInfo(updatedInfo) {
      return new Promise((resolve, reject) => {
        // 예시: 500ms 후 성공 응답
        setTimeout(() => {
          // score는 수정 불가능하므로 서버는 기존 점수를 그대로 유지합니다.
          resolve({ success: true });
        }, 500);
      });
    }
  
    // 내 정보 로드
    fetchMyInfo(myUserId)
      .then(info => {
        renderMyInfo(info);
      })
      .catch(error => {
        console.error("내 정보 로드 실패:", error);
        alert("내 정보를 불러오는 데 실패했습니다.");
      });
  
    // 폼 제출 이벤트 (내 정보 수정)
    const mypageForm = document.getElementById("mypage-form");
    mypageForm.addEventListener("submit", function(e) {
      e.preventDefault();
  
      // 수정 가능한 정보만 추출
      const updatedInfo = {
        user_id: document.getElementById("user_id").value,  // 변경 불가능할 수도 있음
        user_pwd: document.getElementById("user_pwd").value,
        username: document.getElementById("username").value,
        contact: document.getElementById("contact").value
        // score는 수정 불가능하므로 포함하지 않음
      };
  
      updateMyInfo(updatedInfo)
        .then(response => {
          if (response.success) {
            alert("내 정보가 성공적으로 수정되었습니다.");
            // 수정 후 최신 정보 다시 로드(선택 사항)
            return fetchMyInfo(myUserId);
          } else {
            throw new Error("수정 실패");
          }
        })
        .then(info => {
          renderMyInfo(info);
        })
        .catch(error => {
          console.error("내 정보 수정 실패:", error);
          alert("내 정보 수정에 실패했습니다.");
        });
    });
  });
  