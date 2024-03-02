
resource "aws_sns_topic" "liraa_registros_validados" {
  name = "liraa-registros-validados"
}

# a fila se inscreve no tópico sns para receber as mensagens
resource "aws_sns_topic_subscription" "liraa_registros_validados" {
  protocol             = "sqs"
  raw_message_delivery = true
  topic_arn            = aws_sns_topic.liraa_registros_validados.arn
  endpoint             = aws_sqs_queue.liraa_registros_validados.arn
}
