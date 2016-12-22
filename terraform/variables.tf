variable "max_retries" {
  default = "100"
}

variable "aws_region" {
  default = "us-east-1"
}

variable "lamba_schedue" {
  default = "60 minutes"
}

variable "lambda_role_arn" {
  default = ""
}

variable "lambda_source_dir" {
  default = "../lambda"
}

variable "lambda_prepared_source_dir" {
  default = "../lambda"
}

variable "lambda_archive_path" {
  default = "../dist/aws_maintenance_lambda.zip"
}

variable "config_json" {
  default = "../config.json"
}

variable "force_lambda_update" {
  "default" = ""
}
