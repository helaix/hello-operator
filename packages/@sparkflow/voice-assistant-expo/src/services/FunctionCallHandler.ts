import axios from 'axios';

export interface FunctionCallConfig {
  linearApiKey: string;
  githubApiKey: string;
  codegenApiKey: string;
}

export class FunctionCallHandler {
  private linearApiKey: string;
  private githubApiKey: string;
  private codegenApiKey: string;

  constructor(config: {
    linearApiKey: string;
    githubApiKey: string;
    codegenApiKey: string;
  }) {
    this.linearApiKey = config.linearApiKey;
    this.githubApiKey = config.githubApiKey;
    this.codegenApiKey = config.codegenApiKey;
  }

  getToolDefinitions() {
    return {
      function_declarations: [
        {
          name: 'get_linear_issues',
          description: 'Get Linear issues with optional filtering',
          parameters: {
            type: 'object',
            properties: {
              team_id: {
                type: 'string',
                description: 'Filter by team ID',
              },
              state: {
                type: 'string',
                description: 'Filter by issue state (e.g., "Todo", "In Progress", "Done")',
              },
              assignee: {
                type: 'string',
                description: 'Filter by assignee name',
              },
              limit: {
                type: 'string',
                description: 'Maximum number of issues to return',
              },
            },
          },
        },
        {
          name: 'create_linear_issue',
          description: 'Create a new Linear issue',
          parameters: {
            type: 'object',
            properties: {
              title: {
                type: 'string',
                description: 'Issue title',
              },
              description: {
                type: 'string',
                description: 'Issue description (optional)',
              },
              team_id: {
                type: 'string',
                description: 'Team ID to create the issue in (optional)',
              },
              priority: {
                type: 'number',
                description: 'Issue priority (1-4, where 1 is highest)',
              },
            },
            required: ['title'],
          },
        },
        {
          name: 'get_github_repos',
          description: 'Get GitHub repositories for the user',
          parameters: {
            type: 'object',
            properties: {
              type: {
                type: 'string',
                description: 'Repository type: "all", "owner", "public", "private", "member"',
                enum: ['all', 'owner', 'public', 'private', 'member'],
              },
              sort: {
                type: 'string',
                description: 'Sort repositories by: "created", "updated", "pushed", "full_name"',
                enum: ['created', 'updated', 'pushed', 'full_name'],
              },
              limit: {
                type: 'number',
                description: 'Maximum number of repositories to return (default: 10)',
              },
            },
          },
        },
        {
          name: 'get_github_issues',
          description: 'Get GitHub issues for a repository',
          parameters: {
            type: 'object',
            properties: {
              owner: {
                type: 'string',
                description: 'Repository owner',
              },
              repo: {
                type: 'string',
                description: 'Repository name',
              },
              state: {
                type: 'string',
                description: 'Issue state: "open", "closed", "all"',
                enum: ['open', 'closed', 'all'],
              },
              assignee: {
                type: 'string',
                description: 'Assignee username (optional)',
              },
              limit: {
                type: 'number',
                description: 'Maximum number of issues to return (default: 10)',
              },
            },
            required: ['owner', 'repo'],
          },
        },
        {
          name: 'create_github_issue',
          description: 'Create a new GitHub issue',
          parameters: {
            type: 'object',
            properties: {
              owner: {
                type: 'string',
                description: 'Repository owner',
              },
              repo: {
                type: 'string',
                description: 'Repository name',
              },
              title: {
                type: 'string',
                description: 'Issue title',
              },
              body: {
                type: 'string',
                description: 'Issue body/description (optional)',
              },
              assignees: {
                type: 'array',
                items: { type: 'string' },
                description: 'Array of usernames to assign to the issue',
              },
              labels: {
                type: 'array',
                items: { type: 'string' },
                description: 'Array of labels to apply to the issue',
              },
            },
            required: ['owner', 'repo', 'title'],
          },
        },
        {
          name: 'get_codegen_status',
          description: 'Get status and information about Codegen services',
          parameters: {
            type: 'object',
            properties: {
              service: {
                type: 'string',
                description: 'Specific service to check (optional)',
              },
            },
          },
        },
        {
          name: 'trigger_codegen_task',
          description: 'Trigger a Codegen task or workflow',
          parameters: {
            type: 'object',
            properties: {
              task_type: {
                type: 'string',
                description: 'Type of task to trigger',
              },
              repository: {
                type: 'string',
                description: 'Repository to work on (optional)',
              },
              description: {
                type: 'string',
                description: 'Task description or instructions',
              },
              priority: {
                type: 'string',
                description: 'Task priority: "low", "medium", "high"',
                enum: ['low', 'medium', 'high'],
              },
            },
            required: ['task_type', 'description'],
          },
        },
      ],
    };
  }

  async executeFunction(name: string, args: any): Promise<any> {
    switch (name) {
      case 'get_linear_issues':
        return this.getLinearIssues(args);
      case 'create_linear_issue':
        return this.createLinearIssue(args);
      case 'get_github_repos':
        return this.getGithubRepos(args);
      case 'get_github_issues':
        return this.getGithubIssues(args);
      case 'create_github_issue':
        return this.createGithubIssue(args);
      case 'get_codegen_status':
        return this.getCodegenStatus();
      case 'trigger_codegen_task':
        return this.triggerCodegenTask(args);
      default:
        throw new Error(`Unknown function: ${name}`);
    }
  }

  private async getLinearIssues(args: any): Promise<any> {
    const query = `
      query GetIssues($filter: IssueFilter) {
        issues(filter: $filter) {
          nodes {
            id
            title
            description
            state { name }
            assignee { name }
            team { name }
            priority
            createdAt
            updatedAt
          }
        }
      }
    `;

    const variables: any = { filter: {} };
    
    if (args.team_id) {
      variables.filter.team = { id: { eq: args.team_id } };
    }
    
    if (args.state) {
      variables.filter.state = { name: { eq: args.state } };
    }
    
    if (args.assignee) {
      variables.filter.assignee = { name: { eq: args.assignee } };
    }
    
    const response = await axios.post(
      'https://api.linear.app/graphql',
      { query, variables },
      {
        headers: {
          'Authorization': `Bearer ${this.linearApiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.data.issues.nodes;
  }

  private async createLinearIssue(args: any) {
    const mutation = `
      mutation IssueCreate($input: IssueCreateInput!) {
        issueCreate(input: $input) {
          success
          issue {
            id
            title
            url
          }
        }
      }
    `;

    const input: any = {
      title: args.title,
    };

    if (args.description) input.description = args.description;
    if (args.team_id) input.teamId = args.team_id;
    if (args.priority) input.priority = args.priority;

    const response = await axios.post(
      'https://api.linear.app/graphql',
      { query: mutation, variables: { input } },
      {
        headers: {
          'Authorization': `Bearer ${this.linearApiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.data.issueCreate;
  }

  private async getGithubRepos(args: any) {
    const params = new URLSearchParams();
    if (args.type) params.append('type', args.type);
    if (args.sort) params.append('sort', args.sort);
    params.append('per_page', (args.limit || 10).toString());

    const response = await axios.get(
      `https://api.github.com/user/repos?${params.toString()}`,
      {
        headers: {
          'Authorization': `token ${this.githubApiKey}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      }
    );

    return response.data.map((repo: any) => ({
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
      description: repo.description,
      private: repo.private,
      html_url: repo.html_url,
      language: repo.language,
      stargazers_count: repo.stargazers_count,
      updated_at: repo.updated_at,
    }));
  }

  private async getGithubIssues(args: any) {
    const { owner, repo } = args;
    const params = new URLSearchParams();
    if (args.state) params.append('state', args.state);
    if (args.assignee) params.append('assignee', args.assignee);
    params.append('per_page', (args.limit || 10).toString());

    const response = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/issues?${params.toString()}`,
      {
        headers: {
          Authorization: `token ${this.githubApiKey}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );

    return response.data;
  }

  private async createGithubIssue(args: any) {
    const body: any = {
      title: args.title,
    };

    if (args.body) body.body = args.body;
    if (args.assignees) body.assignees = args.assignees;
    if (args.labels) body.labels = args.labels;

    const response = await axios.post(
      `https://api.github.com/repos/${args.owner}/${args.repo}/issues`,
      body,
      {
        headers: {
          'Authorization': `token ${this.githubApiKey}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      }
    );

    return {
      id: response.data.id,
      number: response.data.number,
      title: response.data.title,
      html_url: response.data.html_url,
      state: response.data.state,
    };
  }

  private async getCodegenStatus() {
    // This would integrate with the actual Codegen API
    // For now, return mock data
    return {
      status: 'operational',
      services: {
        api: 'healthy',
        workers: 'healthy',
        database: 'healthy',
      },
      version: '1.0.0',
      uptime: '99.9%',
    };
  }

  private async triggerCodegenTask(args: any) {
    // This would integrate with the actual Codegen API
    // For now, return mock data
    return {
      task_id: `task_${Date.now()}`,
      status: 'queued',
      task_type: args.task_type,
      description: args.description,
      priority: args.priority || 'medium',
      estimated_completion: '5-10 minutes',
    };
  }
}
