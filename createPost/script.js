document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("create-post-form");
  
    form.addEventListener("submit", function(e) {
      e.preventDefault();
  
      const title = document.getElementById("title").value.trim();
      const content = document.getElementById("content").value.trim();
      const amount = document.getElementById("amount").value.trim();
      const imageFile = document.getElementById("image").files[0];
  
      if (!title || !content || !amount || !imageFile) {
        alert("모든 필드를 입력해주세요.");
        return;
      }
  
      // 1. 서버로부터 presigned URL 요청
      getPresignedUrl(imageFile.name, imageFile.type)
        .then(data => {
          // data: { url: presignedUrl, key: imageKey }
          const { url, key } = data;
          // 2. S3에 이미지 업로드 (PUT 요청)
          return uploadImageToS3(url, imageFile).then(() => key);
        })
        .then(imageKey => {
          // 3. 포스트 데이터를 서버에 전송하여 포스트 생성
          const postData = {
            title: title,
            content: content,
            amount: amount,
            image: imageKey // 서버에 저장할 이미지 URL 또는 key
          };
          return createPost(postData);
        })
        .then(response => {
          if (response.success) {
            alert("게시글이 생성되었습니다.");
            window.location.href = "../index.html";
          } else {
            alert("게시글 생성에 실패했습니다.");
          }
        })
        .catch(error => {
          console.error("Error:", error);
          alert("오류가 발생했습니다.");
        });
    });
  
    // 모의 함수: presigned URL 요청 (실제 구현 시 fetch() 사용)
    function getPresignedUrl(fileName, fileType) {
      return new Promise((resolve, reject) => {
        // 실제 구현 시, 서버 API를 호출하여 presigned URL과 이미지 key를 받아옵니다.
        setTimeout(() => {
          resolve({
            url: "https://your-s3-bucket.s3.amazonaws.com/" + fileName + "?presigned_params",
            key: "https://your-s3-bucket.s3.amazonaws.com/" + fileName
          });
        }, 500);
      });
    }
  
    // 모의 함수: 이미지 업로드 to S3 (실제 구현 시, fetch()의 PUT 요청)
    function uploadImageToS3(presignedUrl, file) {
      return fetch(presignedUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type
        },
        body: file
      }).then(response => {
        if (!response.ok) {
          throw new Error("S3 업로드 실패");
        }
        return response;
      });
    }
  
    // 모의 함수: create post API 호출 (실제 구현 시, 서버에 포스트 데이터를 전송)
    function createPost(postData) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve({ success: true });
        }, 500);
      });
    }
  });
  