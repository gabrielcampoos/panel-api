declare namespace Express {
  interface Request {
    user: {
      id: string;
      name: string;
      role: "admin" | "user";
      active: boolean;
      accessExpiration: Date;
    };
  }
}
