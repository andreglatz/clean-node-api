import { adaptResolver } from '@/main/adapters';
import { makeLoginController } from '@/main/factories/controllers/login/login/login-controller-factory';
import { makeSignUpController } from '@/main/factories/controllers/login/signup/signup-controller-factory';

export default {
  Query: {
    login: async (parent: any, args: any) => adaptResolver(makeLoginController(), args),
  },

  Mutation: {
    signup: async (parent: any, args: any) => adaptResolver(makeSignUpController(), args),
  },
};
