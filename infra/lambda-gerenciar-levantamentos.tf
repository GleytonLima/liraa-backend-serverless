data "aws_iam_policy_document" "lambda_gerenciar_levantamentos_policy" {
  statement {
    effect = "Allow"

    actions = [
      "sns:Publish",
      "logs:CreateLogStream",
      "logs:PutLogEvents",
    ]

    resources = ["*"]
  }
}

resource "aws_iam_role" "role_lambda_gerenciar_levantamentos" {
  name               = "liraa_role_for_lambda_gerenciar_levantamentos"
  assume_role_policy = data.aws_iam_policy_document.assume_role.json
}

resource "aws_iam_policy" "liraa_lambda_gerenciar_levantamentos_policy" {
  name   = "liraa_lambda_gerenciar_levantamentos_policy"
  policy = data.aws_iam_policy_document.lambda_gerenciar_levantamentos_policy.json
}

resource "aws_iam_role_policy_attachment" "lambda_gerenciar_levantamentos_policy" {
  role       = aws_iam_role.role_lambda_gerenciar_levantamentos.name
  policy_arn = aws_iam_policy.liraa_lambda_gerenciar_levantamentos_policy.arn
}

resource "aws_lambda_function" "lambda_gerenciar_levantamentos" {
  filename      = "../src/app.zip"
  function_name = var.lambda_function_gerenciar_levantamentos_name
  role          = aws_iam_role.role_lambda_gerenciar_levantamentos.arn
  handler       = "gerenciar-levantamentos.handler"
  memory_size   = 128
  timeout       = 15

  # The filebase64sha256() function is available in Terraform 0.11.12 and later
  # For Terraform 0.11.11 and earlier, use the base64sha256() function and the file() function:
  # source_code_hash = "${base64sha256(file("lambda_function_payload.zip"))}"
  source_code_hash = data.archive_file.app.output_base64sha256

  runtime = "nodejs20.x"

  environment {
    variables = {
      MONGODB_USERNAME = var.mongodb_username
      MONGODB_PASSWORD = var.mongodb_password
      MONGODB_CLUSTER  = var.mongodb_cluster
    }
  }
}

resource "aws_lambda_permission" "lambda_gerenciar_levantamentos" {
  statement_id  = "liraa-lambda-permission-statement"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.lambda_gerenciar_levantamentos.function_name
  principal     = "apigateway.amazonaws.com"
}

resource "aws_cloudwatch_log_group" "lambda_gerenciar_levantamentos" {
  name              = "/aws/lambda/${var.lambda_function_gerenciar_levantamentos_name}"
  retention_in_days = 3
}
