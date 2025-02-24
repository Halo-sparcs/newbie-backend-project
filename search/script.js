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
  
    function fetchPosts(page, query, type) {
      if (query === "") {
        return Promise.resolve([]);
      }
      if (type === "post") {
        fetch('posts/search/' + query + '/' + page)
        .then(response => {return response.json();})
      }
      if (type === "user") {
        fetch('users/byname/' + query)
        .then(response => {return response.json();})
      }
      return Promise.resolve([]);
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
  