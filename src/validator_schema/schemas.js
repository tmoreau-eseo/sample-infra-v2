// validation schema file
//

var loginSchema = {
    "type": "object",
    "properties": {
        "username": {"type": "string"},
        "password": {"type": "string"},
    },
    "required": ["username", "password"]
};

var pushDataSchema = {
    "type": "object",
    "properties": {
        "jwt": {"type": "string"},
        "data": {"type": "string"},
    },
    "required": ["jwt", "data"]
};

module.exports={loginSchema, pushDataSchema};