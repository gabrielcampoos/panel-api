import * as bcryptLib from 'bcrypt';
import { bcryptEnvs } from '../../envs';

class BcryptAdater {
	// gerar Hash - utilização: CADASTRO DO USUARIO
	async generateHash(text: string): Promise<string> {
		const salt = await bcryptLib.genSalt(Number(bcryptEnvs.salt));
		const hash = await bcryptLib.hash(text, salt);
		return hash;
	}

	// comparar hash com texto - ex: LOGIN DO USUARIO
	async compareHash(text: string, hash: string): Promise<boolean> {
		const isEqual = await bcryptLib.compare(text, hash);
		return isEqual;
	}
}

export const bcrypt = new BcryptAdater();
