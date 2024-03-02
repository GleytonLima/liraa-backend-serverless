/*
resource "aws_secretsmanager_secret" "mongodb-creds" {
  name = "mongodb-creds"
}

resource "aws_secretsmanager_secret_version" "mongodb-creds-version" {
  secret_id = aws_secretsmanager_secret.mongodb-creds.id
  secret_string = jsonencode({
    username = var.mongodb_username
    password = var.mongodb_password
  })
}*/
