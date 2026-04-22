
import { auth } from '../src/auth/better-auth';

async function run() {
    console.log('API_METHODS:', Object.keys(auth.api).filter(k => !k.startsWith('_')));
}
run();
