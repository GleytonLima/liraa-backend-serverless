data "aws_caller_identity" "current" {}

resource "null_resource" "npm_install" {
  provisioner "local-exec" {
    command     = "${path.module}/scripts/install-dependencies.sh"
    interpreter = ["bash"]
  }
  triggers = {
    always_run = "${timestamp()}"
  }
}

data "archive_file" "app" {
  type        = "zip"
  output_path = "../src/app.zip"
  source_dir  = "../lambda/"

  depends_on = [
    null_resource.npm_install
  ]
}
