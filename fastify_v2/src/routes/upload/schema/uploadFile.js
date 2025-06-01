const uploadFileSchema = {
    description: 'Upload a file',
    tags: ['file'],
    summary: 'Uploads a file to the server',
    consumes: ['multipart/form-data'], // Ensure this is correctly specified
    response: {
      200: {
        description: 'Successful upload',
        type: 'object',
        properties: {
          message: { type: 'string' },
          url: { type: 'string' },
          filename: { type: 'string' }
        }
      },
      500: {
        description: 'Failed upload',
        type: 'object'
      }
    }
  };

  module.exports = uploadFileSchema;