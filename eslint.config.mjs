import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import stylisticTs from '@stylistic/eslint-plugin-ts';

export default tseslint.config(
	...tseslint.configs.stylistic,
	{
		"rules": {
			"@stylistic/ts/semi": "warn"
		},
		plugins: {
			'@stylistic/ts': stylisticTs
		}
	}
  );