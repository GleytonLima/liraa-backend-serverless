resource "aws_api_gateway_rest_api" "example" {
  name        = "liraa-api"
  description = "LIRAa API"
  body = templatefile("${path.module}/openapi.yaml", {
    lambda_validacao_uri               = "arn:aws:apigateway:${var.region}:lambda:path/2015-03-31/functions/${local.lambda_validacao_arn}/invocations",
    lambda_gerenciar_levantamentos_uri = "arn:aws:apigateway:${var.region}:lambda:path/2015-03-31/functions/${local.lambda_gerenciar_levantamento_arn}/invocations",
    cognito_arn                        = "arn:aws:cognito-idp:${var.region}:${data.aws_caller_identity.current.account_id}:userpool/${aws_cognito_user_pool_client.example.user_pool_id}",
  })
}

resource "aws_api_gateway_deployment" "example" {
  rest_api_id = aws_api_gateway_rest_api.example.id

  triggers = {
    redeployment = sha1(jsonencode(aws_api_gateway_rest_api.example.body))
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_api_gateway_stage" "example" {
  deployment_id = aws_api_gateway_deployment.example.id
  rest_api_id   = aws_api_gateway_rest_api.example.id
  stage_name    = "dev"
}
