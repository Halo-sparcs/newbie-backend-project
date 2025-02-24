document.addEventListener("DOMContentLoaded", function() {
    const borrowedLogsContainer = document.getElementById("borrowed-logs");
    const requestedLogsContainer = document.getElementById("requested-logs");
    const returnRequestedLogsContainer = document.getElementById("return-requested-logs");
  
    let borrowedLoading = false;
    let requestedLoading = false;
    let returnRequestedLoading = false;
    let borrowedLastId = null;
    let requestedLastId = null;
    let returnRequestedLastId = null;

    function getCookie(name) {
        const value = "; " + document.cookie;
        const parts = value.split("; " + name + "=");
        if (parts.length === 2) return parts.pop().split(";").shift();
      }
    
      // Cookie -> id
      const myUserId = getCookie("id");
  
    // --- 모의 API 함수 (실제 구현 시 fetch() 등으로 교체) ---
  
    // BorrowedLog
    function fetchBorrowedLogs(myid, lastId) {
      return fetch('borrow/getByBorrower/' + myid + '/'+ lastId)
      .then(response => response.json())
      .catch(error => console.log("error: ", error));
    }
  
    // RequestedLog
    function fetchRequestedLogs(myid, lastId) {
        return fetch('borrow/getByOwner/' + myid + '/' + lastId)
        .then(response => response.json())
        .catch(error => console.log("error: ", error));
    }
  
    // ReturnRequestedLog
    function fetchReturnRequestedLogs(lastId) {
        return fetch('return/returnView/' + myUserId + '/' + lastId)
        .then(response => response.json())
        .catch(error => console.log("error: ", error));
    }
  
    // ReturnRequest
    function sendReturnRequest(ownerId, logId) {
      return fetch('return/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          log_id: logId,
          owner_id: ownerId
        })
      }).then(response => response.json())
      .catch(error => console.log("error: ", error));
    }
  
    // RequestOk
    function approveRequest(logId) {
        return fetch('borrow/'+logId+'/true', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => response.json())
        .catch(error => console.log("error: ", error));
    }
  
    // RequestDeny
    function rejectRequest(logId) {
        return fetch('borrow/'+logId+'/false', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => response.json())
        .catch(error => console.log("error: ", error));
    }
  
    // ReturnConfirmed
    function sendReturnApproval(logId) {
        return fetch('return/'+logId+'/true', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        .then(response => response.json())
        .catch(error => console.log("error: ", error));
    }
  
    // --- 로그 항목 렌더링 함수 ---
  
    function appendBorrowedLogs(logs) {
      logs.forEach(log => {
        const logItem = document.createElement("div");
        logItem.className = "log-item";
        logItem.innerHTML = `
          <div class="log-info">
            <strong>Log ID:</strong> ${log.logId}<br>
            <strong>Owner Id:</strong> ${log.ownerId}<br>
            <strong>Post ID:</strong> ${log.postId}<br>
            <strong>Amount:</strong> ${log.amount}<br>
            <strong>Borrowed At:</strong> ${log.borrowedAt}
          </div>
          <div class="log-buttons">
            <button class="return-btn" data-logid="${log.logId}" data-ownerId="${log.ownerId}">반납신청</button>
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
        fetchBorrowedLogs(myUserId, borrowedLastId).then(newLogs => {
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
        const ownerId = e.target.getAttribute("data-ownerId");
        if (confirm("반납 신청하시겠습니까?")) {
          sendReturnRequest(ownerId, logId).then(response => {
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
  