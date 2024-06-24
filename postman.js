{
  "info": {
    "_postman_id": "a unique identifier for your collection",
    "name": "My API Collection",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Signup",
      "request": {
        "method": "POST",
        "header": [],
        "body": {
          "mode": "raw",
          "raw": "{\n    \"email\": \"\",\n    \"password\": \"\",\n    \"name\": \"\",\n    \"surname\": \"\",\n    \"phone\": \"\"\n}",
          "options": {
            "raw": {
              "language": "json"
            }
          }
        },
        "url": {
          "raw": "{{url}}/signup",
          "host": [
            "{{url}}"
          ],
          "path": [
            "signup"
          ]
        }
      }
    },
    {
      "name": "Login",
      "request": {
        "method": "POST",
        "header": [],
        "body": {
          "mode": "raw",
          "raw": "{\n    \"email\": \"\",\n    \"password\": \"\"\n}",
          "options": {
            "raw": {
              "language": "json"
            }
          }
        },
        "url": {
          "raw": "{{url}}/login",
          "host": [
            "{{url}}"
          ],
          "path": [
            "login"
          ]
        }
      }
    },
    {
      "name": "Get All Users",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{url}}/users",
          "host": [
            "{{url}}"
          ],
          "path": [
            "users"
          ]
        }
      }
    },
    {
      "name": "Get User by ID",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{url}}/users/:id",
          "host": [
            "{{url}}"
          ],
          "path": [
            "users",
            ":id"
          ]
        }
      }
    },
    {
      "name": "Update User",
      "request": {
        "method": "PATCH",
        "header": [],
        "body": {
          "mode": "raw",
          "raw": "{}",
          "options": {
            "raw": {
              "language": "json"
            }
          }
        },
        "url": {
          "raw": "{{url}}/users/:id",
          "host": [
            "{{url}}"
          ],
          "path": [
            "users",
            ":id"
          ]
        }
      }
    },
    {
      "name": "Delete User",
      "request": {
        "method": "DELETE",
        "header": [],
        "url": {
          "raw": "{{url}}/users/:id",
          "host": [
            "{{url}}"
          ],
          "path": [
            "users",
            ":id"
          ]
        }
      }
    }
  ]
}