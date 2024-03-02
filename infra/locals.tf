locals {
  lambda_validacao_arn              = "arn:aws:lambda:${var.region}:${data.aws_caller_identity.current.account_id}:function:${var.lambda_function_validacao_name}"
  lambda_gerenciar_levantamento_arn = "arn:aws:lambda:${var.region}:${data.aws_caller_identity.current.account_id}:function:${var.lambda_function_gerenciar_levantamentos_name}"
}
