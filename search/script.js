document.addEventListener("DOMContentLoaded", function() {
    const postsPerPage = 9;
  
    // URL 쿼리 파라미터에서 현재 페이지, 검색어, 타입 읽어오기 (기본값: page=1, query="", type="post")
    const urlParams = new URLSearchParams(window.location.search);
    let currentPage = parseInt(urlParams.get("page"), 10) || 1;
    const currentSearchQuery = urlParams.get("query") || "";
    const currentType = urlParams.get("type") || "post";
  
    // 검색 바 요소들 설정
    const searchInput = document.getElementById("search-input");
    const searchModeSelect = document.getElementById("search-mode");
    const searchButton = document.getElementById("search-button");
  
    // URL 쿼리값을 검색 바에 반영
    searchInput.value = currentSearchQuery;
    searchModeSelect.value = currentType;
    searchInput.placeholder = `Search ${searchModeSelect.value}...`;
  
    // 검색 버튼 클릭 및 엔터키 이벤트 처리 (검색어 입력 시 URL 업데이트 후 1페이지부터 다시 로드)
    searchButton.addEventListener("click", function() {
      const newQuery = searchInput.value.trim();
      const newType = searchModeSelect.value;
      if (newQuery === "") {
        alert("Please enter a search term.");
        return;
      }
      currentPage = 1;
      updateURL(currentPage, newQuery, newType);
      loadPosts(currentPage, newQuery, newType);
    });
  
    searchInput.addEventListener("keypress", function(e) {
      if (e.key === "Enter") {
        searchButton.click();
      }
    });
  
    // URL 쿼리 스트링 업데이트 (pushState 사용)
    function updateURL(page, query, type) {
      const url = new URL(window.location);
      url.searchParams.set("page", page);
      url.searchParams.set("query", query);
      url.searchParams.set("type", type);
      window.history.pushState({}, "", url);
    }
  
    // 백엔드 API 호출 대신 모의 데이터를 반환하는 함수
    function fetchPosts(page, query, type) {
      return new Promise((resolve) => {
        let posts = [];
        // 예시 조건: 검색어와 타입에 따라 페이지마다 다른 데이터를 반환한다고 가정
        if (query !== "") {
          if (page === 1) {
            posts = [
              { id: 1, title: "Post Title 1", owner: "User1", content: "Post 1의 간략한 내용...", amount: 100 },
              { id: 2, title: "Post Title 2", owner: "User2", content: "Post 2의 간략한 내용...", amount: 150 },
              { id: 3, title: "Post Title 3", owner: "User3", content: "Post 3의 간략한 내용...", amount: 200 },
              { id: 4, title: "Post Title 4", owner: "User4", content: "Post 4의 간략한 내용...", amount: 250 },
              { id: 5, title: "Post Title 5", owner: "User5", content: "Post 5의 간략한 내용...", amount: 300 },
              { id: 6, title: "Post Title 6", owner: "User6", content: "Post 6의 간략한 내용...", amount: 350 },
              { id: 7, title: "Post Title 7", owner: "User7", content: "Post 7의 간략한 내용...", amount: 400 },
              { id: 8, title: "Post Title 8", owner: "User8", content: "Post 8의 간략한 내용...", amount: 450 },
              { id: 9, title: "Post Title 9", owner: "User9", content: "Post 9의 간략한 내용...", amount: 500 }
            ];
          } else if (page === 2) {
            // page 2: 9개 미만이면 마지막 페이지로 간주 (예: 2개)
            posts = [
              { id: 10, title: "Post Title 10", owner: "User10", content: "Post 10의 간략한 내용...", amount: 550 },
              { id: 11, title: "Post Title 11", owner: "User11", content: "Post 11의 간략한 내용...", amount: 600 }
            ];
          }
        }
        resolve({ posts: posts });
      });
    }
  
    // 게시글 및 placeholder를 렌더링하는 함수
    function renderPosts(data) {
      const posts = data.posts;
      const postListEl = document.getElementById("post-list");
      postListEl.innerHTML = "";
      posts.forEach(post => {
        const postEl = document.createElement("div");
        postEl.classList.add("post-item");
        postEl.onclick = function() {
          location.href = `../post/index.html?id=${post.id}`;
        };
  
        const titleEl = document.createElement("div");
        titleEl.classList.add("post-title");
        titleEl.textContent = post.title;
  
        // const ownerEl = document.createElement("div");
        // ownerEl.classList.add("post-owner");
        // ownerEl.textContent = "Owner: " + post.owner;
  
        const contentEl = document.createElement("div");
        contentEl.classList.add("post-content");
        contentEl.textContent = post.content;
  
        const amountEl = document.createElement("div");
        amountEl.classList.add("post-amount");
        amountEl.textContent = "Amount: " + post.amount;
  
        postEl.appendChild(titleEl);
        // postEl.appendChild(ownerEl);
        postEl.appendChild(contentEl);
        postEl.appendChild(amountEl);
  
        postListEl.appendChild(postEl);
      });
  
      // 결과가 postsPerPage 미만이면 빈 placeholder로 채워 9칸의 그리드 유지
      for (let i = posts.length; i < postsPerPage; i++) {
        const placeholderEl = document.createElement("div");
        placeholderEl.classList.add("post-item", "placeholder");
        postListEl.appendChild(placeholderEl);
      }
    }
  
    // 이전/다음 버튼만 있는 페이지네이션 렌더링
    function renderPagination(data, query, type) {
      const posts = data.posts;
      const paginationEl = document.getElementById("pagination");
      paginationEl.innerHTML = "";
  
      // 이전 버튼
      const prevEl = document.createElement("a");
      prevEl.href = "#";
      prevEl.innerHTML = "&laquo;";
      prevEl.addEventListener("click", function(e) {
        e.preventDefault();
        if (currentPage > 1) {
          currentPage--;
          updateURL(currentPage, query, type);
          loadPosts(currentPage, query, type);
        }
      });
      if (currentPage === 1) {
        prevEl.style.pointerEvents = "none";
        prevEl.style.opacity = 0.5;
      }
      paginationEl.appendChild(prevEl);
  
      // 다음 버튼
      const nextEl = document.createElement("a");
      nextEl.href = "#";
      nextEl.innerHTML = "&raquo;";
      nextEl.addEventListener("click", function(e) {
        e.preventDefault();
        // 반환된 게시글 수가 postsPerPage이면 다음 페이지가 있을 가능성이 있음
        if (posts.length === postsPerPage) {
          currentPage++;
          updateURL(currentPage, query, type);
          loadPosts(currentPage, query, type);
        }
      });
      if (posts.length < postsPerPage) {
        nextEl.style.pointerEvents = "none";
        nextEl.style.opacity = 0.5;
      }
      paginationEl.appendChild(nextEl);
    }
  
    // 페이지 번호, 검색어, 타입에 따른 게시글 로드 및 렌더링
    function loadPosts(page, query, type) {
      fetchPosts(page, query, type).then(data => {
        renderPosts(data);
        renderPagination(data, query, type);
      });
    }
  
    // 초기 로드: URL 쿼리값에 따라 게시글 로드
    loadPosts(currentPage, currentSearchQuery, currentType);
  });
  