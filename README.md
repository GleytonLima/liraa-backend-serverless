# LIRAa Backend Serverless

## Contexto

Este projeto é um backend serverless para o aplicativo LIRAa, que é um aplicativo para coleta de dados do Levantamento Rápido de Índices para Aedes aegypti (LIRAa) e do Índice de Breteau (IB) em municípios brasileiros. O aplicativo foi desenvolvido para fins acadêmicos.

## Tecnologias

O projeto foi desenvolvido utilizando as seguintes recursos da AWS:

- AWS Lambda
- AWS API Gateway
- AWS Cognito
- AWS SNS
- AWS SQS

Para o banco de dados, foi utilizado o MongoDB, que foi hospedado no MongoDB Atlas.

## Testes

Para testar o projeto, é necessário ter o Node.js instalado na máquina. Após clonar o repositório, basta executar o comando `npm install` para instalar as dependências do projeto. Em seguida, acesse a pasta `lambda` e execute o comando `npm run test` para rodar os testes.

## Implantação manual

Neste projeto utilizamos o terraform para a implantação dos recursos na AWS. Para implantar manualmente, é necessário ter o terraform instalado na máquina. Além disso, é necessário configurar
as credenciais da AWS no arquivo `~/.aws/credentials`.

As seguintes variáveis de ambiente são necessárias para a implantação:

```
export AWS_PROFILE=liraa
export TF_VAR_mongodb_username=seu usuario
export TF_VAR_mongodb_password=suasenha
export TF_VAR_mongodb_cluster=o cluster do seu banco de dados
export TF_VAR_google_client_id=seu cliente id criado via console do google
export TF_VAR_google_client_secret=seu cliente secret criado via console do google
```

 Após isso, acesse a pasta `terraform` e executar o comando `terraform init` para inicializar o terraform. Em seguida, execute o comando `terraform apply` para implantar os recursos na AWS.


## Github Actions

- https://github.com/aws-actions/configure-aws-credentials

- https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-amazon-web-services
