# a fila aws sqs a seguir recebe os registros validados pelo lambda
resource "aws_sqs_queue" "liraa_registros_validados" {
  name = "liraa-registros-validados"
  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.liraa_registros_validados_deadletter.arn
    maxReceiveCount     = 3
  })
}

resource "aws_sqs_queue" "liraa_registros_validados_deadletter" {
  name = "liraa-registros-validados-dlq"
}

resource "aws_sqs_queue_policy" "orders_to_process_subscription" {
  queue_url = aws_sqs_queue.liraa_registros_validados.id
  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Effect" : "Allow",
        "Principal" : {
          "Service" : "sns.amazonaws.com"
        },
        "Action" : [
          "sqs:SendMessage"
        ],
        "Resource" : [
          aws_sqs_queue.liraa_registros_validados.arn
        ],
        "Condition" : {
          "ArnEquals" : {
            "aws:SourceArn" : aws_sns_topic.liraa_registros_validados.arn
          }
        }
      }
    ]
  })
}

# o lambda é acionado quando uma mensagem é publicada na fila
resource "aws_lambda_event_source_mapping" "liraa_registros_validados" {
  event_source_arn = aws_sqs_queue.liraa_registros_validados.arn
  function_name    = aws_lambda_function.lambda_processamento.arn
  batch_size       = 1
}
