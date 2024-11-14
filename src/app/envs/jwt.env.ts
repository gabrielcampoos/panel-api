import 'dotenv/config';

export const jwtEnvs = {
	secret: process.env.JWT_SECRET as string,
	expireIn: process.env.JWT_EXPIRE_IN as string,
};
