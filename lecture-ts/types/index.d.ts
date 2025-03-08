import IUser from "../models/user";
declare global {
  namespace Express {
    // index.ts
    // passport.serializeUser id 타입 오류
    interface User extends IUser {}
  }
  // app.ts
  // status 타입 오류
  interface Error {
    status: number;
  }
}

export {}; // 있어야 인식 할 수 있음
