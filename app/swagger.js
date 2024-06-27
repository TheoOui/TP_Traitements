const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Ticket Reservation API',
      version: '1.0.0',
      description: 'API documentation for ticket reservation application',
    },
  },
  apis: ['./app.js'],
};
const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;