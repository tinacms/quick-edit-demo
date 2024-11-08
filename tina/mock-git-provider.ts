import type { GitProvider } from '@tinacms/graphql';

export interface GitHubProviderOptions {
    owner: string
    repo: string
    token: string
    branch: string
  }
  

  export class MockGitHubProvider implements GitProvider {
    owner: string
    repo: string
    branch: string
  
    constructor(args: GitHubProviderOptions) {
      this.owner = args.owner
      this.repo = args.repo
      this.branch = args.branch
    }
  
    async onPut(key: string, value: string) {
        //This has been intentionally left empty, as we don't want to persist writes.
    }
  
    async onDelete(key: string) {
        //This has been intentionally left empty, as we don't want to persist writes.
    }
  }