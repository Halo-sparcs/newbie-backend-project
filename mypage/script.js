document.addEventListener("DOMContentLoaded", function() {
    function getCookie(name) {
      const value = "; " + document.cookie;
      const parts = value.split("; " + name + "=");
      if (parts.length === 2) return parts.pop().split(";").shift();
    }
  
    // Cookie -> id
    const myUserId = getCookie("id");
    if (!myUserId) {
      alert("로그인이 필요합니다.");
      window.location.href = "../login.html";
      return;
    }
  
    // get my info by id
    function fetchMyInfo(userId) {
      return fetch('users/' + userId).then(response => response.json());
    }
  
    // render info
    function renderMyInfo(info) {
      document.getElementById("user_id").value = info.user_id;
      document.getElementById("user_pwd").value = info.user_pwd;
      document.getElementById("username").value = info.username;
      document.getElementById("contact").value = info.contact;
      document.getElementById("score").value = info.score;
    }
  
    // user update api
    function updateMyInfo(id, updatedInfo) {
      return fetch('users/update/' + id, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData)
      }).then(response => response.json())
      .catch(error => {
        console.log("error: ", error);
      });
    }
  
    // Load info
    fetchMyInfo(myUserId)
      .then(info => {
        renderMyInfo(info);
      })
      .catch(error => {
        console.error("내 정보 로드 실패:", error);
        alert("내 정보를 불러오는 데 실패했습니다.");
      });
  
    // Modify
    const mypageForm = document.getElementById("mypage-form");
    mypageForm.addEventListener("submit", function(e) {
      e.preventDefault();
  
      
      const updatedInfo = {
        user_id: document.getElementById("user_id").value, 
        user_pwd: document.getElementById("user_pwd").value,
        username: document.getElementById("username").value,
        contact: document.getElementById("contact").value
        // score can not be modified
      };
  
      updateMyInfo(myUserId, updatedInfo)
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
  