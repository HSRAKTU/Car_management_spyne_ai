import { app } from "../app.js";
import swaggerUi from 'swagger-ui-express';
// Swagger setup using CDN for assets and a static openapi.json
const setupSwagger = async () => {
    try {
      const openApiDocument = {
        "openapi": "3.0.0",
        "info": {
          "title": "Car_Management",
          "version": "1.0.0"
        },
        "servers": [
          {
            "url": "http://localhost:8000/api/v1"
          },
          {
            "url": "https://car-management-spyne-ai.vercel.app/api/v1"
          }
        ],
        "components": {
          "securitySchemes": {
            "noauthAuth": {
              "type": "http",
              "scheme": "noauth"
            }
          }
        },
        "tags": [
          {
            "name": "User"
          },
          {
            "name": "Car"
          }
        ],
        "paths": {
          "/user/register": {
            "post": {
              "tags": [
                "User"
              ],
              "summary": "Sign Up",
              "requestBody": {
                "content": {
                  "application/json": {
                    "schema": {
                      "type": "object",
                      "example": {
                        "username": "klarciere5",
                        "fullName": "Kris Larciere",
                        "email": "klarciere5@smh.com.au",
                        "contactNumber": "711-384-5146",
                        "password": "klarciere5@smh.com.au"
                      }
                    }
                  }
                }
              },
              "security": [
                {
                  "noauthAuth": []
                }
              ],
              "responses": {
                "200": {
                  "description": "Successful response",
                  "content": {
                    "application/json": {}
                  }
                }
              }
            }
          },
          "/user/login": {
            "post": {
              "tags": [
                "User"
              ],
              "summary": "Sign In",
              "requestBody": {
                "content": {
                  "application/json": {
                    "schema": {
                      "type": "object",
                      "example": {
                        "identifier": "ceastham1@xing.com",
                        "password": "ceastham1@xing.com"
                      }
                    }
                  }
                }
              },
              "responses": {
                "200": {
                  "description": "Successful response",
                  "content": {
                    "application/json": {}
                  }
                }
              }
            }
          },
          "/user/logout": {
            "post": {
              "tags": [
                "User"
              ],
              "summary": "Log out",
              "requestBody": {
                "content": {}
              },
              "responses": {
                "200": {
                  "description": "Successful response",
                  "content": {
                    "application/json": {}
                  }
                }
              }
            }
          },
          "/user/refreshAccessToken": {
            "post": {
              "tags": [
                "User"
              ],
              "summary": "Refresh Access Token",
              "requestBody": {
                "content": {}
              },
              "responses": {
                "200": {
                  "description": "Successful response",
                  "content": {
                    "application/json": {}
                  }
                }
              }
            }
          },
          "/user/currentUser": {
            "get": {
              "tags": [
                "User"
              ],
              "summary": "Current User",
              "responses": {
                "200": {
                  "description": "Successful response",
                  "content": {
                    "application/json": {}
                  }
                }
              }
            }
          },
          "/user/checkUsername": {
            "get": {
              "tags": [
                "User"
              ],
              "summary": "check username availability",
              "responses": {
                "200": {
                  "description": "Successful response",
                  "content": {
                    "application/json": {}
                  }
                }
              }
            }
          },
          "/car/create-product": {
            "post": {
              "tags": [
                "Car"
              ],
              "summary": "Create Product",
              "requestBody": {
                "content": {
                  "multipart/form-data": {
                    "schema": {
                      "type": "object",
                      "properties": {
                        "title": {
                          "type": "string",
                          "example": " 2025 Ford Mustang Mach-E GT"
                        },
                        "description": {
                          "type": "string",
                          "example": "The 2025 Ford Mustang Mach-E GT is a high-performance electric SUV that combines the iconic Mustang branding with modern electric mobility, delivering 480 horsepower and a 0-60 mph time of 3.5 seconds."
                        },
                        "tags": {
                          "type": "string",
                          "example": "[\"electric\", \"SUV\", \"performance\", \"Ford\", \"Mustang\"]"
                        },
                        "images": {
                          "type": "string",
                          "format": "binary"
                        }
                      }
                    }
                  }
                }
              },
              "responses": {
                "200": {
                  "description": "Successful response",
                  "content": {
                    "application/json": {}
                  }
                }
              }
            }
          },
          "/car/update-product/6799b98d0a4ab307e2160adf": {
            "patch": {
              "tags": [
                "Car"
              ],
              "summary": "Update Product",
              "requestBody": {
                "content": {
                  "multipart/form-data": {
                    "schema": {
                      "type": "object",
                      "properties": {
                        "title": {
                          "type": "string",
                          "example": "Golf GTI"
                        },
                        "images": {
                          "type": "string",
                          "format": "binary"
                        },
                        "imageIndexesToUpdate": {
                          "type": "string",
                          "example": "[4]"
                        }
                      }
                    }
                  }
                }
              },
              "responses": {
                "200": {
                  "description": "Successful response",
                  "content": {
                    "application/json": {}
                  }
                }
              }
            }
          },
          "/car/list-products": {
            "get": {
              "tags": [
                "Car"
              ],
              "summary": "List Products",
              "parameters": [
                {
                  "name": "query",
                  "in": "query",
                  "schema": {
                    "type": "string"
                  },
                  "example": "racing"
                }
              ],
              "responses": {
                "200": {
                  "description": "Successful response",
                  "content": {
                    "application/json": {}
                  }
                }
              }
            }
          },
          "/car/user-products": {
            "get": {
              "tags": [
                "Car"
              ],
              "summary": "List User's Products",
              "responses": {
                "200": {
                  "description": "Successful response",
                  "content": {
                    "application/json": {}
                  }
                }
              }
            }
          },
          "/car/list-product-by-id/6799b98d0a4ab307e2160adf": {
            "get": {
              "tags": [
                "Car"
              ],
              "summary": "List Product by ID",
              "responses": {
                "200": {
                  "description": "Successful response",
                  "content": {
                    "application/json": {}
                  }
                }
              }
            }
          },
          "/car/delete-product/6799d28d70c6e162f2895922": {
            "delete": {
              "tags": [
                "Car"
              ],
              "summary": "Delete Product",
              "responses": {
                "200": {
                  "description": "Successful response",
                  "content": {
                    "application/json": {}
                  }
                }
              }
            }
          }
        }
      }; // Parse JSON
  
      // Set up Swagger UI with CDN
      app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(openApiDocument,{
        customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
        customJsUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js',
        customJs: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js'
      }));
      console.log('Swagger UI is available at /api/docs');
    } catch (error) {
      console.error('Error setting up Swagger UI:', error);
    }
  };

  export default setupSwagger;