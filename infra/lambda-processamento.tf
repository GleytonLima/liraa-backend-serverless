data "aws_iam_policy_document" "lambda_processar_policy" {
  statement {
    effect = "Allow"
    actions = [
      "sqs:ReceiveMessage",
      "sqs:DeleteMessage",
      "sqs:GetQueueAttributes",
      "logs:CreateLogStream",
      "logs:PutLogEvents",
    ]
    resources = ["*"]
  }
}

resource "aws_iam_role" "role_lambda_processamento" {
  name               = "liraa_role_for_lambda_processamento"
  assume_role_policy = data.aws_iam_policy_document.assume_role.json
}

resource "aws_iam_policy" "liraa_lambda_processar_policy" {
  name   = "liraa_lambda_processamento_policy"
  policy = data.aws_iam_policy_document.lambda_processar_policy.json
}

resource "aws_iam_role_policy_attachment" "lambda_processar_policy" {
  role       = aws_iam_role.role_lambda_processamento.name
  policy_arn = aws_iam_policy.liraa_lambda_processar_policy.arn
}

resource "aws_lambda_function" "lambda_processamento" {
  filename      = "../src/app.zip"
  function_name = var.lambda_function_processamento_name
  role          = aws_iam_role.role_lambda_processamento.arn
  handler       = "processador.handler"
  memory_size   = 128
  timeout       = 30

  # The filebase64sha256() function is available in Terraform 0.11.12 and later
  # For Terraform 0.11.11 and earlier, use the base64sha256() function and the file() function:
  # source_code_hash = "${base64sha256(file("lambda_function_payload.zip"))}"
  source_code_hash = data.archive_file.app.output_base64sha256

  runtime = "nodejs14.x"

  environment {
    variables = {
      MONGODB_USERNAME = var.mongodb_username
      MONGODB_PASSWORD = var.mongodb_password
      MONGODB_CLUSTER  = var.mongodb_cluster
    }
  }
}

resource "aws_cloudwatch_log_group" "lambda_processador" {
  name              = "/aws/lambda/${var.lambda_function_processamento_name}"
  retention_in_days = 3
}
