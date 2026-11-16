export function buildOpenApiSpec(baseUrl: string) {
  return {
    openapi: '3.0.3',
    info: {
      title: 'SIGN IN DOCUMENTS CLEARING API',
      version: '1.0.0',
      description:
        'REST API for Sign In Transactions Follow Up Services LLC (Abu Dhabi, UAE). Covers public service/FAQ retrieval, validated consultation enquiry submission, and role-protected administrative enquiry management.',
    },
    servers: [{ url: baseUrl }],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Firebase Authentication ID token.',
        },
      },
    },
    paths: {
      '/api/v1/health': {
        get: {
          summary: 'Service health check',
          responses: { '200': { description: 'Application is running' } },
        },
      },
      '/api/v1/services': {
        get: {
          summary: 'List published service categories',
          responses: { '200': { description: 'Array of service objects' } },
        },
      },
      '/api/v1/services/{slug}': {
        get: {
          summary: 'Get service detail and related FAQs by slug',
          parameters: [
            {
              name: 'slug',
              in: 'path',
              required: true,
              schema: { type: 'string' },
            },
          ],
          responses: {
            '200': { description: 'Service detail object' },
            '404': { description: 'Service not found' },
          },
        },
      },
      '/api/v1/faqs': {
        get: {
          summary: 'List published FAQs',
          parameters: [
            {
              name: 'serviceSlug',
              in: 'query',
              required: false,
              schema: { type: 'string' },
            },
          ],
          responses: { '200': { description: 'Array of FAQ items' } },
        },
      },
      '/api/v1/enquiries': {
        post: {
          summary: 'Submit a consultation enquiry',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: [
                    'fullName',
                    'phone',
                    'email',
                    'serviceSlug',
                    'message',
                    'consentAccepted',
                  ],
                  properties: {
                    fullName: { type: 'string' },
                    phone: { type: 'string' },
                    email: { type: 'string', format: 'email' },
                    companyName: { type: 'string' },
                    serviceSlug: { type: 'string' },
                    message: { type: 'string' },
                    consentAccepted: { type: 'boolean' },
                    sourcePage: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            '201': { description: 'Enquiry recorded in PostgreSQL' },
            '400': { description: 'Validation error' },
            '429': { description: 'Rate limit exceeded' },
          },
        },
      },
      '/api/v1/auth/me': {
        get: {
          summary: 'Get authenticated user profile and role',
          security: [{ BearerAuth: [] }],
          responses: {
            '200': { description: 'Current user profile' },
            '401': { description: 'Unauthorized' },
          },
        },
      },
      '/api/v1/auth/logout': {
        post: {
          summary: 'Record administrative logout event',
          security: [{ BearerAuth: [] }],
          responses: { '200': { description: 'Logged out' } },
        },
      },
      '/api/v1/admin/enquiries': {
        get: {
          summary: 'List enquiries with search, status, and service filters (Admin only)',
          security: [{ BearerAuth: [] }],
          parameters: [
            { name: 'search', in: 'query', schema: { type: 'string' } },
            { name: 'status', in: 'query', schema: { type: 'string' } },
            { name: 'serviceSlug', in: 'query', schema: { type: 'string' } },
            { name: 'page', in: 'query', schema: { type: 'integer' } },
            { name: 'limit', in: 'query', schema: { type: 'integer' } },
          ],
          responses: {
            '200': { description: 'Paginated enquiries list' },
            '401': { description: 'Unauthorized' },
            '403': { description: 'Forbidden' },
          },
        },
      },
      '/api/v1/admin/enquiries/{id}': {
        get: {
          summary: 'Get full enquiry detail including status history and notification logs (Admin only)',
          security: [{ BearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
            },
          ],
          responses: {
            '200': { description: 'Enquiry detail' },
            '404': { description: 'Not found' },
          },
        },
      },
      '/api/v1/admin/enquiries/{id}/status': {
        patch: {
          summary: 'Update enquiry status and internal notes (Admin only)',
          security: [{ BearerAuth: [] }],
          parameters: [
            {
              name: 'id',
              in: 'path',
              required: true,
              schema: { type: 'integer' },
            },
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['status'],
                  properties: {
                    status: {
                      type: 'string',
                      enum: ['NEW', 'IN_REVIEW', 'CONTACTED', 'QUOTED', 'CLOSED'],
                    },
                    internalNotes: { type: 'string' },
                    note: { type: 'string' },
                  },
                },
              },
            },
          },
          responses: {
            '200': { description: 'Status updated' },
            '400': { description: 'Invalid status' },
          },
        },
      },
      '/api/v1/admin/faqs': {
        get: {
          summary: 'List all FAQs including unpublished (Admin only)',
          security: [{ BearerAuth: [] }],
          responses: { '200': { description: 'FAQ list' } },
        },
        post: {
          summary: 'Create a new FAQ entry (Admin only)',
          security: [{ BearerAuth: [] }],
          responses: { '201': { description: 'FAQ created' } },
        },
      },
      '/api/v1/admin/audit-logs': {
        get: {
          summary: 'List recent administrative audit logs (Admin only)',
          security: [{ BearerAuth: [] }],
          responses: { '200': { description: 'Audit logs' } },
        },
      },
    },
  };
}
