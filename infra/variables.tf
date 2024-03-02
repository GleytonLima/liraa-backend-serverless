variable "region" {
  description = "A região onde os recursos serão criados"
  default     = "us-east-1"
}


variable "lambda_function_processamento_name" {
  description = "O nome da função lambda que processa os registros"
  default     = "liraa_processador"
}

variable "lambda_function_validacao_name" {
  description = "O nome da função lambda que valida os registros"
  default     = "liraa_validador"
}

variable "lambda_function_gerenciar_levantamentos_name" {
  description = "O nome da função lambda que gerencia os registros"
  default     = "liraa_gerenciar_levantamentos"
}

variable "mongodb_username" {
  type      = string
  sensitive = true
}

variable "mongodb_password" {
  type      = string
  sensitive = true
}


variable "mongodb_cluster" {
  type      = string
  sensitive = true
}

variable "google_client_id" {
  type      = string
  sensitive = true
}

variable "google_client_secret" {
  type      = string
  sensitive = true
}
