terraform {
  backend "s3" {
    bucket = "avl-tfstate-store"
    key    = "terraform/iran_divestment/layer/terraform_dev.tfstate"
    region = "us-east-1"
  }
}

provider "aws" {
  region = var.region
}

resource "aws_lambda_layer_version" "iran_divestment_layer" {
  filename   = "layer.zip"
  source_code_hash = filebase64sha256("layer.zip")
  layer_name = "iran_divestment_layer"
  description = "@aws-sdk/client-secrets-manager @aws-sdk/client-ses pg pg-cursor pug"
}

output "iran_divestment_layer_arn" {
  value = aws_lambda_layer_version.iran_divestment_layer.arn
}
