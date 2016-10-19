resource "null_resource" "aws_maintenance_lambda" {
  triggers = {
    package_json = "${base64sha256(file("${path.root}/../lambda/package.json"))}"
  }

  provisioner "local-exec" {
    command = "cd ${path.root}/../lambda && npm install"
  }
}

resource "archive_file" "aws_maintenance_lambda" {
  type = "zip"
  source_dir = "../lambda"
  output_path = "../dist/lambda/aws_maintenance_lambda.zip"

  depends_on = ["null_resource.aws_maintenance_lambda"]
}
