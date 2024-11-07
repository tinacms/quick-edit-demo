import { AbstractAuthProvider } from 'tinacms'

export class MockAuthProvider extends AbstractAuthProvider {
  constructor() {
    super()
  }
  async authenticate(props?: {}): Promise<any> {
  }

  async getToken() {
    return {
        id_token: 'id_token',
    }
  }

  async getUser() {
    return true;
  }

  async logout() {
  }

}