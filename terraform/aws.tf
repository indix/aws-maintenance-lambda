provider "aws" {
  region = "${var.aws_region}"
  max_retries = "${var.max_retries}"
}
