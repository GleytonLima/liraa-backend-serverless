data "aws_iam_policy_document" "lambda_validador_policy" {
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

resource "aws_iam_role" "role_lambda_validacao" {
  name               = "liraa_role_for_lambda_validacao"
  assume_role_policy = data.aws_iam_policy_document.assume_role.json
}

resource "aws_iam_policy" "liraa_lambda_validador_policy" {
  name   = "liraa_lambda_validacao_policy"
  policy = data.aws_iam_policy_document.lambda_validador_policy.json
}

resource "aws_iam_role_policy_attachment" "lambda_validador_policy" {
  role       = aws_iam_role.role_lambda_validacao.name
  policy_arn = aws_iam_policy.liraa_lambda_validador_policy.arn
}

resource "aws_lambda_function" "lambda_validacao" {
  filename      = "../src/app.zip"
  function_name = var.lambda_function_validacao_name
  role          = aws_iam_role.role_lambda_validacao.arn
  handler       = "validador.handler"
  memory_size   = 128
  timeout       = 15

  # The filebase64sha256() function is available in Terraform 0.11.12 and later
  # For Terraform 0.11.11 and earlier, use the base64sha256() function and the file() function:
  # source_code_hash = "${base64sha256(file("lambda_function_payload.zip"))}"
  source_code_hash = data.archive_file.app.output_base64sha256

  runtime = "nodejs14.x"

  environment {
    variables = {}
  }
}

resource "aws_lambda_permission" "lambda_validacao" {
  statement_id  = "liraa-lambda-permission-statement"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.lambda_validacao.function_name
  principal     = "apigateway.amazonaws.com"
}

resource "aws_cloudwatch_log_group" "lambda_validador" {
  name              = "/aws/lambda/${var.lambda_function_validacao_name}"
  retention_in_days = 3
}
