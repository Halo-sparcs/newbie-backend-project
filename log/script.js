document.addEventListener("DOMContentLoaded", function() {
    // 각 컬럼의 컨테이너 요소
    const borrowedLogsContainer = document.getElementById("borrowed-logs");
    const requestedLogsContainer = document.getElementById("requested-logs");
    const returnRequestedLogsContainer = document.getElementById("return-requested-logs");
  
    // 무한 스크롤 상태 변수 및 마지막 로그 id 저장
    let borrowedLoading = false;
    let requestedLoading = false;
    let returnRequestedLoading = false;
    let borrowedLastId = null;
    let requestedLastId = null;
    let returnRequestedLastId = null;
  
    // --- 모의 API 함수 (실제 구현 시 fetch() 등으로 교체) ---
  
    // 빌린 로그 9개씩 로드 (마지막 로그 id 기준)
    function fetchBorrowedLogs(lastId) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const logs = [];
          let startId = lastId ? parseInt(lastId) + 1 : 1;
          // 예시: 최대 30개 로그
          if (startId > 30) {
            resolve([]);
            return;
          }
          for (let i = 0; i < 9; i++) {
            const id = startId + i;
            if (id > 30) break;
            logs.push({
              logId: id,
              postId: 100 + id,
              amount: Math.floor(Math.random() * 5) + 1,
              borrowedAt: new Date().toLocaleString()
            });
          }
          resolve(logs);
        }, 500);
      });
    }
  
    // 요청된 로그 9개씩 로드
    function fetchRequestedLogs(lastId) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const logs = [];
          let startId = lastId ? parseInt(lastId) + 1 : 1;
          if (startId > 30) {
            resolve([]);
            return;
          }
          for (let i = 0; i < 9; i++) {
            const id = startId + i;
            if (id > 30) break;
            logs.push({
              logId: id,
              postId: 200 + id,
              requester: "User" + (50 + id),
              amount: Math.floor(Math.random() * 5) + 1
            });
          }
          resolve(logs);
        }, 500);
      });
    }
  
    // 반납 신청된 로그 9개씩 로드
    function fetchReturnRequestedLogs(lastId) {
      return new Promise((resolve) => {
        setTimeout(() => {
          const logs = [];
          let startId = lastId ? parseInt(lastId) + 1 : 1;
          // 예시: 최대 20개 로그
          if (startId > 20) {
            resolve([]);
            return;
          }
          for (let i = 0; i < 9; i++) {
            const id = startId + i;
            if (id > 20) break;
            logs.push({
              logId: id,
              borrower: "User" + (id + 10),
              requestedAt: new Date().toLocaleString()
            });
          }
          resolve(logs);
        }, 500);
      });
    }
  
    // 반납 신청(빌린 로그)의 API (기존 함수)
    function sendReturnRequest(logId) {
      return new Promise((resolve) => {
        setTimeout(() => { resolve({ success: true }); }, 300);
      });
    }
  
    // 요청 승인 API (중앙 컬럼)
    function approveRequest(logId) {
      return new Promise((resolve) => {
        setTimeout(() => { resolve({ success: true }); }, 300);
      });
    }
  
    // 요청 거절 API (중앙 컬럼)
    function rejectRequest(logId) {
      return new Promise((resolve) => {
        setTimeout(() => { resolve({ success: true }); }, 300);
      });
    }
  
    // 반납 허가 API (오른쪽 컬럼)
    function sendReturnApproval(logId) {
      return new Promise((resolve) => {
        setTimeout(() => { resolve({ success: true }); }, 300);
      });
    }
  
    // --- 로그 항목 렌더링 함수 ---
  
    function appendBorrowedLogs(logs) {
      logs.forEach(log => {
        const logItem = document.createElement("div");
        logItem.className = "log-item";
        logItem.innerHTML = `
          <div class="log-info">
            <strong>Log ID:</strong> ${log.logId}<br>
            <strong>Post ID:</strong> ${log.postId}<br>
            <strong>Amount:</strong> ${log.amount}<br>
            <strong>Borrowed At:</strong> ${log.borrowedAt}
          </div>
          <div class="log-buttons">
            <button class="return-btn" data-logid="${log.logId}">반납신청</button>
          </div>
        `;
        borrowedLogsContainer.appendChild(logItem);
      });
      if (logs.length > 0) borrowedLastId = logs[logs.length - 1].logId;
    }
  
    function appendRequestedLogs(logs) {
      logs.forEach(log => {
        const logItem = document.createElement("div");
        logItem.className = "log-item";
        logItem.innerHTML = `
          <div class="log-info">
            <strong>Log ID:</strong> ${log.logId}<br>
            <strong>Post ID:</strong> ${log.postId}<br>
            <strong>Requester:</strong> ${log.requester}<br>
            <strong>Amount:</strong> ${log.amount}
          </div>
          <div class="log-buttons">
            <button class="approve-btn" data-logid="${log.logId}">확인</button>
            <button class="reject-btn" data-logid="${log.logId}">거절</button>
          </div>
        `;
        requestedLogsContainer.appendChild(logItem);
      });
      if (logs.length > 0) requestedLastId = logs[logs.length - 1].logId;
    }
  
    function appendReturnRequestedLogs(logs) {
      logs.forEach(log => {
        const logItem = document.createElement("div");
        logItem.className = "log-item";
        logItem.innerHTML = `
          <div class="log-info">
            <strong>Log ID:</strong> ${log.logId}<br>
            <strong>Borrower:</strong> ${log.borrower}<br>
            <strong>Requested At:</strong> ${log.requestedAt}
          </div>
          <div class="log-buttons">
            <button class="return-approval-btn" data-logid="${log.logId}">반납 허가</button>
          </div>
        `;
        returnRequestedLogsContainer.appendChild(logItem);
      });
      if (logs.length > 0) returnRequestedLastId = logs[logs.length - 1].logId;
    }
  
    // --- 무한 스크롤 처리 ---
  
    borrowedLogsContainer.addEventListener("scroll", function() {
      if (borrowedLoading) return;
      if (borrowedLogsContainer.scrollTop + borrowedLogsContainer.clientHeight >= borrowedLogsContainer.scrollHeight - 50) {
        borrowedLoading = true;
        fetchBorrowedLogs(borrowedLastId).then(newLogs => {
          if (newLogs.length > 0) {
            appendBorrowedLogs(newLogs);
          }
          borrowedLoading = false;
        });
      }
    });
  
    requestedLogsContainer.addEventListener("scroll", function() {
      if (requestedLoading) return;
      if (requestedLogsContainer.scrollTop + requestedLogsContainer.clientHeight >= requestedLogsContainer.scrollHeight - 50) {
        requestedLoading = true;
        fetchRequestedLogs(requestedLastId).then(newLogs => {
          if (newLogs.length > 0) {
            appendRequestedLogs(newLogs);
          }
          requestedLoading = false;
        });
      }
    });
  
    returnRequestedLogsContainer.addEventListener("scroll", function() {
      if (returnRequestedLoading) return;
      if (returnRequestedLogsContainer.scrollTop + returnRequestedLogsContainer.clientHeight >= returnRequestedLogsContainer.scrollHeight - 50) {
        returnRequestedLoading = true;
        fetchReturnRequestedLogs(returnRequestedLastId).then(newLogs => {
          if (newLogs.length > 0) {
            appendReturnRequestedLogs(newLogs);
          }
          returnRequestedLoading = false;
        });
      }
    });
  
    // 초기 데이터 로드
    fetchBorrowedLogs(borrowedLastId).then(newLogs => {
      appendBorrowedLogs(newLogs);
    });
    fetchRequestedLogs(requestedLastId).then(newLogs => {
      appendRequestedLogs(newLogs);
    });
    fetchReturnRequestedLogs(returnRequestedLastId).then(newLogs => {
      appendReturnRequestedLogs(newLogs);
    });
  
    // --- 버튼 이벤트 처리 (이벤트 위임) ---
  
    // 빌린 로그의 반납 신청 버튼
    borrowedLogsContainer.addEventListener("click", function(e) {
      if (e.target && e.target.classList.contains("return-btn")) {
        const logId = e.target.getAttribute("data-logid");
        if (confirm("반납 신청하시겠습니까?")) {
          sendReturnRequest(logId).then(response => {
            if (response.success) {
              alert("반납 신청이 완료되었습니다.");
              // 필요 시 해당 로그 항목 업데이트 또는 제거
            } else {
              alert("반납 신청에 실패했습니다.");
            }
          });
        }
      }
    });
  
    // 요청된 로그의 승인/거절 버튼
    requestedLogsContainer.addEventListener("click", function(e) {
      if (e.target && e.target.classList.contains("approve-btn")) {
        const logId = e.target.getAttribute("data-logid");
        if (confirm("요청을 승인하시겠습니까?")) {
          approveRequest(logId).then(response => {
            if (response.success) {
              alert("요청이 승인되었습니다.");
              // 필요 시 항목 업데이트 또는 제거
            } else {
              alert("요청 승인에 실패했습니다.");
            }
          });
        }
      }
      if (e.target && e.target.classList.contains("reject-btn")) {
        const logId = e.target.getAttribute("data-logid");
        if (confirm("요청을 거절하시겠습니까?")) {
          rejectRequest(logId).then(response => {
            if (response.success) {
              alert("요청이 거절되었습니다.");
              // 필요 시 항목 업데이트 또는 제거
            } else {
              alert("요청 거절에 실패했습니다.");
            }
          });
        }
      }
    });
  
    // 반납 신청된 로그의 반납 허가 버튼
    returnRequestedLogsContainer.addEventListener("click", function(e) {
      if (e.target && e.target.classList.contains("return-approval-btn")) {
        const logId = e.target.getAttribute("data-logid");
        if (confirm("반납을 허가하시겠습니까?")) {
          sendReturnApproval(logId).then(response => {
            if (response.success) {
              alert("반납이 허가되었습니다.");
              // 필요 시 항목 업데이트 또는 제거
            } else {
              alert("반납 허가에 실패했습니다.");
            }
          });
        }
      }
    });
  });
  