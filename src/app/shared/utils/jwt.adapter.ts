import jwtLib from 'jsonwebtoken';
import { jwtEnvs } from '../../envs';

class JWTAdapter {
	// criar o token - utilização: LOGIN USER
	public encoded(dados: any): string {
		return jwtLib.sign(dados, jwtEnvs.secret, { expiresIn: jwtEnvs.expireIn });
	}

	// extrair o payload (objeto js) - utilização: QUALQUER ROTA PRIVADA
	public decoded(token: string): any {
		return jwtLib.verify(token, jwtEnvs.secret);
	}
}

export const jwt = new JWTAdapter();
