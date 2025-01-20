const axios = require("axios");

// exports.test = async (req, res, next) => {
//   try {
//     if (!req.session.jwt) {
//       // 토큰 먼저 발급
//       const tokenResult = await axios.post("http://localhost:8002/v1/token", {
//         clientSecret: process.env.CLIENT_SECRET,
//       });
//       if (tokenResult.data?.code === 200) {
//         req.session.jwt = tokenResult.data.token; // 토큰을 세션에 저장
//       } else {
//         return res.status(tokenResult.data?.code).json(tokenResult.data);
//       }
//     }
//     // 세션에 저장된 토큰이 있으면 그걸 사용해서 토큰이 정상적인지 테스트
//     const result = await axios.get("http://localhost:8002/v1/test", {
//       headers: { authorization: req.session.jwt },
//     });
//     return res.json(result.data);
//   } catch (error) {
//     console.error(error);
//     // 토큰이 정상적인지 테스트 에서 에러인 경우
//     if (error.response?.status === 419) {
//       return res.json(error.response.data);
//     }
//     return next(error);
//   }
// };

const URL = process.env.API_URL;
axios.default.headers.origin = process.env.ORIGIN;

const request = async (req, api) => {
  try {
    if (!req.session.jwt) {
      const tokenResult = await axios.post(`${URL}/token`, {
        clientSecret: process.env.CLIENT_SECRET,
      });
      req.session.jwt = tokenResult.data.token;
    }
    return await axios.get(`${URL}${api}`, {
      headers: { authorization: req.session.jwt },
    });
  } catch (error) {
    if (error.response?.status === 419) {
      delete req.session.jwt;
      return request(req, api); // 토큰 만료 시 재귀함수로 다시 토큰 발급되도록 실행
    }
    // throw error.response; // getMyPosts 또는 searchByHashtag 요청 실패 시 에러 확인 할 수 있도록 throw 를 사용
    return error.response; // 에러가 안나고 호출된 api에서 res.json 으로 넘어가게 됨
  }
};
exports.getMyPosts = async (req, res, next) => {
  try {
    const result = await request(req, "/posts/my");
    res.json(result.data);
  } catch (error) {
    console.error(error);
    next(error);
  }
};
exports.searchByHashtag = async (req, res, next) => {
  try {
    const result = await request(
      req,
      `/posts/hashtag/${encodeURIComponent(req.params.hashtag)}` // 한글 인식하도록
    );
    res.json(result.data);
  } catch (error) {
    console.error(error);
    next(error);
  }
};
