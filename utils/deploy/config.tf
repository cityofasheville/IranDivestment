terraform {
  backend "s3" {
    bucket = "avl-tfstate-store"
    key    = "terraform/iran_divestment/terraform_dev.tfstate"
    region = "us-east-1"
  }
}

data "terraform_remote_state" "iran_divestment_layer" {
  backend = "s3"
  config = {
    bucket = "avl-tfstate-store"
    key    = "terraform/iran_divestment/layer/terraform_dev.tfstate"
    region = "us-east-1"
  }
}

provider "aws" {
  region = var.region
}

resource "aws_lambda_function" "iran_divestment" {
  filename         = "function.zip"
  description      = "Lambda description" 
  function_name    = "iran_divestment"
  role             = aws_iam_role.iran_divestment-role.arn
  handler          = "index.handler"
  runtime          = "nodejs18.x"
  source_code_hash = filebase64sha256("function.zip")
  layers = [data.terraform_remote_state.iran_divestment_layer.outputs.iran_divestment_layer_arn]
  timeout          = 900
  # memory_size      = 256
  vpc_config {
    subnet_ids         = var.subnet_ids
    security_group_ids = var.security_group_ids
  }
  environment {
    variables = {
      EMAIL_RECIPIENT_JSON = jsonencode(
                    [
                      "jtwilson@ashevillenc.gov",
                      "tandrews@ashevillenc.gov"
                    ]
                )
    }
  }
  tags = {
    Name          = "iran_divestment"
    "coa:application" = "iran_divestment"
    "coa:department"  = "information-technology"
    "coa:owner"       = "jtwilson@ashevillenc.gov"
    "coa:owner-team"  = "dev"
    Description   = "Email report listing any Iranian companies in CoA vendor list"
  }
}

output "iran_divestment_arn" {
  value = aws_lambda_function.iran_divestment.arn
}
