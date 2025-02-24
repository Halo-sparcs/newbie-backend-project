document.addEventListener("DOMContentLoaded", function() {
  function getCookie(name) {
    const value = "; " + document.cookie;
    const parts = value.split("; " + name + "=");
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  }

  // URL Query Param -> id extract
  const params = new URLSearchParams(window.location.search);
  const postId = params.get("id");

  if (!postId) {
    alert("게시글 ID가 제공되지 않았습니다.");
    return;
  }

  // Post GetByID
  function fetchPostDetail(id) {
    return fetch('posts/byId/' + id).then(response => response.json());
  }

  function getImageUrl(key) {
    return fetch('s3/file-url?key='+key).then(response => response.json().url);
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
    link = getImageUrl(post.image);
    imageEl.src = link;
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
                const myUserId = getCookie("id");
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
      const myUserId = getCookie("id");
      if (myUserId === post.owner) {
        addEditControls(post);
      }
    });
  }

  // 대여 요청 API를 호출
  function sendRentalRequest(postId, postOwner, rentalAmount) {
    return fetch("borrow/create", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        post_id: postId,
        owner_id: postOwner,
        amount: rentalAmount,
    })
    }).then(response => response.json());
  }

  // updatePost  API 호출
  function updatePost(updatedPost) {
    return fetch("posts/update/" + id, {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedPost)
    }).then(response => response.json());
  }

  // deletePost API 호출
  function deletePost(postId) {
    return fetch("posts/delete/" + postId, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      }
    }).then(response => {
      if (!response.ok) {
        throw new Error("게시글 삭제 실패");
      }
      console.log("삭제 성공");
      return response.json();
    });
  }

  // post 상세 정보 로드 및 렌더링
  fetchPostDetail(postId)
    .then(postData => {
      renderPostDetail(postData);
      // 쿠키에 저장된 내 id와 post.owner가 동일하면 수정/삭제 버튼 추가
      const myUserId = getCookie("id");
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

    sendRentalRequest(postId, post.owner, rentalAmount)
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
