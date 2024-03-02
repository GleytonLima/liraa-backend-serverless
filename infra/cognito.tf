resource "aws_cognito_user_pool" "example" {
  name                       = "example-user-pool"
  auto_verified_attributes   = []
  email_verification_message = "Código de verificação: {####}"
  email_verification_subject = "Verificação de e-mail"
  admin_create_user_config {
    allow_admin_create_user_only = false
  }
  password_policy {
    temporary_password_validity_days = 7
    minimum_length                   = 6
    require_uppercase                = false
    require_symbols                  = false
    require_numbers                  = false
  }
}

resource "aws_cognito_identity_provider" "google" {
  user_pool_id  = aws_cognito_user_pool.example.id
  provider_name = "Google"
  provider_type = "Google"


  provider_details = {
    client_id        = var.google_client_id
    client_secret    = var.google_client_secret
    authorize_scopes = "profile email openid"
  }

  idp_identifiers = ["accounts.google.com"]

  attribute_mapping = {
    email    = "email"
    username = "sub"
  }
}

resource "aws_cognito_user_pool_domain" "example" {
  domain       = "liraadev"
  user_pool_id = aws_cognito_user_pool.example.id
}

resource "aws_cognito_user_pool_client" "example" {
  depends_on                           = [aws_cognito_identity_provider.google]
  name                                 = "example-app-client"
  user_pool_id                         = aws_cognito_user_pool.example.id
  allowed_oauth_flows_user_pool_client = true
  explicit_auth_flows                  = ["USER_PASSWORD_AUTH"]
  generate_secret                      = false
  allowed_oauth_flows                  = ["code"]
  allowed_oauth_scopes = [
    "email",
    "openid",
    "profile"
  ]
  callback_urls = [
    "http://localhost:4200",
    "https://liraa-app.web.app"
  ]
  supported_identity_providers = ["COGNITO", "Google"]

  access_token_validity  = 3600
  id_token_validity      = 60
  refresh_token_validity = 10

  token_validity_units {
    access_token  = "seconds"
    id_token      = "minutes"
    refresh_token = "days"
  }
}

# o código a seguir criar um grupo de usuários
resource "aws_cognito_user_group" "example" {
  name         = "user-group"
  user_pool_id = aws_cognito_user_pool.example.id
  depends_on   = [aws_cognito_user_pool.example]
}

resource "aws_cognito_user_group" "admin" {
  name         = "admin-group"
  user_pool_id = aws_cognito_user_pool.example.id
  depends_on   = [aws_cognito_user_pool.example]
}

resource "aws_cognito_user" "example" {
  username = "exampleuser"
  password = "examplepassword"
  attributes = {
    email          = "gleytonclima@gmail.com"
    email_verified = true
  }
  user_pool_id = aws_cognito_user_pool.example.id
  depends_on   = [aws_cognito_user_pool.example]
}

# o ideal é que o usuário admin seja criado manualmente. aqui é apenas um exemplo
resource "aws_cognito_user" "admin" {
  username = "exampleadminuser"
  password = "exampleadminpassword"
  attributes = {
    email          = "gleytonclima@gmail.com"
    email_verified = true
  }
  user_pool_id = aws_cognito_user_pool.example.id
  depends_on   = [aws_cognito_user_pool.example]
}

resource "aws_cognito_user_in_group" "example" {
  username     = aws_cognito_user.example.username
  group_name   = aws_cognito_user_group.example.name
  user_pool_id = aws_cognito_user_pool.example.id
  depends_on = [
    aws_cognito_user_pool.example,
    aws_cognito_user_group.example,
    aws_cognito_user.example
  ]
}

resource "aws_cognito_user_in_group" "admin" {
  username     = aws_cognito_user.admin.username
  group_name   = aws_cognito_user_group.admin.name
  user_pool_id = aws_cognito_user_pool.example.id
  depends_on = [
    aws_cognito_user_pool.example,
    aws_cognito_user_group.admin,
    aws_cognito_user.admin
  ]
}


resource "aws_cognito_user_pool_ui_customization" "example" {
  css        = ".label-customizable {font-weight: 400;}"
  image_file = filebase64("logo.png")

  user_pool_id = aws_cognito_user_pool_domain.example.user_pool_id
}
