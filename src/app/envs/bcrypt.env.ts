import 'dotenv/config';

export const bcryptEnvs = {
	salt: process.env.BCRYPT_SALT as string,
};
