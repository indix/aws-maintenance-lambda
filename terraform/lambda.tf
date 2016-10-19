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

resource "aws_iam_role" "aws_maintenance_lambda" {
  name = "aws_maintenance_lambda_role"
  assume_role_policy = "${file("${path.module}/templates/role.json")}"
}

resource "aws_iam_role_policy" "aws_maintenance_lambda" {
  name = "aws_maintenance_lambda_role_policy"
  role = "${aws_iam_role.aws_maintenance_lambda.id}"
  policy = "${file("${path.module}/templates/policy.json")}"
}
