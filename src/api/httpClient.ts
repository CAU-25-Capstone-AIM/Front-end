import axios from 'axios';

const baseURL =
  import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080';

export const httpClient = axios.create({
  baseURL,
  timeout: 10000,
});

// 향후 공통 헤더나 인터셉터 설정을 위한 자리입니다.
// httpClient.interceptors.request.use((config) => {
//   // 예: 인증 토큰 등을 주입
//   // return config;
// });
//
// httpClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     // 예: 공통 에러 로깅/알림 처리
//     // return Promise.reject(error);
//   }
// );

