# Stone

## Aplicação feita utilizando Serverless e DynamoDB. Além do Jest para testes unitários

### Rotas

#### IncrementCounter

    - incrementa ou inicia o contador para uma chave passada.
    
    - Method: Get
    
    - url: https://u3njnkryfg.execute-api.sa-east-1.amazonaws.com/counter/<chave>
    
    - Returns: 
    {
        message: 'Hit at <chave>'
    }

#### GetCounter

    - Retorna a quantidade de hits em uma chave passada
    
    - Method: POST
    
    - url: https://u3njnkryfg.execute-api.sa-east-1.amazonaws.com/counter/<chave>
    
    - Returns: 
    {
        message: '<number> hits at <chave>'
    }

#### CreateUser

    - Permite a criação de um usuário e retorna um token jwt que deve ser usado quando chamar a GetUser
    
    - Method: POST
    
    - url: https://u3njnkryfg.execute-api.sa-east-1.amazonaws.com/user/
    
    - Request (body):
    {
        username: 'user123',
        password: 'pass123'
    }

    - Returns: 
    {
        message: "User <username> created successfully with id <userId>",
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...."
    }

#### GetUser

    - Permite obter os dados do usuário para um id passado
    
    - Method: GET
    
    - url: https://u3njnkryfg.execute-api.sa-east-1.amazonaws.com/user/<id>
    
    Request (headers):
        - Authorization: Bearer token obtido na criação do usuário, sendo valido somente o associado aquele usuário
 
    - Returns: 
    {
        id: "<id>",
        username: "user123"
    }
