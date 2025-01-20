const axios = require("axios");

exports.test = async (req, res, next) => {
  try {
    if (!req.session.jwt) {
      // 토큰 먼저 발급
      const tokenResult = await axios.post("http://localhost:8002/v1/token", {
        clientSecret: process.env.CLIENT_SECRET,
      });
      if (tokenResult.data?.code === 200) {
        req.session.jwt = tokenResult.data.token; // 토큰을 세션에 저장
      } else {
        return res.status(tokenResult.data?.code).json(tokenResult.data);
      }
    }
    // 세션에 저장된 토큰이 있으면 그걸 사용해서 토큰이 정상적인지 테스트
    const result = await axios.get("http://localhost:8002/v1/test", {
      headers: { authorization: req.session.jwt },
    });
    return res.json(result.data);
  } catch (error) {
    console.error(error);
    // 토큰이 정상적인지 테스트 에서 에러인 경우
    if (error.response?.status === 419) {
      return res.json(error.response.data);
    }
    return next(error);
  }
};
