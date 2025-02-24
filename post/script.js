document.addEventListener("DOMContentLoaded", function() {
  // 쿠키에서 특정 이름의 값을 읽어오는 헬퍼 함수
  function getCookie(name) {
    const value = "; " + document.cookie;
    const parts = value.split("; " + name + "=");
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  }

  // URL 쿼리 파라미터에서 id 추출
  const params = new URLSearchParams(window.location.search);
  const postId = params.get("id");

  if (!postId) {
    alert("게시글 ID가 제공되지 않았습니다.");
    return;
  }

  // 백엔드에서 post 상세 정보를 가져오는 모의 함수
  function fetchPostDetail(id) {
    return new Promise((resolve, reject) => {
      // 예시 데이터 (owner, title, image(AWS key), content, amount)
      const postData = {
        id: id,
        owner: "User1", // 이 값과 쿠키에 저장된 내 id가 같으면 수정/삭제 가능
        title: "Sample Post Title",
        image: "https://via.placeholder.com/600x400?text=Post+Image", // 실제 AWS 이미지 URL 사용
        content: "이 게시글의 내용입니다. 자세한 정보를 여기서 확인할 수 있습니다.",
        amount: 100
      };
      resolve(postData);
    });
  }

  // post 상세 정보를 페이지에 렌더링하는 함수 (편집 모드가 아닐 때)
  function renderPostDetail(post) {
    const postDetailEl = document.getElementById("post-detail");
    postDetailEl.innerHTML = "";

    const titleEl = document.createElement("h2");
    titleEl.textContent = post.title;

    const ownerEl = document.createElement("p");
    ownerEl.textContent = "Owner: " + post.owner;

    const imageEl = document.createElement("img");
    imageEl.src = post.image;
    imageEl.alt = post.title;

    const contentEl = document.createElement("p");
    contentEl.textContent = post.content;

    const amountEl = document.createElement("p");
    amountEl.textContent = "Amount: " + post.amount;

    postDetailEl.appendChild(titleEl);
    postDetailEl.appendChild(ownerEl);
    postDetailEl.appendChild(imageEl);
    postDetailEl.appendChild(contentEl);
    postDetailEl.appendChild(amountEl);
  }

  // 수정/삭제 버튼들을 추가하는 함수 (내 id와 post.owner가 일치할 때)
  function addEditControls(post) {
    const postDetailEl = document.getElementById("post-detail");
    const editControlsDiv = document.createElement("div");
    editControlsDiv.id = "edit-controls";
    editControlsDiv.style.marginTop = "1rem";

    const editButton = document.createElement("button");
    editButton.textContent = "수정하기";
    editButton.addEventListener("click", function() {
      enterEditMode(post);
    });

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "삭제하기";
    deleteButton.style.marginLeft = "1rem";
    deleteButton.addEventListener("click", function() {
      if (confirm("정말 이 게시글을 삭제하시겠습니까?")) {
        deletePost(post.id)
          .then(response => {
            if (response.success) {
              alert("게시글이 삭제되었습니다.");
              window.location.href = "../index.html"; // 메인 페이지로 이동
            } else {
              alert("게시글 삭제에 실패했습니다.");
            }
          })
          .catch(error => {
            console.error("게시글 삭제 중 오류:", error);
            alert("게시글 삭제 중 오류가 발생했습니다.");
          });
      }
    });

    editControlsDiv.appendChild(editButton);
    editControlsDiv.appendChild(deleteButton);
    postDetailEl.appendChild(editControlsDiv);
  }

  // 편집 모드로 전환하여 수정 가능한 폼으로 변환하는 함수
  function enterEditMode(post) {
    const postDetailEl = document.getElementById("post-detail");
    // 편집 폼 생성 (owner는 수정 불가능)
    const form = document.createElement("form");
    form.id = "edit-form";
    form.innerHTML = `
      <div>
        <label>Title:</label>
        <input type="text" id="edit-title" value="${post.title}">
      </div>
      <div>
        <label>Image URL:</label>
        <input type="text" id="edit-image" value="${post.image}">
      </div>
      <div>
        <label>Content:</label>
        <textarea id="edit-content">${post.content}</textarea>
      </div>
      <div>
        <label>Amount:</label>
        <input type="number" id="edit-amount" value="${post.amount}">
      </div>
      <button type="submit">수정 완료</button>
      <button type="button" id="cancel-edit">취소</button>
    `;
    // 기존 내용 교체
    postDetailEl.innerHTML = "";
    postDetailEl.appendChild(form);

    // 수정 완료 처리
    form.addEventListener("submit", function(e) {
      e.preventDefault();
      const updatedPost = {
        id: post.id,
        title: document.getElementById("edit-title").value,
        image: document.getElementById("edit-image").value,
        content: document.getElementById("edit-content").value,
        amount: document.getElementById("edit-amount").value,
        owner: post.owner // 수정 불가
      };

      updatePost(updatedPost)
        .then(response => {
          if (response.success) {
            alert("게시글이 수정되었습니다.");
            // 수정 후 최신 정보를 다시 로드
            fetchPostDetail(post.id)
              .then(newPost => {
                renderPostDetail(newPost);
                const myUserId = getCookie("user_id");
                if (myUserId === newPost.owner) {
                  addEditControls(newPost);
                }
              });
          } else {
            alert("게시글 수정에 실패했습니다.");
          }
        })
        .catch(error => {
          console.error("게시글 수정 중 오류:", error);
          alert("게시글 수정 중 오류가 발생했습니다.");
        });
    });

    // 취소 버튼 처리: 편집 모드 취소 시 원래 상태로 복구
    document.getElementById("cancel-edit").addEventListener("click", function() {
      renderPostDetail(post);
      const myUserId = getCookie("user_id");
      if (myUserId === post.owner) {
        addEditControls(post);
      }
    });
  }

  // 대여 요청 API를 호출하는 모의 함수
  function sendRentalRequest(postId, rentalAmount) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({ success: true });
      }, 500);
    });
  }

  // 모의 updatePost 함수 (실제 구현 시 API 호출)
  function updatePost(updatedPost) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({ success: true });
      }, 500);
    });
  }

  // 모의 deletePost 함수 (실제 구현 시 API 호출)
  function deletePost(postId) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve({ success: true });
      }, 500);
    });
  }

  // post 상세 정보 로드 및 렌더링
  fetchPostDetail(postId)
    .then(postData => {
      renderPostDetail(postData);
      // 쿠키에 저장된 내 id와 post.owner가 동일하면 수정/삭제 버튼 추가
      const myUserId = getCookie("user_id");
      if (myUserId && myUserId === postData.owner) {
        addEditControls(postData);
      }
    })
    .catch(error => {
      console.error("게시글 정보를 가져오는 중 오류 발생:", error);
    });

  // 대여 요청 버튼 이벤트 처리 (수정 전 기존 코드)
  const rentalButton = document.getElementById("rental-button");
  rentalButton.addEventListener("click", function() {
    const rentalAmountInput = document.getElementById("rental-amount");
    const rentalAmount = rentalAmountInput.value.trim();

    if (!rentalAmount || isNaN(rentalAmount) || rentalAmount <= 0) {
      alert("대여 수량을 올바르게 입력해주세요.");
      return;
    }

    sendRentalRequest(postId, rentalAmount)
      .then(response => {
        if (response.success) {
          alert("대여 요청이 성공적으로 전송되었습니다.");
        } else {
          alert("대여 요청 전송에 실패했습니다.");
        }
      })
      .catch(error => {
        console.error("대여 요청 처리 중 오류:", error);
        alert("대여 요청 중 오류가 발생했습니다.");
      });
  });
});
