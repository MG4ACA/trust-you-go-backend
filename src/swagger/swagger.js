const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const config = require('../config');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Trust You Go API',
      version: '1.0.0',
      description:
        'REST API for Trust You Go travel booking platform - Sri Lanka travel packages management system',
      contact: {
        name: 'Trust You Go',
        email: 'info@trustyou-go.com',
        url: 'https://trustyou-go.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: `http://localhost:${config.server.port}`,
        description: 'Development server',
      },
      {
        url: 'https://api.trustyou-go.com',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token obtained from login endpoint',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            message: {
              type: 'string',
              example: 'Error message',
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
              },
            },
          },
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            message: {
              type: 'string',
              example: 'Operation successful',
            },
            data: {
              type: 'object',
            },
          },
        },
        PaginatedResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            data: {
              type: 'array',
              items: {
                type: 'object',
              },
            },
            pagination: {
              type: 'object',
              properties: {
                page: {
                  type: 'integer',
                  example: 1,
                },
                limit: {
                  type: 'integer',
                  example: 10,
                },
                total: {
                  type: 'integer',
                  example: 100,
                },
                totalPages: {
                  type: 'integer',
                  example: 10,
                },
              },
            },
          },
        },
        Admin: {
          type: 'object',
          properties: {
            admin_id: {
              type: 'string',
              format: 'uuid',
              example: '550e8400-e29b-41d4-a716-446655440000',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'admin@trustyou-go.com',
            },
            name: {
              type: 'string',
              example: 'John Doe',
            },
            contact: {
              type: 'string',
              example: '+94771234567',
            },
            is_active: {
              type: 'boolean',
              example: true,
            },
            last_login: {
              type: 'string',
              format: 'date-time',
              nullable: true,
            },
            created_at: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Traveler: {
          type: 'object',
          properties: {
            traveler_id: {
              type: 'string',
              format: 'uuid',
            },
            email: {
              type: 'string',
              format: 'email',
            },
            name: {
              type: 'string',
            },
            contact: {
              type: 'string',
            },
            is_active: {
              type: 'boolean',
            },
            last_login: {
              type: 'string',
              format: 'date-time',
              nullable: true,
            },
            created_at: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Agent: {
          type: 'object',
          properties: {
            agent_id: {
              type: 'string',
              format: 'uuid',
            },
            name: {
              type: 'string',
            },
            contact: {
              type: 'string',
            },
            email: {
              type: 'string',
              format: 'email',
            },
            commission_rate: {
              type: 'number',
              format: 'decimal',
              example: 10.5,
            },
            notes: {
              type: 'string',
              nullable: true,
            },
            is_active: {
              type: 'boolean',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Location: {
          type: 'object',
          properties: {
            location_id: {
              type: 'string',
              format: 'uuid',
            },
            name: {
              type: 'string',
              example: 'Sigiriya Rock Fortress',
            },
            description: {
              type: 'string',
              nullable: true,
            },
            location_type: {
              type: 'string',
              enum: ['tourist_spot', 'accommodation', 'restaurant', 'activity'],
              example: 'tourist_spot',
            },
            location_url: {
              type: 'string',
              format: 'uri',
              nullable: true,
            },
            is_active: {
              type: 'boolean',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Package: {
          type: 'object',
          properties: {
            package_id: {
              type: 'string',
              format: 'uuid',
            },
            title: {
              type: 'string',
              example: '7 Days Cultural Triangle Tour',
            },
            description: {
              type: 'string',
              nullable: true,
            },
            no_of_days: {
              type: 'integer',
              example: 7,
            },
            is_template: {
              type: 'boolean',
              example: false,
            },
            status: {
              type: 'string',
              enum: ['draft', 'published'],
              example: 'published',
            },
            base_price: {
              type: 'number',
              format: 'decimal',
              nullable: true,
              example: 1500.0,
            },
            is_active: {
              type: 'boolean',
            },
            created_by: {
              type: 'string',
              format: 'uuid',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Booking: {
          type: 'object',
          properties: {
            booking_id: {
              type: 'string',
              format: 'uuid',
            },
            package_id: {
              type: 'string',
              format: 'uuid',
            },
            traveler_id: {
              type: 'string',
              format: 'uuid',
            },
            agent_id: {
              type: 'string',
              format: 'uuid',
              nullable: true,
            },
            no_of_travelers: {
              type: 'integer',
              example: 2,
            },
            start_date: {
              type: 'string',
              format: 'date',
              nullable: true,
            },
            end_date: {
              type: 'string',
              format: 'date',
              nullable: true,
            },
            status: {
              type: 'string',
              enum: ['temporary', 'confirmed', 'in_progress', 'completed', 'cancelled'],
              example: 'temporary',
            },
            total_amount: {
              type: 'number',
              format: 'decimal',
              nullable: true,
            },
            payment_status: {
              type: 'string',
              enum: ['pending', 'partial', 'paid', 'refunded'],
              example: 'pending',
            },
            confirmation_date: {
              type: 'string',
              format: 'date-time',
              nullable: true,
            },
            confirmed_by: {
              type: 'string',
              format: 'uuid',
              nullable: true,
            },
            admin_notes: {
              type: 'string',
              nullable: true,
            },
            traveler_notes: {
              type: 'string',
              nullable: true,
            },
            created_at: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        PackageRequest: {
          type: 'object',
          properties: {
            request_id: {
              type: 'string',
              format: 'uuid',
            },
            traveler_id: {
              type: 'string',
              format: 'uuid',
            },
            title: {
              type: 'string',
              example: 'Custom Beach & Wildlife Tour',
            },
            description: {
              type: 'string',
            },
            no_of_days: {
              type: 'integer',
              example: 5,
            },
            no_of_travelers: {
              type: 'integer',
              nullable: true,
              example: 4,
            },
            preferred_start_date: {
              type: 'string',
              format: 'date',
              nullable: true,
            },
            budget_range: {
              type: 'string',
              nullable: true,
              example: '$2000 - $3000',
            },
            special_requirements: {
              type: 'string',
              nullable: true,
            },
            status: {
              type: 'string',
              enum: ['pending', 'reviewing', 'approved', 'rejected'],
              example: 'pending',
            },
            created_package_id: {
              type: 'string',
              format: 'uuid',
              nullable: true,
            },
            admin_notes: {
              type: 'string',
              nullable: true,
            },
            created_at: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
      },
    },
    tags: [
      {
        name: 'Authentication',
        description: 'Login, logout, and user profile management',
      },
      {
        name: 'Admins',
        description: 'Admin user management (Admin only)',
      },
      {
        name: 'Travelers',
        description: 'Traveler account management',
      },
      {
        name: 'Agents',
        description: 'Travel agent management (Admin only)',
      },
      {
        name: 'Locations',
        description: 'Tourist locations, accommodations, restaurants, activities',
      },
      {
        name: 'Packages',
        description: 'Tour package management with itineraries',
      },
      {
        name: 'Bookings',
        description: 'Booking submissions and management',
      },
      {
        name: 'Package Requests',
        description: 'Custom package requests from travelers',
      },
    ],
  },
  apis: ['./src/routes/*.js', './src/swagger/paths/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

const setupSwagger = (app) => {
  // Swagger UI
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: 'Trust You Go API Documentation',
    })
  );

  // Swagger JSON
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
};

module.exports = setupSwagger;
