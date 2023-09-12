resource "aws_iam_role" "iran_divestment-role" {
    name = "iran_divestment-role"
    assume_role_policy = file("./policy_role.json")
    tags = {
      Name          = "iran_divestment-role"
      "coa:application" = "iran_divestment"
      "coa:department"  = "information-technology"
      "coa:owner"       = "jtwilson@ashevillenc.gov"
      "coa:owner-team"  = "dev"
      Description   = "Role used by Iran Divestment lambda function."
    }
}

# Lambda Basic Execution
resource "aws_iam_role_policy_attachment" "lambda_basic-iran_divestment" {
    role        = aws_iam_role.iran_divestment-role.name
    policy_arn  = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# VPC (databases)
resource "aws_iam_role_policy_attachment" "lambda_vpc_access" {
    role        = aws_iam_role.iran_divestment-role.name
    policy_arn  = "arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole"
}

# Secrets Manager
resource "aws_iam_policy" "secrets_manager_policy-iran_divestment" {
  name        = "secrets_manager_policy-iran_divestment"
  description = "Read secrets"
  policy = templatefile("./policy_secrets_manager.json",{})
}
resource "aws_iam_role_policy_attachment" "secrets_manager" {
    role        = aws_iam_role.iran_divestment-role.name
    policy_arn  = aws_iam_policy.secrets_manager_policy-iran_divestment.arn
}

# SES
resource "aws_iam_role_policy_attachment" "lambda_ses_access-iran_divestment" {
    role        = aws_iam_role.iran_divestment-role.name
    policy_arn  = "arn:aws:iam::aws:policy/AmazonSESFullAccess"
}

# 

output "prog_name_role_arn" {
  value = "${aws_iam_role.iran_divestment-role.arn}"
}