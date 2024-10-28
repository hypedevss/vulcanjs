import { Keypair, Keystore, VulcanJwtRegister } from "hebece";
export default async () =>{
	async function generateNewKeypair() {
		const keypair = await (new Keypair()).init();
		const kpStore = new Keystore('./auth/keypair.json', false);
		const keystore = new Keystore('./auth/keystore.json', true);
		kpStore.set('keypair', keypair);
		// register keypair
		const registerkp = await (new VulcanJwtRegister(keypair, keystore.get('apRaw'), keystore.get('student').index)).init();
		kpStore.set(`restUrl`, registerkp.Envelope.RestURL);
		return {
			kp: keypair,
			ou: registerkp,
			rest: registerkp.Envelope.RestURL,
			err: null
		};
	}
	async function useCurrentKeypair() {
		const kpStore = new Keystore('./auth/keypair.json', false);
		const keypair = kpStore.get('keypair');
		return {
			kp: keypair,
			rest: kpStore.get('restUrl'),
			err: null
		};
	}
	const kpStore = new Keystore('./auth/keypair.json', false);
	const keystore = new Keystore('./auth/keystore.json', true);
	const keypair = kpStore.has('keypair');
	if (!keystore.has('apRaw') && !keystore.has('student')) {
		return {
			kp: null,
			rest: null,
			err: 1
		};
	}
	if (keypair) {
		return await useCurrentKeypair();
	} else {
		return await generateNewKeypair();
	}

};