import swaggerUi from 'swagger-ui-express';

export const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Email Service API',
    version: '1.0.0',
    description: 'REST API documentation for the Node.js Email Engine service supporting SMTP, Gmail, Outlook/Exchange, calendar invitations, attachments, and Microsoft Graph delegated sending.',
    contact: {
      name: 'Wellington Mpofu',
      email: 'wellingtonwellompofu3@gmail.com'
    }
  },
  servers: [
    {
      url: 'http://localhost:{port}',
      description: 'Local development server',
      variables: {
        port: {
          default: '8558',
          description: 'Port number configured in .env'
        }
      }
    }
  ],
  tags: [
    {
      name: 'Email Delivery',
      description: 'Standard email sending endpoints using Nodemailer transporters (Custom SMTP, Gmail, Outlook SMTP)'
    },
    {
      name: 'Calendar & Invites',
      description: 'iCalendar (.ics) event and meeting invitation dispatch'
    },
    {
      name: 'Microsoft Graph (Application)',
      description: 'Send emails via Microsoft Graph API using application-level client credentials'
    },
    {
      name: 'Microsoft Graph (Delegated OAuth2)',
      description: 'OAuth2 authorization flow and delegated email sending on behalf of authenticated user'
    }
  ],
  paths: {
    '/api/v1/email/send': {
      post: {
        tags: ['Email Delivery'],
        summary: 'Send an email',
        description: 'Sends an HTML formatted email using the configured email transporter (Custom SMTP, Gmail, or Outlook SMTP).',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SendEmailRequest'
              },
              example: {
                emailType: 'gmail',
                from: 'wellingtonwellompofu3@gmail.com',
                recipients: ['recipient@example.com'],
                ccRecipients: [],
                bccRecipients: [],
                subject: 'Welcome to our platform',
                messageHeader: 'Account Verification',
                message: 'Thank you for registering. Please confirm your email address by following the instructions.',
                templateId: 1
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Email sent successfully',
            content: {
              'text/plain': {
                schema: {
                  type: 'string',
                  example: 'Email sent successfully'
                }
              }
            }
          },
          '500': {
            description: 'Internal server error or transport failure',
            content: {
              'text/plain': {
                schema: {
                  type: 'string',
                  example: 'Invalid login: 535-5.7.8 Username and Password not accepted'
                }
              }
            }
          }
        }
      }
    },
    '/api/v1/email/send/attachments': {
      post: {
        tags: ['Email Delivery'],
        summary: 'Send an email with attachments',
        description: 'Sends an email with one or more file attachments uploaded via multipart/form-data.',
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                required: ['files', 'emailDetails'],
                properties: {
                  files: {
                    type: 'array',
                    description: 'One or more files to attach to the email',
                    items: {
                      type: 'string',
                      format: 'binary'
                    }
                  },
                  emailDetails: {
                    type: 'string',
                    description: 'JSON-serialized string of email details',
                    example: JSON.stringify({
                      emailType: 'gmail',
                      from: 'wellingtonwellompofu3@gmail.com',
                      recipients: ['client@example.com'],
                      ccRecipients: [],
                      bccRecipients: [],
                      subject: 'Monthly Invoice & Statements',
                      message: 'Please find your monthly statement attached.',
                      templateId: 1
                    })
                  }
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Email sent successfully',
            content: {
              'text/plain': {
                schema: {
                  type: 'string',
                  example: 'Email sent successfully'
                }
              }
            }
          },
          '400': {
            description: 'Missing attachments or bad request',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: {
                      type: 'string',
                      example: 'No email attachments found'
                    }
                  }
                }
              }
            }
          },
          '500': {
            description: 'Internal server or transporter error',
            content: {
              'text/plain': {
                schema: {
                  type: 'string',
                  example: 'Error sending attachment email'
                }
              }
            }
          }
        }
      }
    },
    '/api/v1/email/send-calendar-event': {
      post: {
        tags: ['Calendar & Invites'],
        summary: 'Send calendar invite',
        description: 'Creates an iCalendar (.ics) event and dispatches an invitation email with RSVP capabilities.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/SendCalendarEventRequest'
              },
              example: {
                email: 'attendee@example.com',
                emailType: 'gmail',
                from: 'wellingtonwellompofu3@gmail.com',
                templateId: 3,
                eventDetails: {
                  title: 'Project Kickoff & Architecture Review',
                  description: 'Discussion on the new engine-v2 architecture and deliverables.',
                  start: '2026-10-25T14:00:00Z',
                  end: '2026-10-25T15:00:00Z',
                  location: 'Google Meet',
                  url: 'https://meet.google.com/xyz-abcd-efg',
                  organizerName: 'Wellington Mpofu',
                  organizer: {
                    name: 'Wellington Mpofu',
                    email: 'wellingtonwellompofu3@gmail.com'
                  },
                  attendees: [
                    {
                      name: 'Team Member',
                      email: 'attendee@example.com'
                    }
                  ]
                }
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Calendar invite sent successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Calendar invite sent successfully' }
                  }
                }
              }
            }
          },
          '500': {
            description: 'Failed to create or send calendar invite',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    error: { type: 'string', example: 'Failed to generate calendar event' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/v1/email/send/microsoft': {
      post: {
        tags: ['Microsoft Graph (Application)'],
        summary: 'Send email using Microsoft Graph application credentials',
        description: 'Sends an email via Microsoft Graph API using Azure App Client Secret (Application Permissions).',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/MicrosoftEmailRequest'
              },
              example: {
                recipients: ['client@example.com'],
                ccRecipients: [],
                bccRecipients: [],
                subject: 'Notification via Microsoft Graph',
                message: 'This email was dispatched using Microsoft Graph application permissions.',
                messageHeader: 'System Alert',
                templateId: 1
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Email sent successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Email sent successfully' },
                    data: { type: 'object' }
                  }
                }
              }
            }
          },
          '400': {
            description: 'Missing required parameters',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: false },
                    error: { type: 'string', example: 'Missing required fields: recipients (or to), subject, and message (or text)' }
                  }
                }
              }
            }
          },
          '500': {
            description: 'Graph API error',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: false },
                    error: { type: 'string', example: 'Failed to send email' },
                    details: { type: 'string' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/v1/email/outlook/connect': {
      get: {
        tags: ['Microsoft Graph (Delegated OAuth2)'],
        summary: 'Start Outlook OAuth2 authorization',
        description: 'Redirects the user to Microsoft login page to grant delegated Mail.Send permissions.',
        responses: {
          '302': {
            description: 'Redirects to Microsoft OAuth2 authorization URL'
          },
          '500': {
            description: 'Failed to generate authorization URL',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: false },
                    error: { type: 'string', example: 'Failed to start OAuth flow' },
                    details: { type: 'string' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/v1/email/outlook/status': {
      get: {
        tags: ['Microsoft Graph (Delegated OAuth2)'],
        summary: 'Check Outlook delegated authentication status',
        description: 'Checks if an Outlook delegated refresh token is active and ready for sending.',
        responses: {
          '200': {
            description: 'Current authentication status',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    authenticated: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Outlook delegated auth is available for sending.' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/v1/email/outlook/oauth-url': {
      get: {
        tags: ['Microsoft Graph (Delegated OAuth2)'],
        summary: 'Get Outlook OAuth2 authorization URL',
        description: 'Returns the authorization URL as JSON instead of redirecting directly.',
        responses: {
          '200': {
            description: 'Authorization URL retrieved',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    authorizationUrl: { type: 'string', example: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize?...' }
                  }
                }
              }
            }
          },
          '500': {
            description: 'Failed to create OAuth URL',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: false },
                    error: { type: 'string', example: 'Failed to create OAuth URL' },
                    details: { type: 'string' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/v1/email/outlook/callback': {
      get: {
        tags: ['Microsoft Graph (Delegated OAuth2)'],
        summary: 'OAuth2 callback endpoint',
        description: 'Receives the authorization code from Microsoft, exchanges it for access/refresh tokens, and persists the refresh token.',
        parameters: [
          {
            name: 'code',
            in: 'query',
            required: true,
            description: 'Authorization code returned from Microsoft OAuth flow',
            schema: {
              type: 'string'
            }
          }
        ],
        responses: {
          '200': {
            description: 'HTML confirmation page on successful authentication',
            content: {
              'text/html': {
                schema: {
                  type: 'string'
                }
              }
            }
          },
          '500': {
            description: 'Failed to exchange authorization code',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: false },
                    error: { type: 'string', example: 'Failed to exchange OAuth code' },
                    details: { type: 'string' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/v1/email/send/microsoft/delegated': {
      post: {
        tags: ['Microsoft Graph (Delegated OAuth2)'],
        summary: 'Send email as authenticated user (delegated)',
        description: 'Sends an email via Microsoft Graph API on behalf of the signed-in user using delegated permissions and refresh token.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/MicrosoftDelegatedEmailRequest'
              },
              example: {
                recipients: ['colleague@example.com'],
                ccRecipients: [],
                bccRecipients: [],
                subject: 'Project Update (Delegated)',
                message: 'Sending this email directly on behalf of my authenticated user mailbox.',
                messageHeader: 'Important Notice',
                templateId: 1
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Email sent successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true },
                    message: { type: 'string', example: 'Email sent successfully' },
                    data: { type: 'object' }
                  }
                }
              }
            }
          },
          '400': {
            description: 'Missing required parameters',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: false },
                    error: { type: 'string', example: 'Missing required fields: recipients (or to), subject, and message (or text)' }
                  }
                }
              }
            }
          },
          '500': {
            description: 'Failed to send delegated email',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: false },
                    error: { type: 'string', example: 'Failed to send email' },
                    details: { type: 'string' },
                    hint: { type: 'string', example: 'Authenticate first by opening /api/v1/email/outlook/connect in a browser.' }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  components: {
    schemas: {
      SendEmailRequest: {
        type: 'object',
        required: ['recipients', 'subject', 'message', 'templateId'],
        properties: {
          emailType: {
            type: 'string',
            enum: ['gmail', 'outlook', 'custom'],
            default: 'custom',
            description: 'Transporter provider to use for sending'
          },
          from: {
            type: 'string',
            description: 'Sender email address. Defaults to configured environment sender'
          },
          recipients: {
            oneOf: [
              {
                type: 'string',
                description: 'Single recipient email address'
              },
              {
                type: 'array',
                items: { type: 'string' },
                description: 'List of recipient email addresses'
              }
            ]
          },
          ccRecipients: {
            oneOf: [
              { type: 'string' },
              { type: 'array', items: { type: 'string' } }
            ],
            description: 'Carbon copy recipient(s)'
          },
          bccRecipients: {
            oneOf: [
              { type: 'string' },
              { type: 'array', items: { type: 'string' } }
            ],
            description: 'Blind carbon copy recipient(s)'
          },
          subject: {
            type: 'string',
            description: 'Email subject title'
          },
          messageHeader: {
            type: 'string',
            description: 'Header text used inside HTML email templates'
          },
          message: {
            type: 'string',
            description: 'Email body message content'
          },
          templateId: {
            type: 'integer',
            enum: [1, 2, 3],
            description: 'Template identifier (1: Customer Template, 2: Internal Template, 3: Generic Template)'
          }
        }
      },
      SendCalendarEventRequest: {
        type: 'object',
        required: ['email', 'templateId', 'eventDetails'],
        properties: {
          email: {
            type: 'string',
            description: 'Recipient email address'
          },
          emailType: {
            type: 'string',
            enum: ['gmail', 'outlook', 'custom'],
            default: 'custom',
            description: 'Transporter type to send the invite through'
          },
          from: {
            type: 'string',
            description: 'Organizer email override'
          },
          templateId: {
            type: 'integer',
            enum: [1, 2, 3],
            description: 'HTML template identifier'
          },
          eventDetails: {
            type: 'object',
            required: ['title', 'start', 'end', 'organizerName', 'organizer', 'attendees'],
            properties: {
              title: { type: 'string', description: 'Event title / summary' },
              description: { type: 'string', description: 'Event description / agenda' },
              start: { type: 'string', format: 'date-time', description: 'Event start time in ISO 8601 format' },
              end: { type: 'string', format: 'date-time', description: 'Event end time in ISO 8601 format' },
              location: { type: 'string', description: 'Event physical or virtual location' },
              url: { type: 'string', description: 'Meeting link / URL' },
              organizerName: { type: 'string', description: 'Display name of organizer' },
              organizer: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                  email: { type: 'string' }
                }
              },
              attendees: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    email: { type: 'string' }
                  }
                }
              }
            }
          }
        }
      },
      MicrosoftEmailRequest: {
        type: 'object',
        required: ['subject'],
        properties: {
          to: {
            oneOf: [
              { type: 'string' },
              { type: 'array', items: { type: 'string' } }
            ],
            description: 'Recipient(s) (alternative to recipients field)'
          },
          recipients: {
            oneOf: [
              { type: 'string' },
              { type: 'array', items: { type: 'string' } }
            ],
            description: 'Recipient(s)'
          },
          ccRecipients: {
            type: 'array',
            items: { type: 'string' }
          },
          bccRecipients: {
            type: 'array',
            items: { type: 'string' }
          },
          subject: {
            type: 'string'
          },
          message: {
            type: 'string',
            description: 'Email content (alternative: text)'
          },
          text: {
            type: 'string',
            description: 'Email content'
          },
          messageHeader: {
            type: 'string'
          },
          templateId: {
            type: 'integer',
            enum: [1, 2, 3]
          }
        }
      },
      MicrosoftDelegatedEmailRequest: {
        type: 'object',
        required: ['subject'],
        properties: {
          to: {
            oneOf: [
              { type: 'string' },
              { type: 'array', items: { type: 'string' } }
            ]
          },
          recipients: {
            oneOf: [
              { type: 'string' },
              { type: 'array', items: { type: 'string' } }
            ]
          },
          ccRecipients: {
            type: 'array',
            items: { type: 'string' }
          },
          bccRecipients: {
            type: 'array',
            items: { type: 'string' }
          },
          subject: {
            type: 'string'
          },
          message: {
            type: 'string'
          },
          text: {
            type: 'string'
          },
          messageHeader: {
            type: 'string'
          },
          templateId: {
            type: 'integer',
            enum: [1, 2, 3]
          },
          refreshToken: {
            type: 'string',
            description: 'Optional custom refresh token override; if omitted, saved token from .env is used'
          }
        }
      }
    },
    securitySchemes: {
      KeycloakBearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Keycloak JWT Bearer Token'
      }
    }
  }
};

/**
 * Configure and mount Swagger UI and JSON spec endpoints on the express application
 * @param {import('express').Express} app 
 */
export const setupSwagger = (app) => {
  // Serve OpenAPI specification as JSON
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  // Serve Swagger UI
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      customSiteTitle: 'Email Service API Documentation',
      customCss: '.swagger-ui .topbar { display: block; }',
      swaggerOptions: {
        persistAuthorization: true,
        docExpansion: 'list',
        filter: true
      }
    })
  );
};
