module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    "^prisma/(.*)$": "C:/Users/minzz/OneDrive/바탕 화면/project/src/prisma/$1"  // 'prisma' 경로를 'src/prisma'로 매핑
  },
  roots: ["C:/Users/minzz/OneDrive/바탕 화면/project/src"],  // 테스트할 루트 디렉터리 설정
};
