variable "region" {
  type          = string
  description   = "Region in which to create resources"
}

variable "subnet_ids" {
  type          = list(string)
  description   = "Array of subnet ids"
}

variable "security_group_ids" {
  type          = list(string)
  description   = "Array of security_group_ids" 
}

variable "EMAIL_RECIPIENT_JSON" {
  type          = string
  description   = "Lambda Env variable"
}

# Name of Lambda
variable "production_name" {
  type          = string
  description   = "Name of Program"
}
variable "development_name" {
  type          = string
  description   = "Name of Program"
}
